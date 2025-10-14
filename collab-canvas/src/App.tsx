/**
 * CollabCanvas MVP - Main Application Component
 * 
 * This is the root component that sets up routing for the application.
 * Routes include: Login, Signup, and Canvas (protected by AuthGuard).
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

/**
 * Placeholder component for Login page
 */
function Login() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>CollabCanvas MVP</h1>
      <h2>Login</h2>
      <p>Login component coming in PR #2</p>
    </div>
  );
}

/**
 * Placeholder component for Signup page
 */
function Signup() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>CollabCanvas MVP</h1>
      <h2>Signup</h2>
      <p>Signup component coming in PR #2</p>
    </div>
  );
}

/**
 * Placeholder component for Canvas page
 */
function Canvas() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>CollabCanvas MVP</h1>
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
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/" element={<Navigate to="/canvas" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
