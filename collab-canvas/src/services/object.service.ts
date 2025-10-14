/**
 * Canvas Object Service
 * 
 * Service for managing canvas objects (shapes) in Firebase Realtime Database.
 * Provides CRUD operations and real-time synchronization for collaborative object editing.
 */

import { ref, set, update, remove, onValue, off } from 'firebase/database';
import type { DataSnapshot } from 'firebase/database';
import { database } from './firebase';
import type { RectangleObject, ObjectsMap } from '../types/object.types';

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

