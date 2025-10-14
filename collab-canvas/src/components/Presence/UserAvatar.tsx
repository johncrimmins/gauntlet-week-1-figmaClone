/**
 * UserAvatar Component
 * 
 * Displays a user avatar with the first letter of their display name
 * in a colored circle. Reusable for presence lists and future cursor labels.
 */

import './UserAvatar.css';

/**
 * Props for the UserAvatar component
 */
interface UserAvatarProps {
  displayName: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Renders a user avatar with their initial in a colored circle
 * 
 * @param props - Component props
 * @param props.displayName - User's display name
 * @param props.color - User's assigned color (hex string)
 * @param props.size - Avatar size (default: 'medium')
 * 
 * @example
 * <UserAvatar displayName="John Doe" color="#FF6B6B" size="medium" />
 */
export function UserAvatar({ displayName, color, size = 'medium' }: UserAvatarProps) {
  // Get the first letter of the display name
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div 
      className={`user-avatar user-avatar-${size}`}
      style={{ backgroundColor: color }}
      title={displayName}
    >
      <span className="user-avatar-initial">{initial}</span>
    </div>
  );
}

