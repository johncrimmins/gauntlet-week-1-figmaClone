/**
 * useCanvas Hook
 * 
 * Manages the canvas viewport state (pan position and zoom level) with
 * automatic persistence to localStorage. Provides methods to update the
 * viewport and ensures the user's view is maintained across sessions.
 */

import { useState, useEffect, useRef } from 'react';
import type { ViewportState } from '../types/canvas.types';

/**
 * Hook return type with viewport state and update method
 */
interface UseCanvasReturn {
  viewport: ViewportState;
  setViewport: (viewport: ViewportState) => void;
}

const STORAGE_KEY = 'canvasViewport';
const DEFAULT_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  scale: 1,
};

/**
 * Custom hook for managing canvas viewport with localStorage persistence
 * 
 * Automatically loads viewport state from localStorage on mount and saves
 * changes with a 500ms debounce to reduce storage writes. This ensures
 * the user's pan/zoom position is maintained across page refreshes.
 * 
 * @returns Object containing viewport state and setter method
 * 
 * @example
 * const { viewport, setViewport } = useCanvas();
 * 
 * // In Stage component:
 * <Stage
 *   x={viewport.x}
 *   y={viewport.y}
 *   scaleX={viewport.scale}
 *   scaleY={viewport.scale}
 *   onDragEnd={(e) => {
 *     const stage = e.target;
 *     setViewport({ ...viewport, x: stage.x(), y: stage.y() });
 *   }}
 * />
 */
export function useCanvas(): UseCanvasReturn {
  // Load initial viewport from localStorage or use default
  const [viewport, setViewport] = useState<ViewportState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that parsed data has required properties
        if (
          typeof parsed.x === 'number' &&
          typeof parsed.y === 'number' &&
          typeof parsed.scale === 'number'
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load viewport from localStorage:', error);
    }
    return DEFAULT_VIEWPORT;
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save viewport to localStorage with debouncing
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to save after 500ms
    debounceTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewport));
      } catch (error) {
        console.error('Failed to save viewport to localStorage:', error);
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [viewport]);

  return {
    viewport,
    setViewport,
  };
}

