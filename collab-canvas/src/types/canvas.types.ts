/**
 * Canvas Type Definitions
 * 
 * Type definitions for canvas-related data structures including
 * cursor positions, viewport state, and canvas objects.
 */

/**
 * Represents a user's cursor position on the canvas
 * 
 * Used for real-time multiplayer cursor synchronization.
 * Each cursor is rendered as a Konva object in the canvas layer.
 * 
 * @property userId - Unique identifier for the user
 * @property x - X coordinate position on the canvas
 * @property y - Y coordinate position on the canvas
 * @property displayName - User's display name shown on cursor label
 * @property color - Hex color code for cursor styling (e.g., "#FF6B6B")
 * 
 * @example
 * const cursor: CursorPosition = {
 *   userId: "user123",
 *   x: 150.5,
 *   y: 200.3,
 *   displayName: "John Doe",
 *   color: "#FF6B6B"
 * };
 */
export interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  displayName: string;
  color: string;
}

