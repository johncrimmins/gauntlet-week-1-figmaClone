/**
 * Cursor Component
 * 
 * Renders a user's cursor as a Konva object in the collaborative canvas.
 * Displays a pointer shape with a label showing the user's display name.
 */

import { Group, Arrow, Text, Circle } from 'react-konva';

/**
 * Props for the Cursor component
 */
interface CursorProps {
  /** X coordinate position on canvas */
  x: number;
  /** Y coordinate position on canvas */
  y: number;
  /** User's display name to show on label */
  displayName: string;
  /** Hex color code for cursor styling */
  color: string;
}

/**
 * Cursor component that renders a user's cursor position in the canvas
 * 
 * Rendered as a Konva Group containing a pointer shape and a name label.
 * The cursor automatically transforms with the canvas pan/zoom since it's
 * a Konva object in the same stage.
 * 
 * @param props - Cursor properties including position, name, and color
 * 
 * @example
 * <Layer>
 *   <Cursor 
 *     x={150} 
 *     y={200} 
 *     displayName="John Doe" 
 *     color="#FF6B6B" 
 *   />
 * </Layer>
 */
export function Cursor({ x, y, displayName, color }: CursorProps) {
  return (
    <Group x={x} y={y}>
      {/* Cursor pointer - simple arrow pointing up-left */}
      <Arrow
        points={[0, 0, 0, 20, 5, 16]}
        pointerLength={0}
        pointerWidth={0}
        fill={color}
        stroke={color}
        strokeWidth={2}
        tension={0}
      />
      
      {/* Small circle at cursor tip for better visibility */}
      <Circle
        x={0}
        y={0}
        radius={2}
        fill={color}
      />
      
      {/* Name label background */}
      <Group x={8} y={8}>
        <Text
          text={displayName}
          fontSize={12}
          fontFamily="Arial"
          fill="white"
          padding={4}
          align="left"
        />
        
        {/* Background rectangle for label (drawn behind text) */}
        <Text
          text={displayName}
          fontSize={12}
          fontFamily="Arial"
          fill={color}
          padding={4}
          align="left"
          opacity={0.9}
          cornerRadius={4}
        />
      </Group>
    </Group>
  );
}

