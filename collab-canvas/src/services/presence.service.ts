/**
 * Presence Service
 * 
 * This service manages user presence information in the collaborative session.
 * It handles setting users online/offline and subscribing to presence changes
 * using Firebase Realtime Database with automatic cleanup on disconnect.
 */

import { ref, set, remove, onValue, onDisconnect } from 'firebase/database';
import { database } from './firebase';
import type { PresenceUser } from '../types/user.types';

/**
 * Sets a user as online in the presence system
 * 
 * Uses Firebase onDisconnect to automatically remove presence when the user
 * disconnects or closes their browser.
 * 
 * @param userId - Unique identifier for the user
 * @param displayName - User's display name
 * @param color - User's assigned color for visual identification
 * @returns Promise that resolves when presence is set
 * @throws Error if setting presence fails
 */
export async function setUserOnline(
  userId: string,
  displayName: string,
  color: string
): Promise<void> {
  try {
    const presenceRef = ref(database, `presence/${userId}`);
    
    // Set up automatic cleanup when user disconnects
    await onDisconnect(presenceRef).remove();
    
    // Set the user's presence data
    await set(presenceRef, {
      userId,
      displayName,
      color,
    });
  } catch (error) {
    console.error('Failed to set user online:', error);
    throw error;
  }
}

/**
 * Sets a user as offline by removing their presence node
 * 
 * @param userId - Unique identifier for the user
 * @returns Promise that resolves when presence is removed
 * @throws Error if removing presence fails
 */
export async function setUserOffline(userId: string): Promise<void> {
  try {
    const presenceRef = ref(database, `presence/${userId}`);
    await remove(presenceRef);
  } catch (error) {
    console.error('Failed to set user offline:', error);
    throw error;
  }
}

/**
 * Subscribes to presence changes for all users
 * 
 * The callback will be invoked whenever any user's presence changes
 * (user comes online, goes offline, or updates their info).
 * 
 * @param callback - Function to call with updated presence data
 * @returns Unsubscribe function to stop listening to changes
 */
export function subscribeToPresence(
  callback: (users: PresenceUser[]) => void
): () => void {
  const presenceRef = ref(database, 'presence');
  
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const presenceData = snapshot.val();
    
    if (!presenceData) {
      // No users online
      callback([]);
      return;
    }
    
    // Convert presence data object to array of PresenceUser
    const users: PresenceUser[] = Object.values(presenceData);
    callback(users);
  });
  
  return unsubscribe;
}

