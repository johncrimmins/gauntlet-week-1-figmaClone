/**
 * OnlineUsers Component
 * 
 * Displays a list of all users currently online in the collaborative session.
 * Shows each user with a colored indicator and their display name.
 * Positioned in the top-right corner of the canvas.
 */

import type { PresenceUser } from '../../types/user.types';
import './OnlineUsers.css';

/**
 * Props for the OnlineUsers component
 */
interface OnlineUsersProps {
  users: PresenceUser[];
}

/**
 * Renders the online users list with colored indicators
 * 
 * @param props - Component props
 * @param props.users - Array of currently online users
 * 
 * @example
 * <OnlineUsers users={onlineUsers} />
 */
export function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <div className="online-users">
      <div className="online-users-header">
        <span className="online-users-title">Online</span>
        <span className="online-users-count">{users.length}</span>
      </div>
      <div className="online-users-list">
        {users.map((user) => (
          <div key={user.userId} className="online-user-item">
            <div 
              className="online-user-dot" 
              style={{ backgroundColor: user.color }}
            />
            <span className="online-user-name">{user.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

