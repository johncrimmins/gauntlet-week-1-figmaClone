# CollabCanvas MVP - Product Requirements Document

**Version:** 1.1  
**Timeline:** 24 hours to MVP checkpoint  
**Last Updated:** October 13, 2025

---

## Executive Summary

CollabCanvas MVP is a real-time collaborative canvas application. The primary goal is to prove that our multiplayer infrastructure works reliably before adding any advanced features. Success is defined by: **2+ users editing simultaneously with visible cursors, functional object sync, and zero state loss on refresh.**

**Core Philosophy:** A simple canvas with working multiplayer beats a feature-rich canvas with broken sync.

---

## User Stories

### Primary User: Designer/Collaborator

**As a designer collaborating with teammates, I want to:**

1. **See who's online** so I know who I'm working with
   - Acceptance: Clear list/indicator showing all active users by name
   
2. **See my teammates' cursors in real-time** so I understand what they're looking at
   - Acceptance: Cursor position updates within 100ms, with visible name labels
   
3. **Create basic shapes on a canvas** so I can start designing
   - Acceptance: Can add rectangles with a single click/action
   
4. **Move objects and see changes instantly** so collaboration feels natural
   - Acceptance: Object position updates across all clients within 100ms
   
5. **Pan and zoom the canvas** so I can navigate a large workspace
   - Acceptance: Smooth interaction, canvas feels responsive
   
6. **Have my work persist** so I don't lose progress if I refresh or disconnect
   - Acceptance: All objects remain after page refresh; viewport position persists

### Secondary User: Returning Collaborator

**As a user returning to a project, I want to:**

1. **Log in and see my previous work** so I can continue where I left off
   - Acceptance: Authentication system remembers me; canvas loads previous state
   
2. **Rejoin the session seamlessly** so I don't disrupt my team
   - Acceptance: Reconnection happens automatically; no manual sync required

---

## Tech Stack (FINALIZED)

```
Frontend: React + Konva.js + TypeScript + Vite
Backend: Firebase Realtime Database + Firebase Auth
Hosting: Vercel (frontend) + Firebase (backend)
```

**Key Technical Decisions:**
- **Firebase Realtime Database** (not Firestore) for all real-time data - better for high-frequency updates
- **Konva objects** for cursor rendering (not HTML overlay) - simpler transform handling
- **Transaction-based locking** for object control - prevents race conditions
- **localStorage** for viewport persistence - survives refreshes

---

## Key Features for MVP

### 1. Authentication System (PRIORITY: HIGH)
**Why first:** Users need identities before we can show "who's online" or label cursors.

- **Basic user accounts** with email/password
- **Login/signup flow** (no password recovery for MVP)
- **Persistent sessions** (users stay logged in)
- **User identification** for presence and cursor labeling

**Definition of Done:**
- Users can create accounts and log in
- Each user has a unique identifier and display name
- System remembers logged-in users across page refreshes

---

### 2. Real-Time Infrastructure (PRIORITY: CRITICAL)
**Why first:** This is the hardest part and the core value proposition.

#### 2a. Presence Awareness
- **Online user list** showing all active collaborators
- **Real-time updates** when users connect/disconnect
- **Firebase onDisconnect()** for automatic cleanup

**Definition of Done:**
- See all online users within 1 second of joining
- User list updates when someone joins/leaves
- No ghost users (Firebase onDisconnect handles cleanup)

#### 2b. Multiplayer Cursors
- **Real-time cursor positions** rendered as Konva objects
- **Name labels** on each cursor
- **Distinct colors** per user
- **100ms throttling** to balance smoothness with database limits

**Definition of Done:**
- Cursor positions update in real-time
- Each user sees all other users' cursors
- Cursors transform correctly with pan/zoom

#### 2c. Object Synchronization
- **Broadcast object creation** to all clients
- **Broadcast object movements** with minimal latency
- **Transaction-based locking:** Atomic lock acquisition prevents conflicts
- **State reconciliation** on connect/reconnect

**Definition of Done:**
- Object changes appear on all clients in real-time
- When User A is dragging an object, User B cannot select or move it
- Lock acquisition uses Firebase transactions (no race conditions)
- State recovers correctly after disconnect/reconnect

---

### 3. Canvas Core (PRIORITY: HIGH)

#### 3a. Canvas Interaction
- **Pan** using Konva's built-in draggable
- **Zoom** with mouse wheel toward cursor position
- **Workspace:** 5,000 x 5,000px canvas
- **Viewport persistence** in localStorage

**Definition of Done:**
- Pan/zoom works smoothly
- Viewport position/scale persists across refreshes
- Canvas can hold a dozen objects comfortably

#### 3b. Rectangle System (MVP Scope: One Shape Only)
- **Shape type: Rectangle only**
- **Basic styling** (solid color)
- **Create** action (toggle creation mode, click to add)
- **Select** action (click on object)
- **Move** action (drag selected object)

**Definition of Done:**
- Can create, select, and move rectangles
- Simple creation mode toggle (binary state: creating vs selecting)
- Selection state is clear (border)
- All actions work while other users are editing

---

### 4. State Persistence (PRIORITY: HIGH)

- **Firebase Realtime Database** for all canvas state
- **Save on changes** (automatic with Firebase)
- **Load state on connect** (new users see existing objects)
- **Viewport in localStorage** (position and zoom level persist)

**Definition of Done:**
- All users leave → all users return → canvas identical
- User refreshes mid-edit → objects unchanged
- New user joins → sees all existing objects immediately
- Viewport position/zoom persists across refreshes

---

### 5. Deployment (PRIORITY: HIGH)

- **Publicly accessible URL** via Vercel
- **Firebase auth domain configuration** (expect 1-2 hours for CORS setup)
- **Handles 5+ concurrent users**

**Definition of Done:**
- Deployed to production environment
- URL is shareable and accessible
- Works across different networks
- Performs well under load testing

---

## Implementation Notes

### Firebase Realtime Database Structure
```
/presence/{userId}
  - displayName
  - color
  - lastSeen

/cursors/{userId}
  - x
  - y
  - displayName
  - color
  - timestamp

/objects/{objectId}
  - id
  - type: "rectangle"
  - x
  - y
  - width
  - height
  - color
  - lockedBy (userId or null)
  - createdBy
  - createdAt
  - updatedAt
```

### Critical Implementation Details

1. **Use Firebase Transactions for Locks:**
```javascript
const lockRef = database.ref(`/objects/${objectId}/lockedBy`);
lockRef.transaction((currentLock) => {
  if (!currentLock) return userId;
  return; // Abort if already locked
});
```

2. **Cursor Rendering in Konva:**
- Render cursors as Konva shapes in the same stage
- Automatic transform handling with pan/zoom
- No separate HTML layer needed

3. **Simple Rectangle Creation State:**
```javascript
const [isCreating, setIsCreating] = useState(false);
// Toggle between "create" and "select" modes
```

4. **Viewport Persistence:**
```javascript
// Save on change
localStorage.setItem('viewport', JSON.stringify({x, y, scale}));
// Load on mount
const saved = JSON.parse(localStorage.getItem('viewport') || '{}');
```

---

## NOT Included in MVP

These are explicitly out of scope:

### Features NOT Included:
- ❌ Multiple shape types (rectangles only)
- ❌ Shape styling options (one color)
- ❌ Multi-select or drag-to-select
- ❌ Undo/redo
- ❌ Copy/paste
- ❌ Rotation or resize
- ❌ Keyboard shortcuts
- ❌ Mobile support
- ❌ Password recovery
- ❌ Error boundaries (post-MVP)
- ❌ Performance monitoring
- ❌ Heartbeat presence mechanism

### Accepted Simplifications:
- Test mode Firebase security rules (no auth rules for MVP)
- Basic error handling only
- No UI polish required
- Simple creation mode toggle (not a full tool palette)

---

## Critical Success Factors

### What Passing MVP Looks Like:
1. ✅ Two people can open the app and see each other's cursors
2. ✅ One person creates a rectangle, the other sees it instantly
3. ✅ One person moves a rectangle, the other sees it move
4. ✅ Both people can see who's online
5. ✅ Both people refresh → everything is still there
6. ✅ Viewport position persists on refresh
7. ✅ App is deployed and publicly accessible
8. ✅ When one user is dragging, others cannot select that object
9. ✅ Smooth enough performance during normal use

### What Failing MVP Looks Like:
- ❌ Cursors don't sync or lag badly
- ❌ Objects disappear or duplicate
- ❌ Canvas breaks with 2+ users
- ❌ State is lost on refresh
- ❌ App isn't deployed
- ❌ Multiple users can drag same object

---

## Implementation Strategy

### Hour-by-Hour Breakdown (24-Hour Sprint)

**Setup & Authentication**
- Set up Vite + React + TypeScript + Konva
- Configure Firebase Realtime Database + Auth
- Implement basic auth (login/signup)
- Deploy "Hello World" to Vercel
- **Checkpoint:** Can log in and see empty canvas

**Real-Time Infrastructure**
- Implement presence with onDisconnect cleanup
- Implement Konva cursor objects with 100ms throttling
- Display multiplayer cursors with labels
- **Checkpoint:** Two browsers show each other's cursors

**Canvas Basics**
- Implement pan/zoom with Konva
- Add rectangle creation (with creation mode toggle)
- Implement selection and movement
- Add viewport persistence to localStorage
- **Checkpoint:** Can create and move rectangles locally

**Object Synchronization**
- Set up Firebase Realtime Database for objects
- Implement transaction-based locking
- Broadcast object creation and updates
- Test concurrent editing
- **Checkpoint:** Objects sync across clients with proper locking

**Testing & Bug Fixes**
- Test with 3-4 users simultaneously
- Test disconnect/reconnect scenarios
- Fix sync issues
- **Checkpoint:** All user stories pass

**Deployment & Documentation**
- Configure Firebase auth domains for Vercel
- Deploy to production
- Test deployed version
- Write README
- **Checkpoint:** Submitted on time

---

## Testing Checklist

Before submitting MVP, verify:

### Collaboration Tests:
- [ ] Open in 2 browsers → see each other's cursors
- [ ] Create rectangles in both → both see all rectangles
- [ ] User A moves rectangle → User B sees it move
- [ ] User A refreshes → still sees all rectangles and same viewport
- [ ] All users leave → return → canvas unchanged

### Locking Tests:
- [ ] User A drags object → User B cannot select it
- [ ] User A releases → User B can now select
- [ ] Transaction prevents simultaneous lock acquisition

### Edge Cases:
- [ ] Create rectangle → immediately refresh → rectangle persists
- [ ] Viewport position persists across refreshes
- [ ] Slow network → still functional

---

## Success Metrics

### MVP Must Achieve:
- **Functional Sync:** Real-time updates work reliably
- **Object Locking:** Transaction-based, no conflicts
- **State Persistence:** Zero data loss
- **Viewport Persistence:** Position/zoom survive refresh
- **Capacity:** 5+ concurrent users
- **Deployed:** Publicly accessible on Vercel

### Explicitly NOT Required:
- Beautiful UI
- Error recovery
- Performance monitoring
- Multiple shapes
- Advanced features

---

**Remember:** Ship a working multiplayer canvas. Everything else is secondary.