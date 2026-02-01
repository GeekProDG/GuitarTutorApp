# Student Guitar Tutor - Walkthrough

## Overview
The **Student Guitar Tutor** allows students to learn guitar and you (the Tutor) to manage them.
This application features a **Premium Landing Page**, **Google Authentication** (with Admin vs Student roles), and a powerful **Admin Portal**.

## Key Features
*   **Authentication**: Google Login. Users are "Student" by default.
*   **Admin Access**: Only emails in the "Whitelist" get Admin access.
    *   *Current Whitelist*: `['shyam@example.com', 'admin@guitartutor.com', 'tutor@test.com']`.
    *   *Note*: Update `src/contexts/AuthContext.jsx` to add your real email.
*   **Admin Portal**:
    *   **Registrations**: Approve new sign-ups.
    *   **My Students**: Edit details, set notification prefs (Email/WhatsApp).
    *   **Class Tracking**: Update class count. If it hits a multiple of 4, a **Payment Reminder** is triggered.
*   **Notifications**: Simulated via on-screen Toasts (since we don't have a backend email server).

## How to Run the App (Localhost)

### 1. Daily Startup
To start the development server, run the following command in your terminal:
```bash
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; npm run dev
```
*   **Why the long command?** This bypasses Windows security restrictions for the current terminal session, allowing `npm` to run scripts correctly.
*   **Access the App**: Once running, Ctrl+Click the link: **[http://localhost:5173](http://localhost:5173)**.

### 2. Manual Verification
*   **Firebase Keys**: The app keys are stored in `src/firebase.js`. These are public client keys used to connect to your Firebase project.
*   **Firestore Rules**: Basic security rules are defined in `firestore.rules`.
*   **Functions**: Currently, the app uses **Direct Client Integration** (Firebase SDK). No specific Cloud Functions are required for the current functional flow.

## Troubleshooting Guide

### 1. `npm : The term 'npm' is not recognized`
*   **Cause**: Node.js is not in your System PATH or you haven't restarted your IDE after installation.
*   **Fix**: 
    1.  Close and reopen VS Code.
    2.  Run `node -v` to confirm installation.
    3.  If still missing, reinstall Node.js from [nodejs.org](https://nodejs.org).

### 2. `Execution_Policies` or `UnauthorizedAccess` Error
*   **Cause**: Windows blocks PowerShell scripts by default.
*   **Fix**: Use the bypass command provided in the "Daily Startup" section above.

### 3. Firebase "auth/configuration-not-found"
*   **Cause**: Authentication is not enabled in your Firebase Console.
*   **Fix**:
    1.  Go to [Firebase Console](https://console.firebase.google.com/).
    2.  Select your project: **student-guitar-tutor-app**.
    3.  On the left menu, click **Authentication**.
    4.  Click the **Get Started** button.
    5.  Go to the **Sign-in method** tab.
    6.  Click **Add new provider** and select **Google**.
    7.  Toggle **Enable**, set a **Project support email**, and click **Save**.

### 4. Firestore "Permission Denied" Errors
*   **Cause**: You are trying to access Admin features while logged in as a Student, or your Firestore rules are too strict.
*   **Fix**:
    1.  Ensure your email is in the **ADMIN_EMAILS** list in `src/contexts/AuthContext.jsx`.
    2.  Log out and Log in again after changing the whitelist.

### 5. White Screen / No Content
*   **Cause**: A missing dependency or JavaScript error.
*   **Fix**: 
    1.  Open Browser console (F12).
    2.  Check for "Module not found" errors.
    3.  Run `npm install` to ensure all packages are present.

### 6. Page Links / Buttons not clickable
*   **Cause**: Often due to a "Loading..." overlay or a CSS issue.
*   **Fix**:
    1.  Check the browser console (F12) for errors.
    2.  If you see a permanent "Loading..." text, it means the app is waiting for Firebase to respond. Enabling Auth (Step 3 above) usually fixes this.

## Admin Workflow
1.  **Login**: Click "Login" on the Navbar. Use a Google account in the whitelist.
2.  **Dashboard**: You will be redirected to `/admin` (or click "Admin" in the dropdown).
3.  **Approve**: Go to "Registrations" tab -> Click "Approve" on new users.
4.  **Manage**:
    *   Go to "Students" tab.
    *   Click **Edit (Pencil)** to set "WhatsApp/Email" preferences or Phone number.
    *   Click **+/-** on Class Count.
    *   **Payment Trigger**: Increase count to 4, 8, etc. Observe the "Payment Reminder Sent" notification.

## Deployment
*   **Production Build**: `npm run build`
*   **Host**: Use Firebase Hosting (`firebase deploy`) or Vercel.
