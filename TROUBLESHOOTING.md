# Admin Role Management - Troubleshooting Guide

## Common Issues & Solutions

---

## Issue 1: Can't Access Admin Portal

### Symptoms
- Trying to navigate to `/admin`
- Getting redirected to `/profile`
- No error messages

### Root Causes
1. User role is not set to "admin" in Firestore
2. User needs to logout and login again
3. Browser cache issues

### Solutions

**Solution A: Check User Role in Firestore**
1. Open Firebase Console → Firestore Database
2. Go to `users` collection
3. Find your user document (ID matches your email or UID)
4. Check the `role` field
5. If not "admin", click Edit and change it to "admin"
6. Logout and login again

**Solution B: Clear Cache & Refresh**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+Shift+R)
3. Logout
4. Login again

**Solution C: Check AuthContext**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Type: `console.log(sessionStorage)` 
4. Look for any error messages
5. Check that user has `role: 'admin'` in their profile

---

## Issue 2: Settings Button Not Showing

### Symptoms
- Users & Admins tab loads
- No Settings (⚙️) button in action column
- Can't change user roles

### Root Causes
1. Not logged in as admin
2. UsersTab component not receiving onChangeRole prop
3. Conditional rendering hiding the button

### Solutions

**Solution A: Verify You're Admin**
1. Check header badge: should show 🔴 ADMIN
2. If shows ⚪ USER, you don't have admin access
3. Ask another admin to promote you

**Solution B: Check Component Props**
1. Open browser Developer Tools (F12)
2. Go to Components or React DevTools tab
3. Find UsersTab component
4. Check if `onChangeRole` prop exists
5. If missing, check Admin.jsx line where UsersTab is called

---

## Issue 3: Role Change Not Working

### Symptoms
- Click Settings button
- Nothing happens
- No toast notification
- User role doesn't change

### Root Causes
1. User doesn't have admin privileges
2. Firestore permission denied
3. Network/connectivity issue

### Solutions

**Solution A: Check Admin Status**
1. Verify you see 🔴 ADMIN in header
2. If not, ask another admin to promote you first

**Solution B: Check Firestore Permissions**
1. Open Firebase Console → Firestore Database
2. Go to Rules tab
3. Ensure rules allow admin users to write to users collection
4. Should include: `allow write: if request.auth.token.admin == true;`

**Solution C: Check Network**
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Perform role change action
4. Look for failed requests
5. Check error messages in Console tab

**Solution D: Check Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share error message with developer

---

## Issue 4: User Role Updated But Not Visible

### Symptoms
- Role change worked (toast appeared)
- But user badge still shows old role
- Or new user can't access admin portal

### Root Causes
1. UI needs to refresh data
2. User needs to logout and login
3. Firestore data not synced yet

### Solutions

**Solution A: Refresh Data**
1. Reload the page (F5)
2. User list should update
3. If still not showing, check Firestore directly

**Solution B: User Must Logout/Login**
1. If the user themselves was promoted
2. They need to logout and login again
3. This refreshes their auth context

**Solution C: Wait a Moment**
1. Firestore can take a second to update
2. Wait 2-3 seconds and refresh page
3. Should then show updated role

---

## Issue 5: Error Messages in Console

### Error: "Permission denied"
```
Firebase.firestore error: Permission denied on document read/write
```

**Solution:**
- Check Firestore security rules
- Ensure admin users have write permissions
- Make sure user's role is actually "admin"

### Error: "Cannot read property 'role'"
```
TypeError: Cannot read property 'role' of undefined
```

**Solution:**
- User document missing from Firestore
- Create user document with default fields
- Ensure user has `role` field (value: "admin", "user", or "student")

### Error: "updateDoc is not a function"
```
TypeError: updateDoc is not a function
```

**Solution:**
- Firestore import issue
- Check `src/pages/Admin.jsx` imports
- Should include: `import { updateDoc } from 'firebase/firestore'`

---

## Issue 6: User Can't Be Made Admin

### Symptoms
- Settings button visible
- Click button
- Nothing happens or error appears

### Root Causes
1. Invalid user ID
2. User document not properly structured
3. Firestore rules blocking write

### Solutions

**Solution A: Verify User Document Structure**
```javascript
// User document should have these fields:
{
  id: "user_email",
  email: "user@example.com",
  displayName: "User Name",
  role: "user",  // ← This field MUST exist
  status: "active",
  createdAt: 1234567890
}
```

**Solution B: Check Firestore Directly**
1. Open Firebase Console → Firestore
2. Find `users` collection
3. Open the user's document
4. Make sure `role` field exists
5. If missing, click Edit and add it with value "user"

**Solution C: Try Manual Update**
1. In Firebase Console, go to user's document
2. Click Edit
3. Change role to "admin" manually
4. Test if user can access admin portal
5. If works, the problem is with the UI function

---

## Issue 7: Header Shows Wrong Role

### Symptoms
- Header shows ⚪ USER but should be 🔴 ADMIN
- Or header blank/undefined

### Root Causes
1. useAuth() hook not loading role
2. Firestore document missing role field
3. Auth context not synced

### Solutions

**Solution A: Logout and Login**
1. Click logout button in navbar
2. Login again
3. AuthContext should reload role from Firestore

**Solution B: Check User Document**
1. Open Firestore Console
2. Find your user document
3. Verify role field exists
4. Verify role value is "admin"

**Solution C: Hard Refresh**
1. Close all tabs with the app
2. Hard refresh: Ctrl+Shift+R
3. Clear cache if needed
4. Logout and login again

---

## Issue 8: Multiple Admins Seeing Different Data

### Symptoms
- Different admins see different users in list
- Data seems inconsistent
- User deletions not showing for all

### Root Causes
1. Local state not refreshing
2. Component cache issues
3. Firestore data consistency delay

### Solutions

**Solution A: Refresh Data**
1. Click refresh (or navigate away and back)
2. Data should sync from Firestore
3. All admins should see same data

**Solution B: Clear Local State**
1. Logout
2. Login again
3. Fresh data loaded from Firestore

---

## Debugging Checklist

Use this to diagnose issues:

```
□ User has 'admin' role in Firestore users collection
□ User can access /admin without redirect
□ Header shows 🔴 ADMIN badge
□ Users & Admins tab loads with user list
□ Settings (⚙️) button visible on users
□ Can click Settings button without error
□ Toast notification appears after click
□ User role updates in Firestore
□ User list refreshes with new role
□ New role persists after page refresh
□ Other admins see the role change
```

If any item is unchecked, check that section in troubleshooting.

---

## Common Commands for Testing

### Check Your User Role in Console
```javascript
// In browser console (F12)
// This won't work directly, but can check AuthContext

// Or check Firestore directly via Firebase Console
```

### Force Refresh Admin Data
```javascript
// In Admin component, can manually trigger fetchData()
// Look for the green "refresh" functionality
```

### Check Firestore Rules
```
Firebase Console → Firestore Database → Rules tab
Ensure this exists:
    match /users/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
```

---

## When to Ask for Help

Share this information:
1. Screenshots of the issue
2. Browser console error messages
3. Your user role as shown in header
4. Steps to reproduce the problem
5. What you expected to happen
6. What actually happened

Include files affected:
- [CODE_CHANGES_REFERENCE.md](CODE_CHANGES_REFERENCE.md)
- [ADMIN_IMPLEMENTATION.md](ADMIN_IMPLEMENTATION.md)
- Admin.jsx
- AuthContext.jsx

---

## Quick Reference Fixes

| Problem | Quick Fix |
|---------|-----------|
| Can't access admin | Logout/Login |
| Role not changing | Refresh page |
| Settings button missing | Make sure you're admin |
| Header shows wrong role | Hard refresh (Ctrl+Shift+R) |
| User can't see change | Have them logout/login |
| Multiple admins confused | Everyone refresh |
| Error in console | Check Firestore rules |

---

## Testing Protocol

### Before Reporting a Bug:

1. **Clear Cache**
   - Ctrl+Shift+Delete in Chrome
   - Clear cookies and cache
   - Reload page

2. **Hard Refresh**
   - Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clears JS/CSS cache

3. **Logout & Login**
   - Click logout
   - Fully close browser (all tabs)
   - Open app fresh and login

4. **Check Firestore**
   - Firebase Console → Firestore
   - Verify user role exists
   - Verify role value is correct

5. **Check Console**
   - F12 → Console tab
   - Look for red error messages
   - Screenshot and share if found

---

## Support Contact

If none of these solutions work:

1. Check [ADMIN_IMPLEMENTATION.md](ADMIN_IMPLEMENTATION.md)
2. Review [CODE_CHANGES_REFERENCE.md](CODE_CHANGES_REFERENCE.md)
3. Check Admin.jsx for recent changes
4. Open issue with:
   - Detailed steps to reproduce
   - Console error messages
   - Screenshots
   - User role information

---

**Version**: 1.0
**Last Updated**: February 1, 2026
**Purpose**: Quick troubleshooting for admin role management system
