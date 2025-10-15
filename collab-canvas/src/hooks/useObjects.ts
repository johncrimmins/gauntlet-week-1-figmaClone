/**
 * useObjects Hook
 * 
 * Manages canvas objects state with real-time synchronization from Firebase.
 * Provides methods to create, select, and manage rectangles on the canvas.
 */

import { useState, useEffect, useRef } from 'react';
import type { RectangleObject, ObjectsMap } from '../types/object.types';
import * as objectService from '../services/object.service';
import { getRandomColor } from '../utils/colors';
import { throttle } from '../utils/throttle';

/**
 * Hook return type with objects state and management methods
 */
interface UseObjectsReturn {
  objects: ObjectsMap;
  selectedObjectId: string | null;
  createRectangle: (x: number, y: number) => void;
  selectObject: (objectId: string) => void;
  deselectObject: () => void;
  moveObject: (objectId: string, x: number, y: number) => Promise<void>;
  moveObjectDuringDrag: (objectId: string, x: number, y: number) => void;
  lockObject: (objectId: string, userId: string) => Promise<boolean>;
  unlockObject: (objectId: string) => Promise<void>;
}

/**
 * Default dimensions for newly created rectangles
 */
const DEFAULT_RECT_WIDTH = 100;
const DEFAULT_RECT_HEIGHT = 100;

/**
 * Custom hook for managing canvas objects with Firebase synchronization
 * 
 * Subscribes to real-time object updates from Firebase and provides methods
 * to create and select objects. Objects are stored in Firebase at `/objects/{objectId}`.
 * 
 * @returns Object containing objects map, selection state, and management methods
 * 
 * @example
 * const { objects, selectedObjectId, createRectangle, selectObject, deselectObject } = useObjects();
 * 
 * // Create a rectangle at canvas position (100, 150)
 * createRectangle(100, 150);
 * 
 * // Select an object
 * selectObject('rect_abc123');
 * 
 * // Deselect
 * deselectObject();
 */
export function useObjects(): UseObjectsReturn {
  const [objects, setObjects] = useState<ObjectsMap>({});
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Create a ref to hold the throttled update function
  // This ensures we have a stable reference across re-renders
  const throttledUpdateRef = useRef(
    throttle((objectId: string, x: number, y: number) => {
      objectService.updateObjectPositionDuringDrag(objectId, x, y);
    }, 50) // 50ms throttle for responsive real-time updates
  );

  // Subscribe to object updates from Firebase
  useEffect(() => {
    const unsubscribe = objectService.subscribeToObjects((updatedObjects) => {
      setObjects(updatedObjects);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Creates a new rectangle at the specified position
   * 
   * Generates a unique ID, assigns a random color, and creates the object
   * in Firebase. The object will appear for all connected users.
   * 
   * @param x - X coordinate for rectangle position
   * @param y - Y coordinate for rectangle position
   */
  function createRectangle(x: number, y: number): void {
    const id = `rect_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const rectangle: RectangleObject = {
      id,
      type: 'rectangle',
      x,
      y,
      width: DEFAULT_RECT_WIDTH,
      height: DEFAULT_RECT_HEIGHT,
      color: getRandomColor(),
      lockedBy: null,
    };

    objectService.createObject(rectangle);
  }

  /**
   * Selects a canvas object by ID
   * 
   * Sets the selected object state, which can be used to show
   * visual feedback (stroke, handles, etc.) on the selected object.
   * 
   * @param objectId - ID of the object to select
   */
  function selectObject(objectId: string): void {
    setSelectedObjectId(objectId);
  }

  /**
   * Deselects the currently selected object
   * 
   * Clears the selection state, removing any selection visual feedback.
   */
  function deselectObject(): void {
    setSelectedObjectId(null);
  }

  /**
   * Moves an object to a new position
   * 
   * Updates the object's x and y coordinates in Firebase. All connected
   * users will receive the position update in real-time.
   * 
   * @param objectId - ID of the object to move
   * @param x - New X coordinate
   * @param y - New Y coordinate
   */
  async function moveObject(objectId: string, x: number, y: number): Promise<void> {
    await objectService.updateObject(objectId, { x, y });
  }

  /**
   * Moves an object during drag (throttled, real-time)
   * 
   * Sends throttled position updates to Firebase during dragging for real-time
   * synchronization. This allows other users to see the object moving smoothly.
   * Throttled to 50ms (20 updates per second) for responsive feel.
   * 
   * @param objectId - ID of the object being dragged
   * @param x - Current X coordinate
   * @param y - Current Y coordinate
   */
  function moveObjectDuringDrag(objectId: string, x: number, y: number): void {
    throttledUpdateRef.current(objectId, x, y);
  }

  /**
   * Attempts to acquire a lock on an object
   * 
   * Uses Firebase transaction to atomically check if the object is unlocked
   * and acquire the lock if available. This prevents race conditions where
   * multiple users try to drag the same object simultaneously.
   * 
   * @param objectId - ID of the object to lock
   * @param userId - ID of the user acquiring the lock
   * @returns Promise that resolves to true if lock was acquired, false otherwise
   */
  async function lockObject(objectId: string, userId: string): Promise<boolean> {
    return await objectService.acquireLock(objectId, userId);
  }

  /**
   * Releases the lock on an object
   * 
   * Clears the lockedBy field, allowing other users to drag the object.
   * 
   * @param objectId - ID of the object to unlock
   */
  async function unlockObject(objectId: string): Promise<void> {
    await objectService.releaseLock(objectId);
  }

  return {
    objects,
    selectedObjectId,
    createRectangle,
    selectObject,
    deselectObject,
    moveObject,
    moveObjectDuringDrag,
    lockObject,
    unlockObject,
  };
}

