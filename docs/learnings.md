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

## Version History

- **v1.0** - October 14, 2025 - Initial learnings from PR #2 (Authentication System)
- **v1.1** - October 14, 2025 - Critical performance and permission fixes for PR #4 (Multiplayer Cursors)
- **v1.2** - October 14, 2025 - Ghost user fix: Manual cleanup on logout for PR #4

---

## Contributing to This Document

When you encounter a significant issue or learn something important:

1. **Add a new section** under the appropriate PR or category
2. **Include:** Problem, Root Cause, Solution, Prevention tips
3. **Update the Version History** at the bottom
4. **Keep it concise** but thorough enough for future reference

This document is a living resource - update it as we learn!

