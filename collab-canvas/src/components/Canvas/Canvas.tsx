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
import { OnlineUsers } from '../Presence/OnlineUsers';
import { Cursor } from '../Cursors/Cursor';
import { Stage, Layer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import './Canvas.css';

/**
 * Main canvas component for collaborative editing
 * 
 * Displays the canvas workspace with integrated presence awareness and
 * real-time multiplayer cursors using Konva.
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

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Handles mouse movement on the canvas stage
   * Updates the current user's cursor position (throttled to 100ms)
   */
  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    updateMyCursor(pointerPosition.x, pointerPosition.y);
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
          onMouseMove={handleMouseMove}
        >
          <Layer>
            {/* Render all cursors except the current user's cursor */}
            {Object.entries(cursors).map(([id, cursor]) => {
              // Don't render own cursor
              if (id === currentUser?.id) return null;
              
              return (
                <Cursor
                  key={id}
                  x={cursor.x}
                  y={cursor.y}
                  displayName={cursor.displayName}
                  color={cursor.color}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

