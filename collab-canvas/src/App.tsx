/**
 * CollabCanvas MVP - Main Application Component
 * 
 * This is the root component that sets up routing for the application.
 * Routes include: Login, Signup, and Canvas (protected by AuthGuard).
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { AuthGuard } from './components/Auth/AuthGuard';
import { useAuth } from './hooks/useAuth';
import './App.css';

/**
 * Placeholder component for Canvas page
 * Will be replaced in PR #5
 */
function Canvas() {
  const { currentUser, logOut } = useAuth();
  
  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>CollabCanvas MVP</h1>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {currentUser.displayName}!</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <h2>Canvas</h2>
      <p>Canvas component coming in PR #5</p>
      <p>Real-time collaborative canvas will be here!</p>
    </div>
  );
}

/**
 * Main App component with routing
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/canvas" 
          element={
            <AuthGuard>
              <Canvas />
            </AuthGuard>
          } 
        />
        <Route path="/" element={<Navigate to="/canvas" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
