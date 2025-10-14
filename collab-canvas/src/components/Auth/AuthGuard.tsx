/**
 * AuthGuard Component
 * 
 * This component protects routes by checking if a user is authenticated.
 * If not authenticated, it redirects to the login page.
 * Shows a loading state while checking authentication.
 */

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Props for AuthGuard component
 */
interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard component that protects authenticated routes
 * 
 * @param children - Child components to render if authenticated
 * @returns Children if authenticated, loading state, or redirect to login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

