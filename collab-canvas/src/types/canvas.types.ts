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
 * Each cursor is rendered as an HTML overlay element.
 * 
 * @property userId - Unique identifier for the user
 * @property x - X coordinate position on the canvas (canvas coordinates)
 * @property y - Y coordinate position on the canvas (canvas coordinates)
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

/**
 * Represents the viewport state of the canvas
 * 
 * Tracks the current pan position and zoom level for the canvas.
 * Persisted to localStorage to maintain user's view across sessions.
 * 
 * @property x - X coordinate of the stage position (pan offset)
 * @property y - Y coordinate of the stage position (pan offset)
 * @property scale - Zoom level (1 = 100%, 0.5 = 50%, 2 = 200%)
 * 
 * @example
 * const viewport: ViewportState = {
 *   x: 100,
 *   y: 50,
 *   scale: 1.5
 * };
 */
export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

/**
 * Configuration for canvas dimensions
 * 
 * Defines the total size of the canvas workspace.
 * 
 * @property width - Total width of the canvas in pixels
 * @property height - Total height of the canvas in pixels
 */
export interface CanvasConfig {
  width: number;
  height: number;
}

