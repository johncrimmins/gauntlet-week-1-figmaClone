/**
 * Canvas Component
 * 
 * Main collaborative canvas component that integrates presence awareness,
 * multiplayer cursors, and canvas objects. This is the core workspace where
 * users collaborate in real-time.
 */

import { useAuth } from '../../hooks/useAuth';
import { usePresence } from '../../hooks/usePresence';
import { OnlineUsers } from '../Presence/OnlineUsers';
import './Canvas.css';

/**
 * Main canvas component for collaborative editing
 * 
 * Displays the canvas workspace with integrated presence awareness.
 * Future PRs will add Konva stage, cursors, and objects.
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

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

      {/* Canvas workspace (placeholder for now) */}
      <div className="canvas-workspace">
        <div className="canvas-placeholder">
          <h2>Canvas</h2>
          <p>Canvas component with Konva coming in PR #5</p>
          <p>Real-time collaborative canvas will be here!</p>
          <div className="canvas-presence-info">
            <p><strong>Presence System Active:</strong></p>
            <p>{onlineUsers.length} user(s) online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

