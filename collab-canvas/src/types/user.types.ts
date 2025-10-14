/**
 * User Type Definitions
 * 
 * This file contains type definitions for user authentication and identity
 * throughout the CollabCanvas application.
 */

/**
 * Represents a user in the CollabCanvas system
 * 
 * @property id - Unique user identifier (Firebase UID)
 * @property email - User's email address
 * @property displayName - User's display name shown to other collaborators
 * @property color - Unique color assigned to user for cursors and presence
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  color: string;
}

/**
 * Represents the authentication state of the application
 * 
 * @property currentUser - The currently authenticated user, or null if not authenticated
 * @property loading - Whether authentication state is being determined
 * @property error - Error message if authentication failed, or null
 */
export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

