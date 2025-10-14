/**
 * Firebase Configuration and Initialization
 * 
 * This module initializes Firebase with the project configuration and exports
 * instances of Firebase Realtime Database and Firebase Auth for use throughout
 * the application.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

/**
 * Firebase configuration object
 * All values are loaded from environment variables with VITE_ prefix
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase app with configuration
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Auth instance
 * Used for user authentication (email/password)
 */
export const auth = getAuth(app);

/**
 * Firebase Realtime Database instance
 * Used for real-time data synchronization (presence, cursors, objects)
 */
export const database = getDatabase(app);

