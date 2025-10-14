/**
 * useObjects Hook
 * 
 * Manages canvas objects state with real-time synchronization from Firebase.
 * Provides methods to create, select, and manage rectangles on the canvas.
 */

import { useState, useEffect } from 'react';
import type { RectangleObject, ObjectsMap } from '../types/object.types';
import * as objectService from '../services/object.service';
import { getRandomColor } from '../utils/colors';

/**
 * Hook return type with objects state and management methods
 */
interface UseObjectsReturn {
  objects: ObjectsMap;
  selectedObjectId: string | null;
  createRectangle: (x: number, y: number) => void;
  selectObject: (objectId: string) => void;
  deselectObject: () => void;
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

  return {
    objects,
    selectedObjectId,
    createRectangle,
    selectObject,
    deselectObject,
  };
}

