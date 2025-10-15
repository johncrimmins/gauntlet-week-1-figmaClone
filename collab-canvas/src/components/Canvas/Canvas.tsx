/**
 * Canvas Component
 * 
 * Main collaborative canvas component that integrates presence awareness,
 * multiplayer cursors, and canvas objects. This is the core workspace where
 * users collaborate in real-time.
 */

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePresence } from '../../hooks/usePresence';
import { useCursors } from '../../hooks/useCursors';
import { useCanvas } from '../../hooks/useCanvas';
import { useObjects } from '../../hooks/useObjects';
import { OnlineUsers } from '../Presence/OnlineUsers';
import { Cursor } from '../Cursors/Cursor';
import { CanvasGrid } from './CanvasGrid';
import { Toolbar } from './Toolbar';
import { CanvasObject } from './CanvasObject';
import { Stage, Layer, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import * as presenceService from '../../services/presence.service';
import * as cursorService from '../../services/cursor.service';
import * as objectService from '../../services/object.service';
import { canvasToScreen, screenToCanvas } from '../../utils/canvas.utils';
import './Canvas.css';

// Canvas configuration constants
const CANVAS_WIDTH = 5000;
const CANVAS_HEIGHT = 5000;
const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

/**
 * Main canvas component for collaborative editing
 * 
 * Displays the canvas workspace with integrated presence awareness and
 * real-time multiplayer cursors using HTML overlay.
 * 
 * @example
 * <Canvas />
 */
export function Canvas() {
  const { currentUser, logOut } = useAuth();
  const { onlineUsers } = usePresence(
    currentUser?.id || null,
    currentUser?.displayName || null,
    currentUser?.color || null
  );
  const { cursors, updateMyCursor } = useCursors(
    currentUser?.id || null,
    currentUser?.displayName || null,
    currentUser?.color || null
  );
  const { viewport, setViewport } = useCanvas();
  const { objects, selectedObjectId, createRectangle, selectObject, deselectObject, moveObject, moveObjectDuringDrag, lockObject, unlockObject } = useObjects();
  
  // Creation mode state
  const [isCreating, setIsCreating] = useState(false);
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Track whether an object is being dragged (to disable stage dragging)
  const [isDraggingObject, setIsDraggingObject] = useState(false);

  /**
   * Handles user logout with proper cleanup
   * 
   * Manually removes presence and cursor data BEFORE logout redirect.
   * This is necessary because onDisconnect only fires on network disconnection,
   * not on intentional logout (where connection is still active).
   */
  async function handleLogout() {
    try {
      // Manually clean up presence and cursor before logout
      // onDisconnect doesn't fire for intentional logout (connection still active)
      if (currentUser?.id) {
        await presenceService.setUserOffline(currentUser.id);
        await cursorService.removeCursor(currentUser.id);
      }
      
      // Then perform the actual logout (which redirects to /login)
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Handles mouse movement on the canvas stage
   * Updates the current user's cursor position (throttled to 100ms)
   * 
   * Note: getPointerPosition() returns screen coordinates, so we must convert
   * to canvas coordinates before storing in Firebase.
   */
  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Convert screen coordinates to canvas coordinates
    const canvasPos = screenToCanvas(pointerPosition.x, pointerPosition.y, viewport);
    
    // Update cursor position in Firebase
    updateMyCursor(canvasPos.x, canvasPos.y);
    
    // Update ghost rectangle position when in creation mode
    if (isCreating) {
      setGhostPosition(canvasPos);
    }
  }

  /**
   * Handles stage drag end to update viewport position
   * Only updates viewport if the Stage itself was dragged (not an object)
   */
  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    // Only update viewport if the Stage itself was dragged
    // This prevents object drags from resetting the viewport
    if (e.target.getType() === 'Stage') {
      const stage = e.target;
      setViewport({
        ...viewport,
        x: stage.x(),
        y: stage.y(),
      });
    }
  }

  /**
   * Handles mouse wheel for zooming
   * Zooms toward the mouse cursor position
   */
  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = viewport.scale;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Calculate new scale based on wheel delta
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 
      ? Math.max(MIN_SCALE, oldScale / scaleBy)
      : Math.min(MAX_SCALE, oldScale * scaleBy);

    // Calculate new position to zoom toward mouse
    // Formula: newPos = mousePos - (mousePos - oldPos) * (newScale / oldScale)
    const mousePointTo = {
      x: (pointerPosition.x - viewport.x) / oldScale,
      y: (pointerPosition.y - viewport.y) / oldScale,
    };

    const newPos = {
      x: pointerPosition.x - mousePointTo.x * newScale,
      y: pointerPosition.y - mousePointTo.y * newScale,
    };

    setViewport({
      x: newPos.x,
      y: newPos.y,
      scale: newScale,
    });
  }

  /**
   * Toggles between create and select modes
   */
  function handleToggleCreate() {
    if (isCreating) {
      // Exiting creation mode - clear ghost
      setGhostPosition(null);
    }
    setIsCreating(!isCreating);
  }

  /**
   * Handles clicks on the canvas background
   * In create mode: creates a new rectangle at click position
   * In select mode: deselects any selected object
   */
  function handleBackgroundClick(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Convert screen coordinates to canvas coordinates
    const canvasPos = screenToCanvas(pointerPosition.x, pointerPosition.y, viewport);

    if (isCreating) {
      // Create rectangle at click position
      createRectangle(canvasPos.x, canvasPos.y);
      // Exit creation mode and clear ghost
      setIsCreating(false);
      setGhostPosition(null);
    } else {
      // Deselect any selected object
      deselectObject();
    }
  }

  /**
   * Handles object drag start
   * Attempts to acquire lock and disables stage dragging
   */
  async function handleObjectDragStart(objectId: string): Promise<boolean> {
    if (!currentUser?.id) return false;
    
    try {
      // Try to acquire lock
      const acquired = await lockObject(objectId, currentUser.id);
      
      if (acquired) {
        // Disable stage dragging while we're dragging an object
        setIsDraggingObject(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error starting object drag:', error);
      setIsDraggingObject(false);
      return false;
    }
  }

  /**
   * Handles object drag move (real-time position updates)
   * Sends throttled position updates to Firebase during drag
   * Also updates cursor position so it moves with the object
   */
  function handleObjectDragMove(objectId: string, objectX: number, objectY: number, pointerX: number, pointerY: number): void {
    // Send throttled object position update to Firebase for real-time sync
    moveObjectDuringDrag(objectId, objectX, objectY);
    
    // Also update cursor position so it moves with the mouse during drag
    // Convert screen coordinates to canvas coordinates
    const canvasPos = screenToCanvas(pointerX, pointerY, viewport);
    updateMyCursor(canvasPos.x, canvasPos.y);
  }

  /**
   * Handles object drag end
   * Updates position and releases lock, re-enables stage dragging
   */
  async function handleObjectDragEnd(objectId: string, x: number, y: number): Promise<void> {
    try {
      // Validate positions one more time at parent level
      if (!isValidNumber(x) || !isValidNumber(y)) {
        console.error('Attempted to save invalid position:', { objectId, x, y });
        throw new Error('Invalid position values');
      }
      
      // Update position in Firebase
      await moveObject(objectId, x, y);
      
      // Release lock
      await unlockObject(objectId);
    } catch (error) {
      console.error('Error ending object drag:', error);
    } finally {
      // Always re-enable stage dragging, even if there was an error
      setIsDraggingObject(false);
    }
  }

  /**
   * Validates that a value is a valid number
   */
  function isValidNumber(value: number): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  /**
   * Validates that an object has valid position data
   */
  function isValidObject(obj: any): boolean {
    return obj && 
           isValidNumber(obj.x) && 
           isValidNumber(obj.y) && 
           isValidNumber(obj.width) && 
           isValidNumber(obj.height);
  }

  /**
   * Emergency function to clear all corrupted objects from Firebase
   */
  async function handleClearCorruptedData() {
    if (window.confirm('This will delete all objects from the canvas. Are you sure?')) {
      try {
        await objectService.clearAllObjects();
        console.log('Corrupted data cleared successfully');
      } catch (error) {
        console.error('Failed to clear corrupted data:', error);
      }
    }
  }

  // Filter out objects with invalid positions before rendering
  const validObjects = Object.values(objects).filter(isValidObject);

  return (
    <div className="canvas-container">
      {/* Header with logout button */}
      <div className="canvas-header">
        <h1 className="canvas-title">CollabCanvas MVP</h1>
        {currentUser && (
          <div className="canvas-user-info">
            <span className="canvas-username">
              Welcome, {currentUser.displayName}!
            </span>
            <button 
              onClick={handleLogout}
              className="canvas-logout-btn"
            >
              Logout
            </button>
            {/* Emergency cleanup button (only show in development) */}
            {import.meta.env.DEV && (
              <button 
                onClick={handleClearCorruptedData}
                className="canvas-logout-btn"
                style={{ backgroundColor: '#dc3545', marginLeft: '8px' }}
                title="Clear all objects from Firebase"
              >
                Clear Data
              </button>
            )}
          </div>
        )}
      </div>

      {/* Online users list */}
      <OnlineUsers users={onlineUsers} />

      {/* Toolbar */}
      <Toolbar isCreating={isCreating} onToggleCreate={handleToggleCreate} />

      {/* Canvas workspace with Konva Stage */}
      <div className="canvas-workspace">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 80}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          draggable={!isDraggingObject}
          onDragEnd={handleDragEnd}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
        >
          <Layer>
            {/* Canvas background - 5000x5000 workspace */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#f5f5f5"
              onClick={handleBackgroundClick}
              onTap={handleBackgroundClick}
            />
            
            {/* Grid overlay - Figma-style adaptive grid */}
            <CanvasGrid
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              viewport={viewport}
            />

            {/* Canvas objects (rectangles) - only render valid objects */}
            {validObjects.map((obj) => (
              <CanvasObject
                key={obj.id}
                object={obj}
                isSelected={selectedObjectId === obj.id}
                onSelect={() => selectObject(obj.id)}
                onDragStart={() => handleObjectDragStart(obj.id)}
                onDragMove={(objectX, objectY, pointerX, pointerY) => handleObjectDragMove(obj.id, objectX, objectY, pointerX, pointerY)}
                onDragEnd={(x, y) => handleObjectDragEnd(obj.id, x, y)}
                currentUserId={currentUser?.id}
              />
            ))}

            {/* Ghost rectangle preview when creating */}
            {isCreating && ghostPosition && (
              <Rect
                x={ghostPosition.x}
                y={ghostPosition.y}
                width={100}
                height={100}
                stroke="#0066FF"
                strokeWidth={2}
                dash={[5, 5]}
                listening={false}
              />
            )}
          </Layer>
        </Stage>

        {/* HTML cursor overlay - rendered outside Konva to maintain constant size */}
        <div className="cursor-overlay">
          {Object.entries(cursors).map(([id, cursor]) => {
            // Don't render own cursor
            if (id === currentUser?.id) return null;
            
            // Convert canvas coordinates to screen coordinates
            const screenPos = canvasToScreen(cursor.x, cursor.y, viewport);
            
            return (
              <Cursor
                key={id}
                x={screenPos.x}
                y={screenPos.y}
                displayName={cursor.displayName}
                color={cursor.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

