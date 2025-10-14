/**
 * Canvas Component
 * 
 * Main collaborative canvas component that integrates presence awareness,
 * multiplayer cursors, and canvas objects. This is the core workspace where
 * users collaborate in real-time.
 */

import { useAuth } from '../../hooks/useAuth';
import { usePresence } from '../../hooks/usePresence';
import { useCursors } from '../../hooks/useCursors';
import { useCanvas } from '../../hooks/useCanvas';
import { OnlineUsers } from '../Presence/OnlineUsers';
import { Cursor } from '../Cursors/Cursor';
import { CanvasGrid } from './CanvasGrid';
import { Stage, Layer, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import * as presenceService from '../../services/presence.service';
import * as cursorService from '../../services/cursor.service';
import { canvasToScreen } from '../../utils/canvas.utils';
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
   * Note: getPointerPosition() returns canvas coordinates (accounting for zoom/pan)
   * which is exactly what we need to store in Firebase.
   */
  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    updateMyCursor(pointerPosition.x, pointerPosition.y);
  }

  /**
   * Handles stage drag end to update viewport position
   */
  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    const stage = e.target;
    setViewport({
      ...viewport,
      x: stage.x(),
      y: stage.y(),
    });
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
          </div>
        )}
      </div>

      {/* Online users list */}
      <OnlineUsers users={onlineUsers} />

      {/* Canvas workspace with Konva Stage */}
      <div className="canvas-workspace">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 80}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          draggable={true}
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
              listening={false}
            />
            
            {/* Grid overlay - Figma-style adaptive grid */}
            <CanvasGrid
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              viewport={viewport}
            />
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

