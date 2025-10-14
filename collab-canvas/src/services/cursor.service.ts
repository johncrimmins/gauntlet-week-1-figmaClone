/**
 * Cursor Service
 * 
 * This service manages real-time cursor positions in the collaborative canvas.
 * It handles updating cursor positions, subscribing to cursor changes, and
 * automatic cleanup on disconnect using Firebase Realtime Database.
 */

import { ref, set, remove, onValue, onDisconnect } from 'firebase/database';
import { database } from './firebase';
import type { CursorPosition } from '../types/canvas.types';

/**
 * Initializes cursor presence with automatic cleanup on disconnect
 * 
 * This should be called ONCE when a user joins the canvas to set up
 * the onDisconnect handler. Calling it on every cursor update causes
 * performance issues.
 * 
 * @param userId - Unique identifier for the user
 * @returns Promise that resolves when initialization is complete
 * @throws Error if initialization fails
 */
export async function initializeCursor(userId: string): Promise<void> {
  try {
    const cursorRef = ref(database, `cursors/${userId}`);
    
    // Set up automatic cleanup when user disconnects
    // This only needs to be done ONCE per session
    await onDisconnect(cursorRef).remove();
  } catch (error) {
    console.error('Failed to initialize cursor:', error);
    throw error;
  }
}

/**
 * Updates a user's cursor position in the database
 * 
 * Should be called with throttling (recommended: 100ms) to limit database writes.
 * Note: Does NOT set up onDisconnect - call initializeCursor() once first.
 * 
 * @param userId - Unique identifier for the user
 * @param x - X coordinate position on canvas
 * @param y - Y coordinate position on canvas
 * @param displayName - User's display name for cursor label
 * @param color - User's color for cursor styling
 * @returns Promise that resolves when cursor position is updated
 * @throws Error if updating cursor position fails
 */
export async function updateCursorPosition(
  userId: string,
  x: number,
  y: number,
  displayName: string,
  color: string
): Promise<void> {
  try {
    const cursorRef = ref(database, `cursors/${userId}`);
    
    // Update the cursor position data
    // DO NOT set onDisconnect here - it causes performance issues
    await set(cursorRef, {
      userId,
      x,
      y,
      displayName,
      color,
    });
  } catch (error) {
    console.error('Failed to update cursor position:', error);
    throw error;
  }
}

/**
 * Removes a user's cursor from the database
 * 
 * Typically called when a user logs out or leaves the canvas.
 * 
 * @param userId - Unique identifier for the user
 * @returns Promise that resolves when cursor is removed
 * @throws Error if removing cursor fails
 */
export async function removeCursor(userId: string): Promise<void> {
  try {
    const cursorRef = ref(database, `cursors/${userId}`);
    await remove(cursorRef);
  } catch (error) {
    console.error('Failed to remove cursor:', error);
    throw error;
  }
}

/**
 * Subscribes to cursor position changes for all users
 * 
 * The callback will be invoked whenever any user's cursor position changes.
 * Returns a map of userId to CursorPosition for efficient lookups.
 * 
 * @param callback - Function to call with updated cursor data
 * @returns Unsubscribe function to stop listening to changes
 */
export function subscribeToCursors(
  callback: (cursors: Record<string, CursorPosition>) => void
): () => void {
  const cursorsRef = ref(database, 'cursors');
  
  const unsubscribe = onValue(cursorsRef, (snapshot) => {
    const cursorsData = snapshot.val();
    
    if (!cursorsData) {
      // No cursors present
      callback({});
      return;
    }
    
    // Firebase returns an object with userId as keys
    callback(cursorsData as Record<string, CursorPosition>);
  });
  
  return unsubscribe;
}

