/**
 * Cursor Component
 * 
 * Renders a user's cursor as an HTML overlay element in the collaborative canvas.
 * Displays a pointer shape with a label showing the user's display name.
 * Unlike Konva objects, this cursor maintains constant size at all zoom levels.
 */

import './Cursor.css';

/**
 * Props for the Cursor component
 */
interface CursorProps {
  /** X coordinate position on screen (screen coordinates, not canvas) */
  x: number;
  /** Y coordinate position on screen (screen coordinates, not canvas) */
  y: number;
  /** User's display name to show on label */
  displayName: string;
  /** Hex color code for cursor styling */
  color: string;
}

/**
 * Cursor component that renders a user's cursor position as HTML overlay
 * 
 * Rendered as an absolutely positioned HTML div that overlays the canvas.
 * This approach ensures the cursor remains constant size regardless of
 * canvas zoom level, providing consistent visual feedback.
 * 
 * @param props - Cursor properties including screen position, name, and color
 * 
 * @example
 * <div className="cursor-overlay">
 *   <Cursor 
 *     x={150} 
 *     y={200} 
 *     displayName="John Doe" 
 *     color="#FF6B6B" 
 *   />
 * </div>
 */
export function Cursor({ x, y, displayName, color }: CursorProps) {
  return (
    <div
      className="cursor"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="cursor-pointer">
        {/* CSS-based cursor arrow */}
        <div
          className="cursor-arrow"
          style={{ color }}
        />
        
        {/* Name label with colored background */}
        <div
          className="cursor-label"
          style={{ backgroundColor: color }}
        >
          {displayName}
        </div>
      </div>
    </div>
  );
}

