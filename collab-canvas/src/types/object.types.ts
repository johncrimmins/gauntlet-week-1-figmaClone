/**
 * Canvas Object Type Definitions
 * 
 * Type definitions for canvas objects (shapes) that users can create,
 * move, and manipulate on the collaborative canvas.
 */

/**
 * Base interface for all canvas objects
 * 
 * @property id - Unique identifier for the object (generated on creation)
 * @property type - Type of canvas object (e.g., 'rectangle', 'circle')
 * @property x - X coordinate position on the canvas
 * @property y - Y coordinate position on the canvas
 * @property lockedBy - User ID of the user currently dragging this object (null if unlocked)
 */
export interface CanvasObject {
  id: string;
  type: 'rectangle';
  x: number;
  y: number;
  lockedBy: string | null;
}

/**
 * Rectangle object on the canvas
 * 
 * Represents a rectangular shape with position, dimensions, and color.
 * 
 * @property id - Unique identifier
 * @property type - Always 'rectangle' for this type
 * @property x - X coordinate (top-left corner)
 * @property y - Y coordinate (top-left corner)
 * @property width - Width of the rectangle in pixels
 * @property height - Height of the rectangle in pixels
 * @property color - Hex color code for fill (e.g., '#FF6B6B')
 * @property lockedBy - User ID if object is being dragged, null otherwise
 * 
 * @example
 * const rect: RectangleObject = {
 *   id: 'rect_abc123',
 *   type: 'rectangle',
 *   x: 100,
 *   y: 150,
 *   width: 200,
 *   height: 100,
 *   color: '#FF6B6B',
 *   lockedBy: null
 * };
 */
export interface RectangleObject extends CanvasObject {
  type: 'rectangle';
  width: number;
  height: number;
  color: string;
}

/**
 * Map of object IDs to canvas objects
 * Used for efficient object lookups and state management
 */
export type ObjectsMap = Record<string, RectangleObject>;

