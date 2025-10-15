/**
 * CanvasObject Component
 * 
 * Renders a canvas object (rectangle) as a Konva shape.
 * Handles selection visual feedback, click interactions, and dragging.
 */

import { Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
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
  /** Callback when drag starts - returns true if drag should be allowed */
  onDragStart?: () => Promise<boolean>;
  /** Callback during drag with object position and pointer position (for real-time updates) */
  onDragMove?: (objectX: number, objectY: number, pointerX: number, pointerY: number) => void;
  /** Callback when drag ends with new position */
  onDragEnd?: (x: number, y: number) => Promise<void>;
  /** ID of current user for lock checking */
  currentUserId?: string;
}

/**
 * Renders a rectangle object on the canvas
 * 
 * Displays a Konva Rect with position, size, and color from the object data.
 * Shows a stroke when selected. Allows dragging when selected, with lock
 * acquisition to prevent conflicts.
 * 
 * @param props - Component props
 * @returns Konva Rect element
 * 
 * @example
 * <CanvasObject
 *   object={rectangleObject}
 *   isSelected={selectedObjectId === rectangleObject.id}
 *   onSelect={() => selectObject(rectangleObject.id)}
 *   onDragStart={handleDragStart}
 *   onDragEnd={handleDragEnd}
 *   currentUserId={currentUser.id}
 * />
 */
export function CanvasObject({ 
  object, 
  isSelected, 
  onSelect, 
  onDragStart,
  onDragMove,
  onDragEnd,
  currentUserId 
}: CanvasObjectProps) {
  /**
   * Handles drag start event
   * Attempts to acquire lock before allowing drag
   */
  async function handleDragStart(e: KonvaEventObject<DragEvent>) {
    if (!onDragStart) return;
    
    try {
      const canDrag = await onDragStart();
      if (!canDrag) {
        // Cancel the drag if we couldn't acquire the lock
        e.target.stopDrag();
      }
    } catch (error) {
      console.error('Error in drag start handler:', error);
      e.target.stopDrag();
    }
  }

  /**
   * Handles drag move event
   * Sends real-time position updates during drag
   */
  function handleDragMove(e: KonvaEventObject<DragEvent>) {
    if (!onDragMove) return;
    
    try {
      const node = e.target;
      const stage = node.getStage();
      if (!stage) return;
      
      const currentX = node.x();
      const currentY = node.y();
      
      // Get the pointer position for cursor updates
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;
      
      // Validate position values before sending
      if (isValidNumber(currentX) && isValidNumber(currentY)) {
        onDragMove(currentX, currentY, pointerPosition.x, pointerPosition.y);
      }
    } catch (error) {
      console.error('Error in drag move handler:', error);
    }
  }

  /**
   * Handles drag end event
   * Updates object position and releases lock
   */
  async function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    if (!onDragEnd) return;
    
    try {
      const node = e.target;
      const newX = node.x();
      const newY = node.y();
      
      // Validate position values before updating
      if (!isValidNumber(newX) || !isValidNumber(newY)) {
        console.error('Invalid position from drag end:', { newX, newY });
        // Reset to original position instead of saving corrupted data
        node.position({ x: object.x, y: object.y });
        return;
      }
      
      // Update position in Firebase
      await onDragEnd(newX, newY);
    } catch (error) {
      console.error('Error in drag end handler:', error);
      // Don't reset position on error - causes render loop
      // Just let the error propagate to parent for handling
    }
  }
  
  /**
   * Validates that a value is a valid number
   */
  function isValidNumber(value: number): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  // Determine if object is locked by another user
  const isLockedByOther = object.lockedBy && object.lockedBy !== currentUserId;

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
      draggable={isSelected && !isLockedByOther}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      opacity={isLockedByOther ? 0.5 : 1}
    />
  );
}

