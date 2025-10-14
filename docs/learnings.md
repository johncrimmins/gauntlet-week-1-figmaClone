# CollabCanvas MVP - Learnings & Technical Notes

**Last Updated:** October 14, 2025

---

## Overview

This document captures key technical learnings, gotchas, and solutions encountered during the development of CollabCanvas MVP. Use this as a reference to avoid common pitfalls and understand implementation decisions.

---

## PR #2: Authentication System

### Issue #1: Firebase Type Imports with `verbatimModuleSyntax`

**Date:** October 14, 2025  
**Severity:** Critical (Blank white screen)

#### Problem

Application showed a blank white screen with the following console error:
```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/firebase_auth.js?v=04f4e542' 
does not provide an export named 'User' (at auth.service.ts:14:3)
```

#### Root Cause

TypeScript's `verbatimModuleSyntax` compiler flag (enabled in our `tsconfig.json`) requires that type-only imports use the explicit `type` keyword. When importing types from Firebase and React without the `type` keyword, the compiler tried to import them as runtime values, which don't exist in the ES modules.

**Incorrect Code:**
```typescript
import { User as FirebaseUser } from 'firebase/auth';
import { User, AuthState } from '../types/user.types';
import { ReactNode } from 'react';
```

**Correct Code:**
```typescript
import { type User as FirebaseUser } from 'firebase/auth';
import type { User, AuthState } from '../types/user.types';
import type { ReactNode } from 'react';
```

#### Solution

Add the `type` keyword before any type-only imports:
- Use `import type { Type }` when importing only types
- Use `import { type Type }` when mixing types and values in the same import statement

#### Files Fixed

1. `src/services/auth.service.ts` (lines 14, 17)
2. `src/hooks/useAuth.ts` (line 9)
3. `src/components/Auth/AuthGuard.tsx` (line 9)

#### Prevention

**Rule:** When using TypeScript with `verbatimModuleSyntax: true`:
- ✅ Always use `type` keyword for type-only imports
- ✅ Check linter errors before running the dev server
- ✅ Run `npm run build` to catch these issues early

#### References

- [TypeScript: verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [Firebase v9+ Modular SDK](https://firebase.google.com/docs/web/modular-upgrade)

---

### Issue #2: User Color Consistency (Design Decision)

**Date:** October 14, 2025  
**Severity:** Low (Design clarification)

#### Problem

Initial implementation generated random colors for users on each authentication state change, meaning users would get different colors every time they refreshed the page or logged in.

#### Decision

For MVP scope, **random color generation without persistence is acceptable**. Color persistence is not a critical feature for the MVP checkpoint.

**Rationale:**
- Simplifies implementation (no database storage needed)
- Reduces complexity in auth flow
- Does not impact core multiplayer functionality
- Can be enhanced post-MVP if needed

#### Implementation

Colors are generated randomly from a predefined palette of 12 distinct colors:
```typescript
function generateUserColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E63946', '#457B9D',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
```

#### Documentation Updates

- Updated `docs/prd.md` (line 102) to note random color assignment
- Updated `docs/tasklist.md` (line 198) to note no persistence required

#### Future Enhancement (Post-MVP)

If color persistence becomes important:
- **Option 1:** Store color in Firebase Realtime Database under `/users/{userId}/color`
- **Option 2:** Generate deterministic color from user ID using hash function
- **Option 3:** Allow users to select their own color

---

## Development Environment

### Tech Stack Versions

- **Firebase:** v12.4.0 (Modular SDK)
- **React:** v19.1.1
- **TypeScript:** ~5.9.3
- **Vite:** v7.1.7
- **Node.js:** Compatible with above

### Compiler Configuration

**Important:** Our `tsconfig.json` has `verbatimModuleSyntax: true` enabled, which enforces strict type import rules. This is intentional for better tree-shaking and module optimization.

---

## Best Practices Established

### 1. Type Imports

**Always use `type` keyword for type-only imports:**
```typescript
// ✅ Correct
import type { User } from './types';
import { useState, type FormEvent } from 'react';

// ❌ Incorrect (with verbatimModuleSyntax)
import { User } from './types';
import { FormEvent } from 'react';
```

### 2. Firebase Auth User Type

**Firebase v9+ does not export `User` as a named value export**, only as a type:
```typescript
// ✅ Correct
import { type User as FirebaseUser } from 'firebase/auth';

// ❌ Incorrect
import { User as FirebaseUser } from 'firebase/auth';
```

### 3. Error Handling Pattern

All service functions follow this pattern:
```typescript
try {
  // Firebase operation
  return result;
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Operation failed: ${error.message}`);
  }
  throw new Error('Operation failed: Unknown error');
}
```

### 4. Build Verification

Before considering any feature complete:
1. Run `npm run build` to check for TypeScript errors
2. Run `npm run lint` to check for linting issues
3. Test in browser for runtime errors
4. Check browser console for warnings

---

## Testing Checklist

### Authentication Flow (PR #2)

- [x] Create account at `/signup`
- [x] Log in at `/login`
- [x] Session persists across page refresh
- [x] Logout clears session
- [x] AuthGuard redirects unauthenticated users
- [x] User display name appears after login
- [x] No console errors
- [x] No blank white screens

---

## Common Pitfalls to Avoid

### 1. Module Import Errors

**Symptom:** Blank white screen, module import errors in console  
**Cause:** Missing `type` keyword for type-only imports  
**Fix:** Add `type` keyword to imports

### 2. Firebase Configuration

**Symptom:** "Firebase: No Firebase App '[DEFAULT]' has been created"  
**Cause:** Firebase not initialized before use  
**Fix:** Ensure `firebase.ts` is imported before any Firebase operations

### 3. React Hook Dependencies

**Symptom:** Stale closures, infinite re-renders  
**Cause:** Missing or incorrect dependencies in `useEffect`  
**Fix:** Follow ESLint exhaustive-deps rule

---

## Debugging Tips

### When You See a Blank White Screen

1. **Check browser console** for errors (this is always the first step)
2. **Check Network tab** for failed requests
3. **Run build** to catch TypeScript errors: `npm run build`
4. **Check imports** for missing `type` keywords
5. **Verify Firebase config** in environment variables

### TypeScript Compilation Errors

1. **Read the error message** carefully (line numbers are accurate)
2. **Check for type import issues** (most common with our config)
3. **Run `npm run build`** to see all errors at once
4. **Fix from top to bottom** (later errors may be caused by earlier ones)

### Firebase Authentication Issues

1. **Check Firebase Console** for auth provider configuration
2. **Verify environment variables** are set correctly
3. **Check authorized domains** in Firebase Console
4. **Look for CORS errors** in browser console

---

## Resources & References

### Official Documentation

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Project Documentation

- `docs/prd.md` - Product requirements and MVP scope
- `docs/tasklist.md` - Detailed implementation tasks
- `docs/architecture.mmd` - System architecture diagram

---

## PR #4: Multiplayer Cursors & Deploy

### Issue #1: Performance Lag from Repeated onDisconnect Calls

**Date:** October 14, 2025  
**Severity:** Critical (Performance degradation)

#### Problem

Multiplayer cursors were working but experiencing noticeable lag. Cursor movements were somewhat smooth but had a delayed, sluggish feel. Console showed no errors initially during normal operation.

#### Root Cause

The `updateCursorPosition()` function was calling `onDisconnect().remove()` **on every single cursor update** (10 times per second per user):

```typescript
// ❌ BAD: Called every 100ms
export async function updateCursorPosition(...) {
  const cursorRef = ref(database, `cursors/${userId}`);
  await onDisconnect(cursorRef).remove();  // Performance killer!
  await set(cursorRef, { ... });
}
```

This created massive overhead:
- 10 onDisconnect registrations per second per user
- Each registration requires a Firebase round-trip
- Accumulated latency caused the lag

#### Solution

Separate the one-time initialization from the frequent updates:

```typescript
// ✅ GOOD: Call ONCE when user joins
export async function initializeCursor(userId: string) {
  const cursorRef = ref(database, `cursors/${userId}`);
  await onDisconnect(cursorRef).remove();
}

// ✅ GOOD: Called frequently without onDisconnect overhead
export async function updateCursorPosition(...) {
  const cursorRef = ref(database, `cursors/${userId}`);
  await set(cursorRef, { ... });  // Just update position
}
```

In the hook:
```typescript
useEffect(() => {
  // Initialize ONCE
  cursorService.initializeCursor(userId);
  
  // Subscribe to updates
  const unsubscribe = cursorService.subscribeToCursors(callback);
  
  return () => unsubscribe();
}, [userId, displayName, color]);
```

#### Files Fixed

1. `src/services/cursor.service.ts` - Split into initializeCursor() and updateCursorPosition()
2. `src/hooks/useCursors.ts` - Call initializeCursor() once in useEffect

---

### Issue #2: PERMISSION_DENIED Errors on Cleanup

**Date:** October 14, 2025  
**Severity:** High (Console errors, potential data inconsistency)

#### Problem

Console showed repeated PERMISSION_DENIED errors when users navigated away or closed the browser:

```
Failed to set user offline: Error: PERMISSION_DENIED: Permission denied
Failed to remove cursor: Error: PERMISSION_DENIED: Permission denied
```

#### Root Cause

Both the manual cleanup functions AND Firebase's `onDisconnect` handlers were trying to remove the same data simultaneously, creating a race condition:

```typescript
// ❌ BAD: Conflicts with onDisconnect
return () => {
  unsubscribe();
  presenceService.setUserOffline(userId);  // Conflicts!
  cursorService.removeCursor(userId);      // Conflicts!
};
```

Firebase's `onDisconnect` handlers trigger automatically when the connection drops, but the React cleanup functions also tried to manually remove the data, leading to permission conflicts.

#### Solution

Trust Firebase's `onDisconnect` to handle cleanup automatically. Remove manual cleanup calls:

```typescript
// ✅ GOOD: Only unsubscribe, let onDisconnect handle data removal
return () => {
  unsubscribe();
  // onDisconnect automatically removes presence/cursor data
};
```

**Rationale:**
- `onDisconnect().remove()` is specifically designed for this use case
- It handles network failures, browser crashes, and clean disconnects
- Manual removal is redundant and causes conflicts

#### Files Fixed

1. `src/hooks/usePresence.ts` - Removed manual `setUserOffline()` call
2. `src/hooks/useCursors.ts` - Removed manual `removeCursor()` call

#### Prevention

**Rule:** When using Firebase `onDisconnect()`:
- ✅ Set it up ONCE during initialization
- ✅ Let it handle all cleanup automatically
- ❌ Don't manually remove data in React cleanup functions
- ❌ Don't call onDisconnect on every update

#### Testing Verification

After fixes:
- ✅ Cursor movements should be significantly smoother
- ✅ No PERMISSION_DENIED errors in console
- ✅ Users disappear from presence list immediately on disconnect
- ✅ Cursors disappear when users close browser

---

### Issue #3: Ghost Users on Logout

**Date:** October 14, 2025  
**Severity:** Medium (Functional bug)

#### Problem

When users clicked the "Logout" button, they remained in the online users list (ghost users). The issue occurred on both localhost and production deployment.

#### Root Cause

`onDisconnect()` only fires on **network disconnection**, not on intentional logout actions:

**What onDisconnect handles:**
- ✅ Browser/tab closes
- ✅ Network connection drops
- ✅ Page crashes
- ❌ **Logout button clicks** (connection still active!)

When a user logs out:
1. Logout button clicked
2. Auth service signs out
3. User redirected to `/login`
4. Canvas component unmounts
5. Firebase connection **still active** - no disconnect event
6. onDisconnect never fires → user stays in database

#### Solution

Manually clean up presence and cursor data **before** the logout redirect:

```typescript
// In Canvas.tsx handleLogout
async function handleLogout() {
  try {
    // Manual cleanup BEFORE logout (connection still active)
    if (currentUser?.id) {
      await presenceService.setUserOffline(currentUser.id);
      await cursorService.removeCursor(currentUser.id);
    }
    
    // Then logout (which redirects)
    await logOut();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

**Why this works:**
- Cleanup happens while connection is still active
- Executes before redirect/unmount
- Doesn't conflict with onDisconnect (onDisconnect is a fallback)
- Immediate removal from online users list

#### Files Fixed

1. `src/components/Canvas/Canvas.tsx` - Added manual cleanup in handleLogout()

#### Prevention

**Rule:** Firebase `onDisconnect()` cleanup pattern:
- ✅ Use `onDisconnect()` for network disconnections (crash, close tab)
- ✅ Use manual cleanup for intentional user actions (logout, leave room)
- ✅ Cleanup **before** redirects/unmounts, not during
- ❌ Don't rely solely on onDisconnect for all cleanup scenarios

**The Complete Pattern:**

```typescript
// Setup: Called once on join
await onDisconnect(ref).remove();  // Handles crashes/closes

// Cleanup: Called on intentional logout
await remove(ref);  // Handles explicit user actions
```

#### Testing Verification

After fix:
- ✅ User clicks logout → immediately removed from online users list
- ✅ User closes tab → onDisconnect removes them automatically
- ✅ No ghost users in either scenario
- ✅ Works on both localhost and production

---

---

## PR #5: Basic Canvas with Pan/Zoom & HTML Cursor Overlay

### Issue #1: Cursor Scaling with Canvas Zoom (Architecture Decision)

**Date:** October 14, 2025  
**Severity:** Medium (Design issue affecting UX)

#### Problem

Initial implementation rendered cursors as Konva shape objects within the same Layer as canvas content. This caused cursors to scale along with the canvas during zoom operations:
- Zooming in made cursors huge
- Zooming out made cursors tiny
- Poor UX compared to professional tools (Figma, Miro, etc.)

#### Analysis

Konva does not provide native functionality for elements that don't transform with the stage. When using Konva's pan/zoom on the Stage, ALL children in Layers transform uniformly. 

**Three potential solutions were considered:**

1. **Separate HTML Overlay** ✅ (Chosen)
   - Pros: Cursors never scale, better performance, standard industry approach
   - Cons: Requires coordinate conversion

2. **Separate Konva Layer with Inverse Scaling**
   - Pros: Stays in Konva ecosystem
   - Cons: Complex math, performance issues, still requires coordinate conversion

3. **Inverse Scale Individual Cursors**
   - Cons: Doesn't solve position scaling, very complex, poor performance

#### Solution

**Converted cursor rendering from Konva objects to HTML overlay:**

**Architecture changes:**
1. Cursors store canvas coordinates in Firebase (unchanged)
2. When rendering, convert canvas coords → screen coords using viewport transform
3. Render cursors as absolutely-positioned HTML divs
4. Formula: `screenX = canvasX * scale + stageX`, `screenY = canvasY * scale + stageY`

**Key implementation details:**
- Cursor overlay div sits above Konva Stage with `position: absolute`
- Overlay has `pointer-events: none` (passthrough to canvas)
- Canvas utilities handle coordinate conversion
- Cursors maintain constant visual size at all zoom levels

#### Files Changed

1. `src/components/Cursors/Cursor.tsx` - Rewritten as HTML component
2. `src/components/Cursors/Cursor.css` - New styles for HTML cursors
3. `src/components/Canvas/Canvas.tsx` - Added HTML overlay and coordinate conversion
4. `src/utils/canvas.utils.ts` - New coordinate conversion functions
5. `docs/prd.md` - Updated tech decisions
6. `docs/architecture.mmd` - Updated cursor flow diagram

#### Benefits Achieved

- ✅ Cursors remain consistent size at all zoom levels
- ✅ Better performance (no Konva redraws for cursors)
- ✅ More flexible styling with CSS
- ✅ Matches industry-standard design tools behavior
- ✅ Clean separation of concerns (HTML UI vs Konva canvas content)

#### Prevention

**Rule:** For multiplayer design tools with zoom:
- ✅ UI overlays (cursors, tooltips, selections) should be HTML, not canvas objects
- ✅ Canvas objects are for actual content that should scale
- ✅ Always test zoom behavior early in development
- ✅ Reference professional tools (Figma, Miro) for expected behavior

#### References

- [Figma Multiplayer Cursors](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- [Konva Stage Transforms](https://konvajs.org/docs/sandbox/Stage_Transforms.html)

---

## Version History

- **v1.0** - October 14, 2025 - Initial learnings from PR #2 (Authentication System)
- **v1.1** - October 14, 2025 - Critical performance and permission fixes for PR #4 (Multiplayer Cursors)
- **v1.2** - October 14, 2025 - Architectural decision for PR #5 (HTML overlay for cursors)
- **v1.2** - October 14, 2025 - Ghost user fix: Manual cleanup on logout for PR #4

---

## Contributing to This Document

When you encounter a significant issue or learn something important:

1. **Add a new section** under the appropriate PR or category
2. **Include:** Problem, Root Cause, Solution, Prevention tips
3. **Update the Version History** at the bottom
4. **Keep it concise** but thorough enough for future reference

This document is a living resource - update it as we learn!

---

## PR #5: Canvas Pan/Zoom & Grid System

### Learning #1: Adaptive Grid Performance Optimization

**Date:** October 14, 2025  
**Category:** Performance, Rendering

#### Key Learning

When rendering grid overlays on large canvases (5000x5000px), performance can degrade significantly if all grid lines are rendered at once. The solution is to implement **viewport culling** - only render grid lines that are currently visible on screen.

#### Implementation Pattern

**Inefficient Approach (renders all lines):**
```typescript
// Generates thousands of lines regardless of viewport
for (let x = 0; x < canvasWidth; x += gridSize) {
  lines.push(x);
}
```

**Efficient Approach (viewport culling):**
```typescript
// Calculate visible bounds in canvas coordinates
const visibleLeft = Math.max(0, -viewport.x / viewport.scale);
const visibleRight = Math.min(canvasWidth, (viewportWidth - viewport.x) / viewport.scale);

// Only generate lines within visible bounds
for (let x = startX; x <= visibleRight; x += gridSize) {
  if (x >= 0 && x <= canvasWidth) {
    lines.push(x);
  }
}
```

**Performance Impact:**
- Without culling: Renders 100+ grid lines even when only 20 are visible
- With culling: Renders only the 20-30 visible lines
- Result: 5x performance improvement during pan/zoom operations

#### Best Practices

1. **Calculate visible bounds first** using viewport transformation
2. **Snap to grid** when determining start position: `Math.floor(visibleLeft / gridSize) * gridSize`
3. **Add boundary checks** to avoid rendering outside canvas
4. **Use single Line with multiple points** instead of individual Line components

### Learning #2: Scale-Compensated Stroke Width

**Date:** October 14, 2025  
**Category:** Rendering, Visual Consistency

#### Key Learning

When canvas objects scale with zoom, their stroke widths scale too, causing grid lines to become thick at high zoom and invisible at low zoom. To maintain constant visual line thickness, divide stroke width by the current scale.

#### Formula

```typescript
strokeWidth={DESIRED_VISUAL_WIDTH / viewport.scale}
```

**Examples:**
- At 2x zoom: `1 / 2 = 0.5` canvas units = 1px visual
- At 1x zoom: `1 / 1 = 1` canvas unit = 1px visual  
- At 0.5x zoom: `1 / 0.5 = 2` canvas units = 1px visual

#### Implementation

```typescript
<Line
  points={gridPoints}
  stroke="#cccccc"
  strokeWidth={1.5 / viewport.scale}  // Always looks 1.5px thick
  listening={false}
/>
```

**Also applies to:**
- Shadow blur: `shadowBlur={4 / viewport.scale}`
- Border radius: `cornerRadius={4 / viewport.scale}`
- Any visual property that should remain constant size

### Learning #3: Adaptive Grid Spacing

**Date:** October 14, 2025  
**Category:** UX, Visual Design

#### Key Learning

A fixed grid spacing becomes cluttered at high zoom and too sparse at low zoom. Figma solves this with adaptive grid spacing that adjusts based on zoom level.

#### Pattern

```typescript
function getAdaptiveGridSize(scale: number): { minor: number | null; major: number } {
  if (scale >= 0.5) {
    // High zoom: show both minor (50px) and major (500px) grids
    return { minor: 50, major: 500 };
  } else if (scale >= 0.2) {
    // Medium zoom: show only major grid (500px)
    return { minor: null, major: 500 };
  } else {
    // Low zoom: show sparse major grid (1000px+)
    return { minor: null, major: 1000 };
  }
}
```

#### Design Rationale

- **Minor grid (50px):** Useful for precision work at high zoom
- **Major grid (500px):** Landmarks for navigation at any zoom
- **Progressive disclosure:** Hide minor details as you zoom out
- **Visual hierarchy:** Major lines darker/thicker than minor lines

#### Grid Styling

```typescript
// Minor grid (detail)
stroke: #e0e0e0 (very light gray)
strokeWidth: 1px visual

// Major grid (landmarks)  
stroke: #cccccc (light gray)
strokeWidth: 1.5px visual

// Canvas boundary (emphasis)
stroke: #999999 (medium gray)
strokeWidth: 3px visual
```

### Learning #4: Konva Performance Flags

**Date:** October 14, 2025  
**Category:** Performance, Konva

#### Key Learning

Konva provides performance optimization flags that can significantly improve rendering speed for static elements like grids.

#### Optimization Flags

```typescript
<Line
  points={gridPoints}
  stroke="#cccccc"
  strokeWidth={1.5 / viewport.scale}
  listening={false}           // Don't capture mouse events
  perfectDrawEnabled={false}  // Skip pixel-perfect rendering
/>
```

**Flag Details:**
- `listening={false}`: Element won't respond to mouse/touch events (saves event handling overhead)
- `perfectDrawEnabled={false}`: Skips sub-pixel rendering calculations (faster for static elements)

**When to use:**
- Grid lines (never interactive)
- Background elements
- Static decorative elements
- Canvas boundaries

**When NOT to use:**
- Interactive objects (rectangles, shapes)
- Selection handles
- Draggable elements

---

## PR #6: Rectangle Shape Creation (Bug Fix)

### Issue #1: Coordinate System Bug - Cursors/Objects Clustered in Top-Left

**Date:** October 14, 2025  
**Severity:** Critical (Complete feature malfunction)

#### Problem

After implementing PR #6, all cursors and rectangles appeared clustered in a tiny area in the top-left corner when zoomed out or panned. The working canvas area seemed limited to a small portion despite the grid being visible across the entire 5000x5000 canvas.

**Symptoms:**
- Moving cursor across entire screen only showed movement in top-left corner for other users
- Rectangles could only be created in small top-left area
- Pan/zoom made the problem worse
- Grid displayed correctly but objects didn't match the coordinate space

#### Root Cause

**Critical misunderstanding:** `stage.getPointerPosition()` returns **screen coordinates** (pixels from viewport top-left), NOT canvas coordinates.

The code in both `handleMouseMove()` and `handleBackgroundClick()` was storing screen coordinates directly to Firebase, but when rendering, those coordinates were being treated as canvas coordinates.

**Example of the bug:**
```typescript
// WRONG - stores screen coordinates as if they were canvas coordinates
const pointerPosition = stage.getPointerPosition(); // e.g., { x: 100, y: 150 } (screen)
updateMyCursor(pointerPosition.x, pointerPosition.y); // Stores 100, 150 as canvas position
```

When zoomed out to 0.5x scale and panned to { x: -1000, y: -500 }:
- User clicks at screen position (500, 300)
- Without conversion, stores as canvas position (500, 300) 
- **Actual canvas position should be:** (500 - (-1000)) / 0.5 = 3000, (300 - (-500)) / 0.5 = 1600

This explains why everything clustered in top-left - screen coordinates (0-1920 x 0-1080) were being used as canvas coordinates in a 5000x5000 space!

#### Solution

Always convert screen coordinates to canvas coordinates before storing to Firebase:

```typescript
// CORRECT - convert screen to canvas coordinates
const pointerPosition = stage.getPointerPosition(); // Screen coords
const canvasPos = screenToCanvas(pointerPosition.x, pointerPosition.y, viewport);
updateMyCursor(canvasPos.x, canvasPos.y); // Stores actual canvas position
```

**Files Fixed:**
1. `src/components/Canvas/Canvas.tsx`:
   - `handleMouseMove()` - Added `screenToCanvas()` conversion before `updateMyCursor()`
   - `handleBackgroundClick()` - Added `screenToCanvas()` conversion before `createRectangle()`

#### Key Learning

**Coordinate System Rule for Konva:**
- `stage.getPointerPosition()` → **Screen coordinates** (viewport-relative)
- Objects in Firebase → **Canvas coordinates** (absolute in 5000x5000 space)
- Always use `screenToCanvas()` when capturing user input
- Always use `canvasToScreen()` when rendering HTML overlays (cursors)

**Memory Aid:**
- **Input (clicks, mouse):** Screen → Canvas (use `screenToCanvas()`)
- **Output (HTML overlays):** Canvas → Screen (use `canvasToScreen()`)
- **Konva objects:** Already in canvas space (no conversion needed for rendering)

#### Prevention

- ✅ Always convert coordinates at input boundaries (event handlers)
- ✅ Store canvas coordinates in database (viewport-independent)
- ✅ Test features at multiple zoom levels and pan positions
- ✅ Test with zoomed out view to catch coordinate bugs early

---

