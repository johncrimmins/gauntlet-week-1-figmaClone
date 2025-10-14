# Vercel Deployment Guide for CollabCanvas MVP

This guide will walk you through deploying your CollabCanvas application to Vercel.

---

## Prerequisites

✅ GitHub repository created and code pushed
✅ Firebase project set up with Realtime Database and Authentication enabled
✅ Local `.env.local` file with Firebase credentials

---

## Step 1: Connect GitHub Repository to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign in (or create an account)
   - Sign in with your GitHub account for easier integration

2. **Click "Add New Project"** or "Import Project"

3. **Import your Git repository:**
   - Select your GitHub account
   - Find and select the `Week 1 - Figma Clone` repository (or whatever you named it)
   - Click "Import"

---

## Step 2: Configure Project Settings

Vercel should auto-detect the settings, but verify the following:

### Build & Development Settings:

- **Framework Preset:** `Vite`
- **Root Directory:** `collab-canvas` (IMPORTANT: Set this to the subdirectory)
- **Build Command:** `npm run build` (should be auto-detected)
- **Output Directory:** `dist` (should be auto-detected)
- **Install Command:** `npm install` (should be auto-detected)

---

## Step 3: Add Environment Variables

Before deploying, you MUST add your Firebase environment variables to Vercel:

1. In the Vercel project settings, find the **"Environment Variables"** section

2. Add the following variables one by one:
   
   | Variable Name | Value |
   |--------------|-------|
   | `VITE_FIREBASE_API_KEY` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_AUTH_DOMAIN` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_DATABASE_URL` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_PROJECT_ID` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_STORAGE_BUCKET` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | (Copy from your `.env.local`) |
   | `VITE_FIREBASE_APP_ID` | (Copy from your `.env.local`) |

3. **Important:** Make sure to add these to all environments (Production, Preview, Development)

---

## Step 4: Deploy

1. Click **"Deploy"** button

2. Wait for the build to complete (usually 1-2 minutes)

3. Once deployed, you'll get a production URL like:
   - `https://your-project-name.vercel.app`
   - Or a custom domain if configured

4. **Verify deployment:**
   - Visit the URL
   - You should see "CollabCanvas MVP" header
   - Open browser console - there should be NO errors
   - Check that Firebase initializes correctly

---

## Step 5: Configure Firebase for Production Domain

After deployment, you need to authorize your Vercel domain in Firebase:

1. **Go to [Firebase Console](https://console.firebase.google.com)**

2. **Select your project**

3. **Navigate to Authentication → Settings → Authorized domains**

4. **Click "Add domain"**

5. **Add your Vercel domain:**
   - Copy your production URL from Vercel (e.g., `your-project-name.vercel.app`)
   - Paste ONLY the domain part (without `https://`)
   - Example: `your-project-name.vercel.app`

6. **Click "Add"**

7. **Test the connection:**
   - Visit your deployed URL
   - Open browser console
   - Verify no CORS or Firebase connection errors

---

## Step 6: Verify Deployment is Working

### Basic Checks:
- [ ] Production URL loads without errors
- [ ] Page displays "CollabCanvas MVP" header
- [ ] No console errors in browser DevTools
- [ ] Firebase SDK initializes (check Network tab for Firebase connections)

### If you see errors:
- **CORS errors:** Check Firebase authorized domains
- **Firebase initialization errors:** Check environment variables in Vercel
- **Build errors:** Check build logs in Vercel dashboard

---

## Automatic Deployments

✅ **Production:** Pushing to `main` branch will auto-deploy to production
✅ **Preview:** Pull requests will create preview deployments
✅ **Rollback:** You can rollback to previous deployments in Vercel dashboard

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Verify `Root Directory` is set to `collab-canvas`
- Ensure all dependencies are in `package.json`

### Environment Variables Not Working
- Make sure all variables start with `VITE_` prefix
- Verify they're added to the correct environment (Production)
- Redeploy after adding new environment variables

### Firebase Connection Issues
- Verify all Firebase credentials are correct
- Check Firebase authorized domains includes Vercel URL
- Ensure Firebase Realtime Database rules allow access (test mode for MVP)

### 404 on Routes
- The `vercel.json` file should handle this with rewrites
- Verify the file exists in your repository

---

## Next Steps After Deployment

Once deployment is successful:

1. ✅ Test the deployed URL
2. ✅ Share URL with team or testers
3. ✅ Update tasklist.md to mark deployment tasks complete
4. ✅ Move on to PR #2: Authentication System

---

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard  
**Firebase Console:** https://console.firebase.google.com  
**Local Dev:** `npm run dev` (in collab-canvas directory)  
**Build Locally:** `npm run build` (in collab-canvas directory)

---

**🎉 Once deployed, your CollabCanvas MVP will be live and accessible from anywhere!**

