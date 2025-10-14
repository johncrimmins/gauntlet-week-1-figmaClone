/**
 * Authentication Service
 * 
 * This service provides functions for user authentication using Firebase Auth.
 * It handles sign up, login, logout, and authentication state monitoring.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '../types/user.types';

/**
 * Creates a new user account with email, password, and display name
 * 
 * @param email - User's email address
 * @param password - User's password
 * @param displayName - Display name for the user
 * @returns Promise resolving to the created User object
 * @throws Error if account creation fails
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with display name
    await updateProfile(userCredential.user, {
      displayName,
    });

    // Generate a random color for the user
    const color = generateUserColor();

    // Return the user object
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      color,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
    throw new Error('Sign up failed: Unknown error');
  }
}

/**
 * Signs in an existing user with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the authenticated User object
 * @throws Error if login fails
 */
export async function logIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Generate a color for the user (will be consistent if stored, or new if not)
    const color = generateUserColor();

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || 'Anonymous',
      color,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error('Login failed: Unknown error');
  }
}

/**
 * Signs out the current user
 * 
 * @returns Promise that resolves when sign out is complete
 * @throws Error if sign out fails
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error('Logout failed: Unknown error');
  }
}

/**
 * Subscribes to authentication state changes
 * 
 * @param callback - Function to call when auth state changes, receives User or null
 * @returns Unsubscribe function to stop listening to auth changes
 */
export function onAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  return firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const color = generateUserColor();
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || 'Anonymous',
        color,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
}

/**
 * Generates a random color for a user from a predefined palette
 * 
 * @returns Hex color string
 */
function generateUserColor(): string {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
    '#F8B739', // Orange
    '#52B788', // Green
    '#E63946', // Crimson
    '#457B9D', // Steel Blue
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

