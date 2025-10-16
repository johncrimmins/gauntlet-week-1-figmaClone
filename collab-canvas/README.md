# 🎨 CollabCanvas

> A real-time collaborative canvas application built with React, Konva.js, and Firebase — where multiplayer magic meets pixel-perfect design.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)

## ✨ What is CollabCanvas?

CollabCanvas is a **real-time multiplayer canvas** that lets multiple users design together seamlessly. Think Figma-lite: see your teammates' cursors, create and move objects together, and watch changes sync instantly across all clients.

This MVP is a proof-point  for core real-time sync functionality required in the larger application

### 🎯 Key Features

- **👁️ Real-Time Presence** — See who's online and actively collaborating
- **🖱️ Multiplayer Cursors** — Watch teammates' cursors move in real-time with name labels
- **📦 Collaborative Objects** — Create, move, and sync rectangles across all clients
- **🔒 Smart Locking** — Transaction-based object locking prevents edit conflicts
- **💾 Persistent State** — All changes saved automatically; nothing lost on refresh
- **🗺️ Viewport Persistence** — Your zoom and pan position survives page reloads
- **⚡ Lightning Fast** — Sub-100ms latency for cursor and object updates
- **🎨 Adaptive Grid** — Figma-style grid that scales with zoom level

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase** project with Realtime Database and Authentication enabled
- **Vercel** account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/collab-canvas.git

# Navigate to project directory
cd collab-canvas

# Install dependencies
npm install

# Set up environment variables (see Configuration below)
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` and start collaborating!

---

## ⚙️ Configuration

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firebase Realtime Database** and **Firebase Authentication** (Email/Password)
3. Copy your Firebase credentials and add them to `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Security Rules (Development)

For MVP testing, set your Realtime Database rules to test mode:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning:** Use proper authentication rules in production!

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.1, TypeScript 5.9, Vite 7.1 |
| **Canvas Rendering** | Konva.js 10.0, react-konva 19.0 |
| **Backend** | Firebase Realtime Database, Firebase Auth |
| **Routing** | React Router 7.9 |
| **Deployment** | Vercel |

### Project Structure

```
collab-canvas/
├── src/
│   ├── components/
│   │   ├── Auth/              # Authentication UI (Login, Signup, AuthGuard)
│   │   ├── Canvas/            # Canvas rendering and tooling
│   │   ├── Cursors/           # Multiplayer cursor rendering
│   │   └── Presence/          # Online user list and avatars
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication state management
│   │   ├── useCanvas.ts       # Canvas viewport and interaction
│   │   ├── useCursors.ts      # Real-time cursor synchronization
│   │   ├── useObjects.ts      # Object creation and synchronization
│   │   └── usePresence.ts     # User presence tracking
│   ├── services/              # Firebase integration layer
│   │   ├── auth.service.ts
│   │   ├── cursor.service.ts
│   │   ├── object.service.ts
│   │   └── presence.service.ts
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── docs/                      # Documentation and planning
└── dist/                      # Production build output
```

### Database Schema

```
Firebase Realtime Database Structure:

/presence/{userId}
  ├── displayName: string
  └── color: string

/cursors/{userId}
  ├── x: number
  ├── y: number
  ├── displayName: string
  └── color: string

/objects/{objectId}
  ├── id: string
  ├── type: "rectangle"
  ├── x: number
  ├── y: number
  ├── width: number
  ├── height: number
  ├── color: string
  └── lockedBy: string | null
```

---

## 🎮 How It Works

### Real-Time Multiplayer

CollabCanvas uses Firebase Realtime Database for all real-time synchronization:

1. **Presence System** — Users write their online status on connect and use Firebase's `onDisconnect()` handler for automatic cleanup
2. **Cursor Broadcasting** — Mouse movements are throttled to 100ms and broadcast as canvas coordinates
3. **Object Sync** — All object changes are written to Firebase and propagated to connected clients
4. **Transaction-Based Locking** — Objects use atomic transactions to prevent simultaneous edits

### Key Technical Decisions

#### HTML Overlay for Cursors
Rather than rendering cursors as Konva objects, we use absolutely-positioned HTML divs. This prevents cursors from scaling when users zoom the canvas.

```javascript
// Convert canvas coordinates to screen coordinates
const screenX = canvasX * scale + stageX;
const screenY = canvasY * scale + stageY;
```

#### Transaction-Based Locking
When a user starts dragging an object, we atomically acquire a lock:

```javascript
const lockRef = database.ref(`/objects/${objectId}/lockedBy`);
lockRef.transaction((currentLock) => {
  if (!currentLock) return userId;
  return; // Abort if already locked
});
```

This prevents race conditions where two users try to grab the same object simultaneously.

#### Adaptive Grid System
The canvas features a Figma-style grid that adapts to zoom level, providing visual feedback for scale and canvas boundaries.

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
```

---

## 🚢 Deployment

### Deploying to Vercel

1. **Connect your repository** to Vercel
2. **Set root directory** to `collab-canvas`
3. **Add environment variables** (all `VITE_FIREBASE_*` variables)
4. **Deploy!**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Post-Deployment

After deploying to Vercel, add your production domain to Firebase authorized domains:

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. Test the deployed application

---

## 🎯 Features & Roadmap

### ✅ Implemented (MVP)

- [x] Email/password authentication
- [x] Real-time user presence
- [x] Multiplayer cursors with labels
- [x] Rectangle creation and movement
- [x] Transaction-based object locking
- [x] Viewport pan and zoom
- [x] State persistence across refreshes
- [x] Viewport persistence in localStorage
- [x] Adaptive grid system
- [x] Online user list with avatars

### 🎨 Potential Future Enhancements

- [ ] Multiple shape types (circles, triangles, lines)
- [ ] Text objects with inline editing
- [ ] Color picker and shape styling
- [ ] Undo/redo functionality
- [ ] Multi-select and group operations
- [ ] Keyboard shortcuts
- [ ] Copy/paste
- [ ] Shape rotation and resizing
- [ ] Layers and z-index management
- [ ] Export to PNG/SVG
- [ ] Mobile/tablet support
- [ ] Voice/video chat integration
- [ ] Real-time commenting

---

## 🧪 Testing

### Manual Testing Checklist

Before deploying changes, verify:

**Collaboration:**
- [ ] Open in 2 browsers → see each other's cursors
- [ ] Create rectangles in both → both see all rectangles
- [ ] User A moves rectangle → User B sees it move instantly
- [ ] User A refreshes → still sees all rectangles and same viewport

**Locking:**
- [ ] User A drags object → User B cannot select it
- [ ] User A releases → User B can now select it

**Edge Cases:**
- [ ] Create rectangle → immediately refresh → rectangle persists
- [ ] Viewport position persists across refreshes
- [ ] Works with 5+ concurrent users

---

## 🛠️ Development Guidelines

### Code Style

- **TypeScript strict mode** enabled
- **Functional patterns** preferred over classes
- **Modular architecture** — keep files under 500 lines
- **JSDoc comments** for all public functions
- **Descriptive naming** with auxiliary verbs (isLoading, hasError)

### File Organization

Each file should include:
1. A header comment explaining its purpose
2. Type definitions at the top
3. Pure functions when possible
4. JSDoc documentation for complex functions

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Documentation

- **[PRD.md](../docs/prd.md)** — Product Requirements Document
- **[architecture.mmd](../docs/architecture.mmd)** — System architecture diagram
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Deployment guide
- **[tasklist.md](../docs/tasklist.md)** — Development task tracking
- **[learnings.md](../docs/learnings.md)** — Key learnings and insights

---

## 🐛 Known Limitations

- **Single shape type:** MVP only supports rectangles
- **No styling options:** Objects have fixed colors
- **No undo/redo:** All changes are immediate and permanent
- **Desktop only:** Not optimized for mobile/tablet
- **Test mode security:** Firebase rules are permissive for development

---

## 💡 Technical Highlights

### Performance Optimizations

- **Throttled cursor updates** (100ms) to reduce Firebase writes
- **HTML overlay for cursors** to prevent zoom scaling
- **Transaction-based locking** to prevent race conditions
- **LocalStorage for viewport** to avoid unnecessary database reads
- **Konva stage dragging** for smooth pan interactions

### Real-Time Sync Strategy

CollabCanvas uses Firebase Realtime Database instead of Firestore because:
- Better for high-frequency updates (cursor movements)
- Lower latency for real-time operations
- Simpler atomic transactions
- Built-in `onDisconnect()` handlers

---

## 🤝 Credits

Built as part of **The Gauntlet — Week 1: Figma Clone Challenge**

### Core Technologies

- [React](https://reactjs.org/) — UI framework
- [Konva.js](https://konvajs.org/) — Canvas rendering
- [Firebase](https://firebase.google.com/) — Backend infrastructure
- [Vite](https://vitejs.dev/) — Build tool
- [TypeScript](https://www.typescriptlang.org/) — Type safety

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

Special thanks to:
- The Firebase team for excellent real-time infrastructure
- Konva.js maintainers for a powerful canvas library
- The React team for making complex UIs manageable

---

<div align="center">

**[⬆ Back to Top](#-collabcanvas)**

Made with ❤️ and ☕ by passionate developers

*"Collaboration is the new creativity."*

</div>
