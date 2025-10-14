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
import { Canvas } from './components/Canvas/Canvas';
import './App.css';

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
