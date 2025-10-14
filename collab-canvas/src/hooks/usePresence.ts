/**
 * usePresence Hook
 * 
 * This hook manages user presence in the collaborative session.
 * It sets the current user online, subscribes to presence updates,
 * and handles cleanup when the component unmounts.
 */

import { useState, useEffect } from 'react';
import type { PresenceUser } from '../types/user.types';
import * as presenceService from '../services/presence.service';

/**
 * Hook return type with presence state
 */
interface UsePresenceReturn {
  onlineUsers: PresenceUser[];
}

/**
 * Custom hook for managing user presence in collaborative sessions
 * 
 * Automatically sets the current user as online when mounted and subscribes
 * to real-time presence updates. Cleans up on unmount.
 * 
 * @param userId - Current user's unique identifier
 * @param displayName - Current user's display name
 * @param color - Current user's assigned color
 * @returns Object containing array of online users
 * 
 * @example
 * const { onlineUsers } = usePresence(user.id, user.displayName, user.color);
 * 
 * return (
 *   <div>
 *     {onlineUsers.map(user => <UserAvatar key={user.userId} {...user} />)}
 *   </div>
 * );
 */
export function usePresence(
  userId: string | null,
  displayName: string | null,
  color: string | null
): UsePresenceReturn {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    // Don't set presence if user info is not available
    if (!userId || !displayName || !color) {
      return;
    }

    // Set current user as online
    presenceService.setUserOnline(userId, displayName, color).catch((error) => {
      console.error('Failed to set user online:', error);
    });

    // Subscribe to presence updates
    const unsubscribe = presenceService.subscribeToPresence((users) => {
      setOnlineUsers(users);
    });

    // Cleanup: Only unsubscribe - onDisconnect handles presence removal automatically
    // Manual removal here causes PERMISSION_DENIED errors and conflicts with onDisconnect
    return () => {
      unsubscribe();
    };
  }, [userId, displayName, color]);

  return {
    onlineUsers,
  };
}

