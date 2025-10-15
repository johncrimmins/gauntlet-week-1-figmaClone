/**
 * Canvas Object Service
 * 
 * Service for managing canvas objects (shapes) in Firebase Realtime Database.
 * Provides CRUD operations and real-time synchronization for collaborative object editing.
 */

import { ref, set, update, remove, onValue, off, runTransaction, onDisconnect } from 'firebase/database';
import type { DataSnapshot } from 'firebase/database';
import { database } from './firebase';
import type { RectangleObject, ObjectsMap } from '../types/object.types';

/**
 * Validates that a position value is a valid number
 * 
 * @param value - Value to validate
 * @returns True if valid, false otherwise
 */
function isValidPosition(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validates an object's position data before writing to Firebase
 * 
 * @param updates - Object updates to validate
 * @throws Error if position data is invalid
 */
function validateObjectUpdate(updates: Partial<RectangleObject>): void {
  if ('x' in updates && !isValidPosition(updates.x!)) {
    throw new Error(`Invalid x position: ${updates.x}`);
  }
  if ('y' in updates && !isValidPosition(updates.y!)) {
    throw new Error(`Invalid y position: ${updates.y}`);
  }
  if ('width' in updates && !isValidPosition(updates.width!)) {
    throw new Error(`Invalid width: ${updates.width}`);
  }
  if ('height' in updates && !isValidPosition(updates.height!)) {
    throw new Error(`Invalid height: ${updates.height}`);
  }
}

/**
 * Creates a new canvas object in the database
 * 
 * Adds the object to `/objects/{objectId}` in Firebase Realtime Database.
 * All connected clients will receive this update via their subscriptions.
 * 
 * @param object - The canvas object to create
 * @returns Promise that resolves when object is created
 * 
 * @example
 * await createObject({
 *   id: 'rect_123',
 *   type: 'rectangle',
 *   x: 100,
 *   y: 150,
 *   width: 200,
 *   height: 100,
 *   color: '#FF6B6B',
 *   lockedBy: null
 * });
 */
export async function createObject(object: RectangleObject): Promise<void> {
  // Validate object data before creating
  validateObjectUpdate(object);
  
  const objectRef = ref(database, `objects/${object.id}`);
  await set(objectRef, object);
}

/**
 * Updates an existing canvas object with partial data
 * 
 * Uses Firebase update() to modify only the specified fields without
 * overwriting the entire object. Useful for position updates during dragging.
 * 
 * @param objectId - ID of the object to update
 * @param updates - Partial object data to update
 * @returns Promise that resolves when update is complete
 * 
 * @example
 * // Update position only
 * await updateObject('rect_123', { x: 150, y: 200 });
 * 
 * // Update lock state
 * await updateObject('rect_123', { lockedBy: 'user_456' });
 */
export async function updateObject(
  objectId: string,
  updates: Partial<RectangleObject>
): Promise<void> {
  // Validate updates before writing to Firebase
  validateObjectUpdate(updates);
  
  const objectRef = ref(database, `objects/${objectId}`);
  await update(objectRef, updates);
}

/**
 * Deletes a canvas object from the database
 * 
 * Removes the object from `/objects/{objectId}`. All clients will
 * receive the deletion event and remove it from their local state.
 * 
 * @param objectId - ID of the object to delete
 * @returns Promise that resolves when deletion is complete
 * 
 * @example
 * await deleteObject('rect_123');
 */
export async function deleteObject(objectId: string): Promise<void> {
  const objectRef = ref(database, `objects/${objectId}`);
  await remove(objectRef);
}

/**
 * Subscribes to real-time updates for all canvas objects
 * 
 * Listens to `/objects` in Firebase and calls the callback whenever
 * any object is created, updated, or deleted. The callback receives
 * the complete objects map.
 * 
 * @param callback - Function called with updated objects map
 * @returns Cleanup function to unsubscribe from updates
 * 
 * @example
 * const unsubscribe = subscribeToObjects((objects) => {
 *   console.log('Objects updated:', objects);
 *   setObjects(objects);
 * });
 * 
 * // Later, when component unmounts:
 * unsubscribe();
 */
export function subscribeToObjects(
  callback: (objects: ObjectsMap) => void
): () => void {
  const objectsRef = ref(database, 'objects');
  
  const handleValue = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    // Convert null to empty object for consistent handling
    const objects: ObjectsMap = data || {};
    callback(objects);
  };
  
  // Start listening
  onValue(objectsRef, handleValue);
  
  // Return cleanup function
  return () => {
    off(objectsRef, 'value', handleValue);
  };
}

/**
 * Attempts to acquire a lock on an object using a transaction
 * 
 * Uses Firebase transaction to atomically check if the object is unlocked
 * and set the lock if available. This prevents race conditions where multiple
 * users try to lock the same object simultaneously.
 * 
 * Also sets up an onDisconnect handler to automatically release the lock
 * if the user disconnects while holding it.
 * 
 * @param objectId - ID of the object to lock
 * @param userId - ID of the user acquiring the lock
 * @returns Promise that resolves to true if lock was acquired, false otherwise
 * 
 * @example
 * const acquired = await acquireLock('rect_123', 'user_456');
 * if (acquired) {
 *   console.log('Lock acquired, can drag object');
 * } else {
 *   console.log('Object is locked by another user');
 * }
 */
export async function acquireLock(objectId: string, userId: string): Promise<boolean> {
  const lockRef = ref(database, `objects/${objectId}/lockedBy`);
  
  try {
    const result = await runTransaction(lockRef, (currentLock) => {
      // If there's no lock or it's our lock, we can acquire it
      if (!currentLock || currentLock === userId) {
        return userId;
      }
      // Otherwise abort - someone else has the lock
      return; // Returning undefined aborts the transaction
    });
    
    if (result.committed) {
      // Set up automatic cleanup on disconnect
      await onDisconnect(lockRef).remove();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error acquiring lock:', error);
    return false;
  }
}

/**
 * Releases a lock on an object
 * 
 * Clears the lockedBy field by setting it to null. This allows other
 * users to acquire the lock and drag the object.
 * 
 * @param objectId - ID of the object to unlock
 * @returns Promise that resolves when lock is released
 * 
 * @example
 * await releaseLock('rect_123');
 */
export async function releaseLock(objectId: string): Promise<void> {
  const lockRef = ref(database, `objects/${objectId}/lockedBy`);
  await set(lockRef, null);
}

/**
 * Updates object position during drag (lightweight, no validation)
 * 
 * This is a lightweight version of updateObject specifically for real-time
 * position updates during dragging. Skips validation for performance since
 * the final position will be validated on dragEnd.
 * 
 * @param objectId - ID of the object to update
 * @param x - New X coordinate
 * @param y - New Y coordinate
 * @returns Promise that resolves when update is complete
 * 
 * @example
 * // Called repeatedly during drag (throttled)
 * await updateObjectPositionDuringDrag('rect_123', 150, 200);
 */
export async function updateObjectPositionDuringDrag(
  objectId: string,
  x: number,
  y: number
): Promise<void> {
  const objectRef = ref(database, `objects/${objectId}`);
  await update(objectRef, { x, y });
}

/**
 * Clears all objects from the database (emergency cleanup)
 * 
 * Use this to recover from corrupted data states. This will delete
 * all objects from Firebase, requiring users to recreate them.
 * 
 * @returns Promise that resolves when all objects are cleared
 * 
 * @example
 * await clearAllObjects();
 */
export async function clearAllObjects(): Promise<void> {
  const objectsRef = ref(database, 'objects');
  await remove(objectsRef);
  console.log('All objects cleared from Firebase');
}

