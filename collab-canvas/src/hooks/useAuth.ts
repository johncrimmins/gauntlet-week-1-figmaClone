/**
 * useAuth Hook
 * 
 * This hook provides authentication state and methods to React components.
 * It subscribes to Firebase auth state changes and provides login, signup, and logout functions.
 */

import { useState, useEffect } from 'react';
import type { User, AuthState } from '../types/user.types';
import * as authService from '../services/auth.service';

/**
 * Hook return type with auth state and methods
 */
interface UseAuthReturn extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

/**
 * Custom hook for managing authentication state and operations
 * 
 * @returns Authentication state (currentUser, loading, error) and auth methods
 * 
 * @example
 * const { currentUser, loading, logIn, logOut } = useAuth();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (currentUser) return <div>Welcome {currentUser.displayName}</div>;
 */
export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth state changes on mount
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Sign up a new user
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param displayName - User's display name
   */
  async function signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    try {
      setError(null);
      setLoading(true);
      await authService.signUp(email, password, displayName);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Log in an existing user
   * 
   * @param email - User's email address
   * @param password - User's password
   */
  async function logIn(email: string, password: string): Promise<void> {
    try {
      setError(null);
      setLoading(true);
      await authService.logIn(email, password);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Log out the current user
   */
  async function logOut(): Promise<void> {
    try {
      setError(null);
      await authService.logOut();
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  }

  return {
    currentUser,
    loading,
    error,
    signUp,
    logIn,
    logOut,
  };
}

