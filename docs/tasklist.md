# CollabCanvas MVP - Task List

**Project:** Real-time Collaborative Canvas  
**Stack:** React + Konva.js + TypeScript + Firebase Realtime Database + Vercel  
**Last Updated:** October 14, 2025

---

## Progress Tracking

As you complete each PR, update this section:

- [x] PR #1: Project Setup & Initial Deployment
- [x] PR #2: Authentication System
- [x] PR #3: Presence Awareness System
- [x] PR #4: Multiplayer Cursors & Deploy
- [x] PR #5: Basic Canvas with Pan/Zoom & Grid
- [x] PR #6: Rectangle Shape Creation & Deploy
- [x] PR #7: Object Movement & Real-Time Sync
- [ ] PR #8: State Persistence & Final Deploy
- [ ] PR #9: Bug Fixes & Documentation

**Current Status:** PR #7 Complete (Object Movement & Real-Time Sync)

---

## ⚠️ IMPORTANT: TypeScript Import Rules

Our project uses `verbatimModuleSyntax: true` in TypeScript configuration. This requires:

**✅ ALWAYS use `type` keyword for type-only imports:**
- `import type { User } from './types'`
- `import { useState, type FormEvent } from 'react'`

**Common imports that need `type` keyword:**
- Firebase: `import { type User as FirebaseUser } from 'firebase/auth'`
- React types: `import type { ReactNode, FormEvent } from 'react'`
- Custom types: `import type { User, AuthState } from './types'`

**See `docs/learnings.md` for detailed examples and troubleshooting.**

---

## Debugging Checklist (If facing issues implementing Any PR)

Double check these if you are running into errors before attempting to plan any other debugging:

1. **Review `docs/learnings.md`** for known issues and patterns
2. **Check import requirements:**
   - Will you import types? Use `import type`
   - Will you import React types? Use `import type`
   - Will you import Firebase types? Use `import { type X }`
3. **Plan error handling** using established patterns
4. **Remember to run:**
   - `npm run build` (catches TypeScript errors)
   - `npm run lint` (catches code style issues)
   - Browser test (catches runtime errors)

**When in doubt, check existing working files as examples:**
- Type imports: `src/services/auth.service.ts`
- Hook patterns: `src/hooks/useAuth.ts`
- Component patterns: `src/components/Auth/Login.tsx`

---

## Project File Structure

```
collab-canvas/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── Canvas.tsx
│   │   │   ├── Canvas.css
│   │   │   ├── CanvasGrid.tsx      (Figma-style adaptive grid)
│   │   │   ├── CanvasObject.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── Cursors/
│   │   │   ├── Cursor.tsx          (HTML-based cursor component)
│   │   │   └── Cursor.css          (Cursor overlay styles)
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── Presence/
│   │       ├── OnlineUsers.tsx
│   │       └── UserAvatar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCanvas.ts
│   │   ├── usePresence.ts
│   │   ├── useCursors.ts
│   │   └── useObjects.ts
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.service.ts
│   │   ├── presence.service.ts
│   │   ├── cursor.service.ts
│   │   └── object.service.ts
│   ├── types/
│   │   ├── canvas.types.ts
│   │   ├── user.types.ts
│   │   └── object.types.ts
│   ├── utils/
│   │   ├── colors.ts
│   │   ├── throttle.ts
│   │   └── canvas.utils.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Build Strategy Overview

Following the "Start with the Hard Part" principle with regular deployments:

1. **Foundation:** Project setup → Deploy "Hello World"
2. **Auth:** Basic authentication system
3. **Multiplayer Core:** Presence → Cursors → Deploy working cursors
4. **Canvas Features:** Pan/Zoom → Rectangles → Deploy canvas
5. **Object Sync:** Movement → Locking → Persistence → Final Deploy

---

## PR #1: Project Setup & Initial Deployment

**Goal:** Get development environment ready with Firebase configured and deploy a basic "Hello World" to Vercel.

### Tasks:

- [x] **Task 1: Initialize Vite + React + TypeScript project**
  - [x] Files: Create entire project structure
  - [x] Run: `npm create vite@latest collab-canvas -- --template react-ts`
  - [x] Configure Vite for React development

- [x] **Task 2: Install core dependencies**
  - [x] Files: `package.json`
  - [x] Install: `npm install react-konva konva`
  - [x] Install: `npm install firebase`
  - [x] Install: `npm install react-router-dom`
  - [x] Install dev dependencies: `npm install -D @types/react @types/react-dom`

- [x] **Task 3: Set up Firebase project**
  - [x] Go to Firebase Console → Create new project
  - [x] Enable Firebase Realtime Database (not Firestore)
  - [x] Set Database rules to test mode (public read/write for MVP)
  - [x] Enable Firebase Authentication (Email/Password provider)
  - [x] Get Firebase config credentials

- [x] **Task 4: Create Firebase configuration**
  - [x] Files: `src/services/firebase.ts`, `.env.local`
  - [x] Initialize Firebase app with config object
  - [x] Initialize Realtime Database and Auth instances
  - [x] Export `database` and `auth` instances
  - [x] Use `VITE_` prefix for environment variables

- [x] **Task 5: Configure environment variables**
  - [x] Files: `.env.local`, `.gitignore`
  - [x] Add Firebase config with VITE_ prefix:
    - [x] `VITE_FIREBASE_API_KEY`
    - [x] `VITE_FIREBASE_AUTH_DOMAIN`
    - [x] `VITE_FIREBASE_DATABASE_URL`
    - [x] `VITE_FIREBASE_PROJECT_ID`
  - [x] Ensure `.env.local` is in `.gitignore`

- [x] **Task 6: Set up project structure**
  - [x] Files: Create any folders missing from structure above
  - [x] Create placeholder `index.ts` files in each folder

- [x] **Task 7: Configure TypeScript**
  - [x] Files: `tsconfig.json`
  - [x] Ensure strict mode enabled
  - [x] Configure JSX for React

- [x] **Task 8: Create basic App shell with visible content**
  - [x] Files: `src/App.tsx`, `src/index.tsx`, `src/App.css`
  - [x] Display "CollabCanvas MVP" header
  - [x] Add basic routing structure (placeholder routes)
  - [x] Verify app displays in browser with `npm run dev`

- [x] **Task 9: Initialize Git repository**
  - [x] Run: `git init`
  - [x] Files: `.gitignore`
  - [x] Include: `node_modules/`, `.env.local`, `dist/`
  - [x] Create initial commit
  - [x] Create GitHub repository and push

- [x] **Task 10: Set up Vercel deployment**
  - [x] Connect Vercel to GitHub repository
  - [x] Framework Preset: Vite
  - [x] Build Command: `npm run build`
  - [x] Output Directory: `dist`

- [x] **Task 11: Configure Vercel environment variables**
  - [x] Add all VITE_FIREBASE_* variables to Vercel dashboard
  - [x] Deploy to production environment

- [x] **Task 12: Deploy to Vercel**
  - [x] Push to main branch → Vercel auto-deploys
  - [x] Verify "Hello World" loads at production URL
  - [x] No console errors

- [x] **Task 13: Configure Firebase for production**
  - [x] In Firebase Console: Authentication → Settings
  - [x] Add Vercel domain to Authorized domains
  - [x] Test Firebase connection from deployed app

**Definition of Done:**
- ✅ Local dev server runs (`npm run dev`)
- ✅ Firebase SDK initializes without errors
- ✅ TypeScript compiles successfully
- ✅ App deployed to Vercel with public URL
- ✅ "CollabCanvas MVP" header visible on deployed site

---

## PR #2: Authentication System

**Goal:** Users can sign up, log in, log out with email/password.

### Tasks:

- [x] **Task 1: Create user type definitions**
  - [x] Files: `src/types/user.types.ts`
  - [x] Define `User` interface: `{ id: string; email: string; displayName: string; color: string; }`
  - [x] Define `AuthState` type
  - [x] Note: Colors are randomly generated per session (no persistence required for MVP)

- [x] **Task 2: Build authentication service**
  - [x] Files: `src/services/auth.service.ts`
  - [x] Import Firebase Auth from `src/services/firebase.ts`
  - [x] Function: `signUp(email, password, displayName)` - Create user account
  - [x] Function: `logIn(email, password)` - Sign in user
  - [x] Function: `logOut()` - Sign out current user
  - [x] Function: `onAuthStateChanged(callback)` - Subscribe to auth changes

- [x] **Task 3: Create useAuth hook**
  - [x] Files: `src/hooks/useAuth.ts`
  - [x] State: `currentUser`, `loading`
  - [x] Subscribe to Firebase auth state changes on mount
  - [x] Methods: wrap service functions for component use
  - [x] Return user state and methods

- [x] **Task 4: Build Login component**
  - [x] Files: `src/components/Auth/Login.tsx`
  - [x] Form with email and password inputs
  - [x] Submit button calls login function
  - [x] Link to signup page
  - [x] Display errors inline (no toasts needed)
  - [x] Navigate to `/canvas` on success

- [x] **Task 5: Build Signup component**
  - [x] Files: `src/components/Auth/Signup.tsx`
  - [x] Form with email, password, display name inputs
  - [x] Submit button calls signup function
  - [x] Link to login page
  - [x] Display errors inline
  - [x] Navigate to `/canvas` on success

- [x] **Task 6: Create AuthGuard component**
  - [x] Files: `src/components/Auth/AuthGuard.tsx`
  - [x] Check if user is authenticated
  - [x] Show loading state while checking
  - [x] Redirect to `/login` if not authenticated
  - [x] Render children if authenticated

- [x] **Task 7: Set up routing**
  - [x] Files: `src/App.tsx`
  - [x] Install: `npm install react-router-dom`
  - [x] Route `/login` → Login component
  - [x] Route `/signup` → Signup component
  - [x] Route `/canvas` → Canvas (wrapped in AuthGuard)
  - [x] Default route → redirect to `/canvas`

- [x] **Task 8: Add logout functionality**
  - [x] Files: `src/App.tsx`
  - [x] Add logout button in header when user is authenticated
  - [x] Call logout function on click
  - [x] Redirect to `/login` after logout

- [x] **Task 9: Test authentication flow locally**
  - [x] Create test account
  - [x] Log in and verify redirect to canvas
  - [x] Refresh page and verify session persists
  - [x] Log out and verify redirect to login

**Definition of Done:**
- ✅ Users can sign up with email/password
- ✅ Users can log in and see their display name
- ✅ Session persists across page refreshes
- ✅ Canvas route requires authentication
- ✅ Logout clears session and redirects
- ✅ `npm run build` completes without errors
- ✅ `npm run lint` shows no errors
- ✅ No console errors in browser
- ✅ All type imports use `type` keyword where required

---

## PR #3: Presence Awareness System

**Goal:** Show who's currently online in the canvas session using Firebase Realtime Database.

### Tasks:

- [x] **Task 1: Extend user type definitions**
  - [x] Files: `src/types/user.types.ts`
  - [x] Add `PresenceUser` interface: `{ userId: string; displayName: string; color: string; }`
  - [x] **REMEMBER:** Export interfaces (they're types, so consumers will use `import type`)

- [x] **Task 2: Build presence service**
  - [x] Files: `src/services/presence.service.ts`
  - [x] **Import types:** Use `import type` for User, PresenceUser
  - [x] **Firebase imports:** `import { ref, set, remove, onValue, onDisconnect } from 'firebase/database'`
  - [x] Use Firebase Realtime Database (not Firestore)
  - [x] Path: `/presence/{userId}`
  - [x] Function: `setUserOnline(userId, displayName, color)` - Set presence with onDisconnect
  - [x] Function: `setUserOffline(userId)` - Remove presence node
  - [x] Function: `subscribeToPresence(callback)` - Listen to all presence changes
  - [x] Use `onDisconnect().remove()` for automatic cleanup

- [x] **Task 3: Create usePresence hook**
  - [x] Files: `src/hooks/usePresence.ts`
  - [x] **Import types:** Use `import type` for PresenceUser
  - [x] State: `onlineUsers` array
  - [x] Set current user online on mount
  - [x] Subscribe to presence updates
  - [x] Clean up on unmount
  - [x] Return online users list

- [x] **Task 4: Create color utility**
  - [x] Files: `src/utils/colors.ts`
  - [x] Function: `getRandomColor()` - Returns hex color
  - [x] Array of 12 distinct colors
  - [x] Function to assign color to user

- [x] **Task 5: Build OnlineUsers component**
  - [x] Files: `src/components/Presence/OnlineUsers.tsx`
  - [x] **Import types:** Use `import type` for PresenceUser
  - [x] Display list of online users
  - [x] Show colored dot and display name
  - [x] Position in top-right corner
  - [x] Simple vertical list layout

- [x] **Task 6: Build UserAvatar component**
  - [x] Files: `src/components/Presence/UserAvatar.tsx`
  - [x] **Import types:** Use `import type` for prop interface
  - [x] Props: `displayName`, `color`
  - [x] Display first letter in colored circle
  - [x] Reusable for presence list and future cursors

- [x] **Task 7: Integrate presence into Canvas page**
  - [x] Files: Create `src/components/Canvas/Canvas.tsx` (placeholder for now)
  - [x] Use `usePresence()` hook
  - [x] Render `OnlineUsers` component
  - [x] Pass current user info to presence service

- [x] **Task 8: Test presence system locally**
  - [x] Open app in 2 browser windows
  - [x] Log in with different accounts
  - [x] Verify both users appear in online list
  - [x] Close one browser → user disappears
  - [x] Firebase onDisconnect handles cleanup automatically

**Definition of Done:**
- ✅ Online users list shows all active users
- ✅ Each user has a unique color
- ✅ Users disappear when they disconnect
- ✅ Firebase onDisconnect prevents ghost users
- ✅ Real-time updates across all clients
- ✅ `npm run build` completes without errors
- ✅ `npm run lint` shows no errors
- ✅ No console errors in browser
- ✅ All type imports use `type` keyword where required

---

## PR #4: Multiplayer Cursors & Deploy

**Goal:** See all users' cursor positions in real-time, then deploy working multiplayer infrastructure.

### Tasks:

- [x] **Task 1: Create throttle utility**
  - [x] Files: `src/utils/throttle.ts`
  - [x] Generic throttle function for rate limiting
  - [x] Will limit cursor updates to 100ms intervals

- [x] **Task 2: Create cursor type definitions**
  - [x] Files: `src/types/canvas.types.ts`
  - [x] Define `CursorPosition`: `{ userId: string; x: number; y: number; displayName: string; color: string; }`

- [x] **Task 3: Build cursor service**
  - [x] Files: `src/services/cursor.service.ts`
  - [x] Use Firebase Realtime Database
  - [x] Path: `/cursors/{userId}`
  - [x] Function: `updateCursorPosition(userId, x, y, displayName, color)`
  - [x] Function: `subscribeToCursors(callback)` - Listen to all cursor updates
  - [x] Function: `removeCursor(userId)` - Delete on disconnect
  - [x] Use `onDisconnect().remove()` for cleanup

- [x] **Task 4: Create useCursors hook**
  - [x] Files: `src/hooks/useCursors.ts`
  - [x] Import throttle utility
  - [x] State: `cursors` map (userId → CursorPosition)
  - [x] Subscribe to cursor updates
  - [x] Method: `updateMyCursor(x, y)` - Throttled to 100ms
  - [x] Clean up cursor on unmount
  - [x] Return cursors and update method

- [x] **Task 5: Build Cursor component as Konva object**
  - [x] Files: `src/components/Cursors/Cursor.tsx`
  - [x] Render as Konva Group with:
    - [x] Konva Arrow or custom shape for cursor
    - [x] Konva Text for name label
  - [x] Props: `x`, `y`, `displayName`, `color`
  - [x] Position using Konva x/y props
  - [x] Note: Konva handles transforms automatically

- [x] **Task 6: Integrate cursors into Canvas**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Set up basic Konva Stage and Layer
  - [x] Add onMouseMove listener to Stage
  - [x] Get pointer position from Konva stage
  - [x] Call `updateMyCursor` with stage coordinates
  - [x] Render Cursor components in Konva Layer
  - [x] Filter out current user's cursor

- [x] **Task 7: Test cursor synchronization**
  - [x] Open in 2 browsers
  - [x] Move mouse and verify cursor appears in other browser
  - [x] Verify name labels are correct
  - [x] Check 100ms throttling is working
  - [x] Test with 3+ users

- [x] **Task 8: Deploy to Vercel**
  - [x] Commit and push all changes
  - [x] Verify deployment succeeds
  - [x] Test authentication on deployed URL
  - [x] Test presence system on deployed URL
  - [x] Test cursor sync on deployed URL
  - [x] Verify no CORS issues

**Definition of Done:**
- ✅ Cursors render as Konva objects
- ✅ Cursor positions sync in real-time
- ✅ 100ms throttling reduces database writes
- ✅ Name labels visible on cursors
- ✅ Deployed to Vercel successfully
- ✅ Multiplayer cursors work on production URL

**Note:** Cursors will be converted to HTML overlay in PR #5 to prevent scaling with zoom.

---

## PR #5: Basic Canvas with Pan/Zoom, HTML Cursor Overlay & Grid

**Goal:** Create a navigable 5000x5000 canvas with smooth pan/zoom, convert cursors to HTML overlay that doesn't scale, and add Figma-style adaptive grid for visual feedback.

### Tasks:

- [x] **Task 1: Define viewport types**
  - [x] Files: `src/types/canvas.types.ts`
  - [x] Add `ViewportState`: `{ x: number; y: number; scale: number; }`
  - [x] Add `CanvasConfig` with dimensions (5000x5000)

- [x] **Task 2: Set up Konva Stage with viewport state**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Add state for viewport: `{ x, y, scale }`
  - [x] Configure Stage with full window dimensions
  - [x] Set initial scale: 1, position: { x: 0, y: 0 }
  - [x] Apply viewport state to Stage props

- [x] **Task 3: Implement pan functionality**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Set Stage `draggable={true}` (Konva built-in)
  - [x] Add `onDragEnd` handler to Stage
  - [x] Update viewport state with new position on drag
  - [x] Cursor should change to "grab" when hovering canvas

- [x] **Task 4: Implement zoom functionality**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Add `onWheel` event listener to Stage
  - [x] Calculate new scale (min: 0.1, max: 3)
  - [x] Calculate zoom toward mouse position
  - [x] Formula: `newPos = mousePos - (mousePos - oldPos) * (newScale / oldScale)`
  - [x] Update both scale and position in viewport state

- [x] **Task 5: Create canvas coordinate utilities**
  - [x] Files: `src/utils/canvas.utils.ts`
  - [x] Function: `canvasToScreen(canvasX, canvasY, viewport)` - Convert canvas coords to screen coords
    - [x] Formula: `screenX = canvasX * scale + stageX`
    - [x] Formula: `screenY = canvasY * scale + stageY`
  - [x] Function: `screenToCanvas(screenX, screenY, viewport)` - Convert screen coords to canvas coords
    - [x] Formula: `canvasX = (screenX - stageX) / scale`
    - [x] Formula: `canvasY = (screenY - stageY) / scale`
  - [x] Export both functions with proper TypeScript types

- [x] **Task 6: Remove Konva cursor rendering**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Remove Cursor components from Konva Layer
  - [x] Remove imports of Konva cursor rendering
  - [x] Keep cursor data fetching logic (useCursors hook)
  - [x] Keep onMouseMove handler (still tracks canvas coordinates)

- [x] **Task 7: Create HTML-based Cursor component**
  - [x] Files: `src/components/Cursors/Cursor.tsx` (complete rewrite)
  - [x] Convert from Konva Group to HTML div
  - [x] Props: `x`, `y` (screen coordinates), `displayName`, `color`
  - [x] Structure:
    - [x] Outer div with absolute positioning
    - [x] SVG or CSS-based cursor pointer shape
    - [x] Name label in colored box
  - [x] Use `style={{ left: x, top: y, position: 'absolute' }}`
  - [x] Apply z-index to stay above canvas but below UI

- [x] **Task 8: Style HTML cursor overlay**
  - [x] Files: `src/components/Cursors/Cursor.css`
  - [x] Cursor pointer styles (SVG path or CSS triangle)
  - [x] Name label with background color matching user color
  - [x] Smooth transitions for position updates
  - [x] Pointer-events: none (cursors shouldn't block interactions)
  - [x] z-index: 100 (above canvas, below toolbar)

- [x] **Task 9: Create cursor overlay container**
  - [x] Files: `src/components/Canvas/Canvas.tsx`, `src/components/Canvas/Canvas.css`
  - [x] Add div with className `cursor-overlay`
  - [x] Position: absolute, top: 0, left: 0
  - [x] Full viewport size (100% width/height)
  - [x] Pointer-events: none (passthrough to canvas below)
  - [x] z-index management
  - [x] Render after Stage component (overlays on top)

- [x] **Task 10: Integrate HTML cursors with coordinate conversion**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Import `canvasToScreen` from canvas.utils
  - [x] Map over cursors object
  - [x] For each cursor, convert canvas (x, y) to screen coordinates
  - [x] Pass screen coordinates to HTML Cursor component
  - [x] Filter out current user's cursor
  - [x] Render in cursor-overlay div

- [x] **Task 11: Update cursor position tracking**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Verify onMouseMove still captures canvas coordinates
  - [x] Use `stage.getPointerPosition()` (returns canvas coordinates)
  - [x] Continue updating Firebase with canvas coordinates (not screen)
  - [x] Only convert to screen coordinates when rendering

- [x] **Task 12: Add viewport persistence**
  - [x] Files: `src/hooks/useCanvas.ts` (create new hook)
  - [x] Load viewport from localStorage on mount
  - [x] Key: `'canvasViewport'`
  - [x] Save viewport to localStorage on change
  - [x] Debounce saves to 500ms to reduce writes
  - [x] Return viewport state and setter

- [x] **Task 13: Integrate useCanvas hook**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Replace local viewport state with useCanvas hook
  - [x] Hook manages persistence automatically
  - [x] Apply saved viewport on Stage mount

- [x] **Task 14: Add canvas background**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Add Konva Rect as first element in Layer
  - [x] Dimensions: 5000x5000 (full canvas size)
  - [x] Color: #f5f5f5 (light gray)
  - [x] No interaction (listening: false)
  - [x] Provides visual boundary for workspace

- [x] **Task 15: Style canvas container**
  - [x] Files: `src/components/Canvas/Canvas.css`
  - [x] Canvas workspace: overflow: hidden
  - [x] Stage container: position: relative
  - [x] Cursor styles: 
    - [x] Default: `cursor: grab`
    - [x] Active drag: `cursor: grabbing`
  - [x] Ensure header stays fixed above canvas

- [x] **Task 16: Test pan and zoom with HTML cursors**
  - [x] Open app in 2 browsers
  - [x] Pan canvas → verify cursors move with content
  - [x] Zoom in → verify cursors stay same visual size
  - [x] Zoom out → verify cursors stay same visual size
  - [x] Move mouse → verify cursor positions update correctly
  - [x] Refresh page → viewport position restored
  - [x] Test at different zoom levels (0.5x, 1x, 2x)

- [x] **Task 17: Create grid utility functions**
  - [x] Files: `src/utils/canvas.utils.ts`
  - [x] Function: `getAdaptiveGridSize(scale)` - Returns grid sizes based on zoom
  - [x] Function: `getVisibleGridLines(viewport, canvasWidth, canvasHeight, gridSize, viewportWidth, viewportHeight)` - Calculates visible grid lines
  - [x] Adaptive logic: high zoom shows minor+major, low zoom shows major only

- [x] **Task 18: Build CanvasGrid component**
  - [x] Files: `src/components/Canvas/CanvasGrid.tsx`
  - [x] Props: `width`, `height`, `viewport`
  - [x] Render minor grid lines (50px spacing, #e0e0e0)
  - [x] Render major grid lines (500px spacing, #cccccc)
  - [x] Canvas boundary rectangle (#999999, 3px stroke)
  - [x] Scale-compensated line widths (constant visual thickness)
  - [x] Performance optimization: only render visible lines

- [x] **Task 19: Integrate grid into Canvas**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Import CanvasGrid component
  - [x] Add to Layer after background, before objects
  - [x] Pass canvas dimensions and viewport

- [x] **Task 20: Test grid visualization**
  - [x] Grid appears at 1x zoom with both minor/major lines
  - [x] Zoom to 2x → grid lines stay constant thickness
  - [x] Zoom to 0.5x → only major grid visible
  - [x] Pan canvas → grid moves correctly
  - [x] Canvas boundary clearly visible

**Definition of Done:**
- ✅ Canvas pans smoothly with drag
- ✅ Zoom works with mouse wheel toward cursor
- ✅ Viewport persists in localStorage
- ✅ 5000x5000 workspace established with visible background
- ✅ Cursors render as HTML overlay (not Konva objects)
- ✅ Cursors remain constant size at all zoom levels
- ✅ Cursor positions accurately track at any zoom/pan level
- ✅ Coordinate conversion functions work correctly
- ✅ No performance issues during pan/zoom
- ✅ Figma-style adaptive grid renders correctly
- ✅ Grid provides clear visual feedback for zoom level
- ✅ Canvas boundaries are clearly marked
- ✅ Grid lines maintain constant visual width at all zoom levels
- ✅ Grid adapts spacing based on zoom (minor grid hides at low zoom)

---

## PR #6: Rectangle Shape Creation & Deploy

**Goal:** Users can create and select rectangles on the canvas, then deploy working canvas.

### Tasks:

- [x] **Task 1: Define object types**
  - [x] Files: `src/types/object.types.ts`
  - [x] Define `CanvasObject` base interface
  - [x] Define `RectangleObject` with: `{ id, type: 'rectangle', x, y, width, height, color, lockedBy }`

- [x] **Task 2: Build object service**
  - [x] Files: `src/services/object.service.ts`
  - [x] Use Firebase Realtime Database
  - [x] Path: `/objects/{objectId}`
  - [x] Function: `createObject(object)` - Add to database
  - [x] Function: `updateObject(objectId, updates)` - Update object
  - [x] Function: `deleteObject(objectId)` - Remove object
  - [x] Function: `subscribeToObjects(callback)` - Listen to changes

- [x] **Task 3: Create useObjects hook**
  - [x] Files: `src/hooks/useObjects.ts`
  - [x] State: `objects` map, `selectedObjectId`
  - [x] Subscribe to object updates
  - [x] Method: `createRectangle(x, y)` - Create with default size/color
  - [x] Method: `selectObject(objectId)` - Set selection
  - [x] Method: `deselectObject()` - Clear selection
  - [x] Return objects, selection, and methods

- [x] **Task 4: Build CanvasObject component**
  - [x] Files: `src/components/Canvas/CanvasObject.tsx`
  - [x] Render Konva Rect
  - [x] Props: `object`, `isSelected`, `onSelect`
  - [x] Show stroke when selected
  - [x] Handle click for selection
  - [x] Set draggable={false} for now

- [x] **Task 5: Add creation mode toggle**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] State: `isCreating` boolean
  - [x] Toggle between "select" and "create" modes

- [x] **Task 6: Build simple Toolbar**
  - [x] Files: `src/components/Canvas/Toolbar.tsx`
  - [x] Button: "Add Rectangle" - toggles creation mode
  - [x] Show current mode state
  - [x] Position at top of canvas

- [x] **Task 7: Implement rectangle creation**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] When in creation mode:
    - [x] Stage click creates rectangle at pointer position
    - [x] Default: 100x100px, random color
    - [x] Exit creation mode after creating
  - [x] When in select mode:
    - [x] Click on rectangle selects it
    - [x] Click on empty space deselects

- [x] **Task 8: Render objects from database**
  - [x] Files: `src/components/Canvas/Canvas.tsx`
  - [x] Map over objects from useObjects
  - [x] Render CanvasObject for each
  - [x] Layer order: background → objects → cursors

- [x] **Task 9: Test object creation and sync**
  - [x] Create rectangles in one browser
  - [x] Verify they appear in other browser instantly
  - [x] Test selection visual feedback
  - [x] Create 10+ rectangles for performance check
  - [x] **Bug Fix:** Fixed critical coordinate system bug causing objects/cursors to cluster in top-left

- [ ] **Task 10: Deploy to Vercel**
  - [ ] Commit and push changes
  - [ ] Verify deployment succeeds
  - [ ] Test rectangle creation on production
  - [ ] Test multi-user object sync
  - [ ] Verify pan/zoom still works with objects

**Definition of Done:**
- ✅ Can create rectangles by clicking
- ✅ Rectangles have random colors
- ✅ Can select rectangles (visual feedback)
- ✅ Objects sync across all clients
- ✅ Ghost rectangle preview shows before creation
- ✅ Coordinates work correctly at all zoom/pan levels
- ✅ Ready for deployment to Vercel

---

## PR #7: Object Movement & Real-Time Sync

**Goal:** Users can drag rectangles with proper locking to prevent conflicts.

### Tasks:

- [x] **Task 1: Implement object locking service functions**
  - [x] Files: `src/services/object.service.ts`
  - [x] Function: `acquireLock(objectId, userId)` - Use transaction
  - [x] Function: `releaseLock(objectId, userId)` - Clear lock
  - [x] Implement with Firebase transaction for atomicity

- [x] **Task 2: Add lock acquisition logic**
  - [x] Files: `src/hooks/useObjects.ts`
  - [x] Method: `lockObject(objectId)` - Try to acquire lock
  - [x] Method: `unlockObject(objectId)` - Release lock
  - [x] Return lock status with objects

- [x] **Task 3: Enable dragging in CanvasObject**
  - [x] Files: `src/components/Canvas/CanvasObject.tsx`
  - [x] Props: add `isLocked`, `onDragStart`, `onDragEnd`
  - [x] Set `draggable={!isLocked && isSelected}`
  - [x] Different visual when locked by another user

- [x] **Task 4: Handle drag start**
  - [x] Files: `src/components/Canvas/CanvasObject.tsx`
  - [x] On dragStart: Call `onDragStart` prop
  - [x] Parent attempts to acquire lock via transaction
  - [x] If lock acquired: Allow drag
  - [x] If lock failed: Cancel drag

- [x] **Task 5: Handle drag end**
  - [x] Files: `src/components/Canvas/CanvasObject.tsx`
  - [x] On dragEnd: Get new position from event
  - [x] Call `onDragEnd` with new x, y
  - [x] Parent updates object position in database
  - [x] Release lock

- [x] **Task 6: Implement transaction-based locking**
  - [x] Files: `src/services/object.service.ts`
  - [x] ```javascript
  const lockRef = database.ref(`/objects/${objectId}/lockedBy`);
  return lockRef.transaction((current) => {
    if (!current) return userId;
    return; // Abort - already locked
  });
  ```

- [x] **Task 7: Show locked object state**
  - [x] Files: `src/components/Canvas/CanvasObject.tsx`
  - [x] If locked by another: Lower opacity or different stroke
  - [x] Cursor changes to not-allowed when hovering
  - [x] Cannot select if locked by another

- [x] **Task 8: Update position in real-time**
  - [x] Files: `src/hooks/useObjects.ts`
  - [x] Method: `moveObject(objectId, x, y)` - Update position
  - [x] All clients receive position updates
  - [x] Smooth visual update

- [x] **Task 9: Handle lock cleanup on disconnect**
  - [x] Files: `src/services/object.service.ts`
  - [x] When acquiring lock: Set up onDisconnect to release
  - [x] Prevents orphaned locks if user disconnects while dragging

- [x] **Task 10: Test object movement and locking**
  - [x] User A drags rectangle → User B sees it move
  - [x] User A dragging → User B cannot select same rectangle
  - [x] User A releases → User B can now drag
  - [x] Disconnect while dragging → lock released

**Definition of Done:**
- ✅ Can drag rectangles to new positions
- ✅ Position updates sync in real-time
- ✅ Transaction prevents simultaneous locks
- ✅ Visual feedback for locked objects
- ✅ Locks release on disconnect
- ✅ No conflicts with multiple users
- ✅ Cursor position updates correctly during object drag
- ✅ Viewport does not reset when dropping objects
- ✅ Real-time object movement visible to all users during drag

---

## PR #8: State Persistence & Final Deploy

**Goal:** Ensure all state persists correctly and deploy final MVP.

### Tasks:

- [ ] **Task 1: Verify Firebase persistence**
  - [ ] Files: Review all services
  - [ ] Confirm all creates/updates write to Realtime Database
  - [ ] Database handles persistence automatically

- [ ] **Task 2: Load initial canvas state**
  - [ ] Files: `src/hooks/useObjects.ts`
  - [ ] On mount: Fetch all existing objects
  - [ ] Subscribe to updates after initial load
  - [ ] New users see existing canvas state

- [ ] **Task 3: Verify viewport persistence**
  - [ ] Files: `src/hooks/useCanvas.ts`
  - [ ] Confirm localStorage save/load works
  - [ ] Test: Refresh with custom zoom/pan → restores correctly

- [ ] **Task 4: Handle reconnection gracefully**
  - [ ] Files: `src/hooks/usePresence.ts`
  - [ ] Re-establish presence on reconnect
  - [ ] Firebase Realtime Database handles this automatically

- [ ] **Task 5: Clean up locks on disconnect**
  - [ ] Files: `src/services/object.service.ts`
  - [ ] Verify onDisconnect handlers work
  - [ ] Test: Close browser while dragging → lock released

- [ ] **Task 6: Test persistence scenarios**
  - [ ] Create objects → refresh → objects persist
  - [ ] Custom viewport → refresh → viewport persists
  - [ ] All users leave → return → canvas unchanged
  - [ ] Disconnect mid-drag → object stays, lock released

- [ ] **Task 7: Add basic error handling**
  - [ ] Files: All service files
  - [ ] Wrap database calls in try-catch
  - [ ] Log errors to console
  - [ ] Don't crash on network errors

- [ ] **Task 8: Performance check**
  - [ ] Create 20+ rectangles
  - [ ] Move objects rapidly
  - [ ] Verify no major lag
  - [ ] Test with 3+ concurrent users

- [ ] **Task 9: Final deployment to Vercel**
  - [ ] Commit all changes
  - [ ] Push to main branch
  - [ ] Verify build succeeds
  - [ ] No console errors in production

- [ ] **Task 10: Production testing**
  - [ ] Test all features on deployed URL
  - [ ] Multi-user collaboration test
  - [ ] Persistence test
  - [ ] Lock conflict test
  - [ ] Share URL with others for testing

**Definition of Done:**
- ✅ All state persists across refreshes
- ✅ Canvas works with 5+ concurrent users
- ✅ No data loss in any scenario
- ✅ Deployed successfully to production
- ✅ All MVP requirements met

---

## PR #9: Bug Fixes & Documentation

**Goal:** Fix any remaining issues and create documentation.

### Tasks:

- [ ] **Task 1: Fix critical bugs found in testing**
  - [ ] Address any show-stopping issues
  - [ ] Focus only on bugs that break MVP requirements
  - [ ] Don't add features

- [ ] **Task 2: Create README documentation**
  - [ ] Files: `README.md`
  - [ ] Project description
  - [ ] Tech stack used
  - [ ] Setup instructions
  - [ ] Deployed URL
  - [ ] Known limitations

- [ ] **Task 3: Record demo video**
  - [ ] 3-5 minute demonstration
  - [ ] Show: Login, cursors, creating rectangles, moving objects, locking, persistence
  - [ ] Multiple browsers to show collaboration
  - [ ] Upload to YouTube/Loom
  - [ ] Add link to README

- [ ] **Task 4: Final testing checklist**
  - [ ] 2+ users can see each other's cursors
  - [ ] Objects sync in real-time
  - [ ] Locking prevents conflicts
  - [ ] State persists on refresh
  - [ ] Viewport position saves
  - [ ] 5+ users work simultaneously

- [ ] **Task 5: Submit MVP**
  - [ ] Ensure deployed URL is accessible
  - [ ] GitHub repository is public
  - [ ] README has all required information
  - [ ] Demo video link works

**Definition of Done:**
- ✅ No critical bugs remain
- ✅ README complete with setup instructions
- ✅ Demo video recorded and linked
- ✅ All MVP requirements verified working
- ✅ Ready for submission

---

## Testing Checklist (Run Before Each Deployment)

Before marking any PR with deployment as complete:

### Functionality Tests:
- [ ] Feature works locally
- [ ] No TypeScript errors
- [ ] No console errors

### Deployment Tests:
- [ ] Builds successfully
- [ ] Deploys to Vercel without errors
- [ ] Feature works on production URL
- [ ] Environment variables working

### Collaboration Tests:
- [ ] Test with 2+ browsers
- [ ] Real-time sync working
- [ ] No race conditions

---

## Critical Implementation Notes

### Firebase Realtime Database Structure:
```javascript
{
  "presence": {
    "{userId}": { displayName, color }
  },
  "cursors": {
    "{userId}": { x, y, displayName, color }
  },
  "objects": {
    "{objectId}": { id, type, x, y, width, height, color, lockedBy }
  }
}
```

### Transaction-Based Locking:
```javascript
const lockRef = database.ref(`/objects/${objectId}/lockedBy`);
const result = await lockRef.transaction((currentLock) => {
  if (!currentLock) return userId; // Acquire lock
  return; // Abort - already locked
});
if (result.committed) {
  // Lock acquired successfully
}
```

### Cursor Throttling:
```javascript
const throttledUpdate = throttle((x, y) => {
  updateCursorPosition(userId, x, y, displayName, color);
}, 100); // 100ms = 10 updates per second
```

### Viewport Persistence:
```javascript
// Save
localStorage.setItem('canvasViewport', JSON.stringify({ x, y, scale }));
// Load
const saved = JSON.parse(localStorage.getItem('canvasViewport') || '{}');
```
