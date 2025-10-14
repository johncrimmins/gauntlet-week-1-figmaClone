/**
 * CanvasObject Component
 * 
 * Renders a canvas object (rectangle) as a Konva shape.
 * Handles selection visual feedback and click interactions.
 */

import { Rect } from 'react-konva';
import type { RectangleObject } from '../../types/object.types';

/**
 * Props for CanvasObject component
 */
interface CanvasObjectProps {
  /** The rectangle object to render */
  object: RectangleObject;
  /** Whether this object is currently selected */
  isSelected: boolean;
  /** Callback when object is clicked */
  onSelect: () => void;
}

/**
 * Renders a rectangle object on the canvas
 * 
 * Displays a Konva Rect with position, size, and color from the object data.
 * Shows a stroke when selected. Currently non-draggable (dragging will be
 * added in PR #7 with locking mechanism).
 * 
 * @param props - Component props
 * @returns Konva Rect element
 * 
 * @example
 * <CanvasObject
 *   object={rectangleObject}
 *   isSelected={selectedObjectId === rectangleObject.id}
 *   onSelect={() => selectObject(rectangleObject.id)}
 * />
 */
export function CanvasObject({ object, isSelected, onSelect }: CanvasObjectProps) {
  return (
    <Rect
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      fill={object.color}
      stroke={isSelected ? '#0066FF' : undefined}
      strokeWidth={isSelected ? 3 : 0}
      onClick={onSelect}
      onTap={onSelect}
      draggable={false}
      opacity={1}
    />
  );
}

