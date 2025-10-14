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

## Version History

- **v1.0** - October 14, 2025 - Initial learnings from PR #2 (Authentication System)

---

## Contributing to This Document

When you encounter a significant issue or learn something important:

1. **Add a new section** under the appropriate PR or category
2. **Include:** Problem, Root Cause, Solution, Prevention tips
3. **Update the Version History** at the bottom
4. **Keep it concise** but thorough enough for future reference

This document is a living resource - update it as we learn!

