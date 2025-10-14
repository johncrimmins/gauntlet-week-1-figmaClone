/**
 * useCursors Hook
 * 
 * This hook manages real-time cursor positions in the collaborative canvas.
 * It subscribes to cursor updates, provides a throttled method to update
 * the current user's cursor, and handles cleanup on unmount.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CursorPosition } from '../types/canvas.types';
import * as cursorService from '../services/cursor.service';
import { throttle } from '../utils/throttle';

/**
 * Hook return type with cursor state and methods
 */
interface UseCursorsReturn {
  cursors: Record<string, CursorPosition>;
  updateMyCursor: (x: number, y: number) => void;
}

/**
 * Custom hook for managing real-time cursor positions in the canvas
 * 
 * Automatically subscribes to cursor updates and provides a throttled
 * method (100ms) to update the current user's cursor position.
 * Cleans up cursor data on unmount.
 * 
 * @param userId - Current user's unique identifier
 * @param displayName - Current user's display name
 * @param color - Current user's assigned color
 * @returns Object containing cursors map and update method
 * 
 * @example
 * const { cursors, updateMyCursor } = useCursors(user.id, user.displayName, user.color);
 * 
 * // In canvas mouse move handler:
 * const handleMouseMove = (e) => {
 *   updateMyCursor(e.clientX, e.clientY);
 * };
 * 
 * // Render other users' cursors:
 * {Object.entries(cursors).map(([id, cursor]) => 
 *   id !== userId && <Cursor key={id} {...cursor} />
 * )}
 */
export function useCursors(
  userId: string | null,
  displayName: string | null,
  color: string | null
): UseCursorsReturn {
  const [cursors, setCursors] = useState<Record<string, CursorPosition>>({});
  
  // Use refs to keep user info stable for throttled function
  const userIdRef = useRef(userId);
  const displayNameRef = useRef(displayName);
  const colorRef = useRef(color);
  
  // Update refs when props change
  useEffect(() => {
    userIdRef.current = userId;
    displayNameRef.current = displayName;
    colorRef.current = color;
  }, [userId, displayName, color]);

  // Create throttled update function with useCallback to maintain stable reference
  const updateMyCursor = useCallback(
    throttle((x: number, y: number) => {
      const currentUserId = userIdRef.current;
      const currentDisplayName = displayNameRef.current;
      const currentColor = colorRef.current;
      
      if (!currentUserId || !currentDisplayName || !currentColor) {
        return;
      }
      
      cursorService
        .updateCursorPosition(currentUserId, x, y, currentDisplayName, currentColor)
        .catch((error) => {
          console.error('Failed to update cursor position:', error);
        });
    }, 100), // 100ms = 10 updates per second
    []
  );

  useEffect(() => {
    // Don't subscribe if user info is not available
    if (!userId || !displayName || !color) {
      return;
    }

    // Initialize cursor with onDisconnect handler (called ONCE)
    cursorService.initializeCursor(userId).catch((error) => {
      console.error('Failed to initialize cursor:', error);
    });

    // Subscribe to cursor updates
    const unsubscribe = cursorService.subscribeToCursors((cursorsData) => {
      setCursors(cursorsData);
    });

    // Cleanup: Only unsubscribe - onDisconnect handles cursor removal automatically
    // Manual removal here causes PERMISSION_DENIED errors and conflicts with onDisconnect
    return () => {
      unsubscribe();
    };
  }, [userId, displayName, color]);

  return {
    cursors,
    updateMyCursor,
  };
}

