# Admin Role Management System

## Overview
The Student Guitar App now has a complete admin role management system that allows existing admins to:
- Grant admin privileges to other users
- Demote admins back to regular users
- View admin status in real-time
- Protect the admin portal to only visible/accessible by admins

## Key Features

### 1. **Admin-Only Access to Admin Portal**
- The admin portal (`/admin`) is now protected and only accessible to users with `role: 'admin'`
- Non-admin users trying to access the admin page are automatically redirected to their profile page
- Current user's admin status is displayed in the header with a color-coded badge

### 2. **Role Assignment for Existing Users**
You can now change any user's role directly from the Users & Admins tab:

#### Make a User an Admin:
1. Go to **Users & Admins** tab in Admin Portal
2. Find the user with role "⚪ User"
3. Click the **Settings Icon** (gear) button in their row
4. User is now promoted to **🔴 Admin**

#### Demote an Admin to User:
1. Go to **Users & Admins** tab
2. Find the admin with role "🔴 Admin"
3. Click the **Settings Icon** (gear) button in their row
4. Admin is now demoted to **⚪ User**

### 3. **User Status Display**
- **🔴 Admin Badge**: Red with "Admin" text - User has full admin privileges
- **⚪ User Badge**: Blue with "User" text - User is a regular user
- Header shows current logged-in user's status

### 4. **Role-Based Database Structure**
```javascript
{
  id: "user_email",
  email: "user@example.com",
  displayName: "John Doe",
  phone: "+1234567890",
  role: "admin" or "user",  // Determines access level
  status: "active",
  createdAt: timestamp
}
```

## User Roles Explained

### Admin Role (`role: 'admin'`)
**Permissions:**
- ✅ Access Admin Portal
- ✅ Manage applications (approve/reject)
- ✅ Add, edit, delete students
- ✅ Add, edit, delete users
- ✅ Grant/revoke admin privileges
- ✅ Send notifications to students
- ✅ View all system data

**Cannot Do:**
- ❌ Become a student (cannot have both admin and student roles)

### User Role (`role: 'user'`)
**Permissions:**
- ✅ Access own profile page
- ✅ View lessons (when scheduled)
- ✅ Receive notifications

**Cannot Do:**
- ❌ Access Admin Portal
- ❌ Manage other users
- ❌ Manage students
- ❌ Send notifications

### Student Role (`role: 'student'`)
**Permissions:**
- ✅ Access own profile (when implemented)
- ✅ View lesson schedule
- ✅ Receive notifications

**Cannot Do:**
- ❌ Access Admin Portal
- ❌ Manage users
- ❌ Manage other students

## Authorization Flow

```
User Logs In
    ↓
AuthContext.syncUserProfile()
    ↓
Load user role from Firestore
    ↓
Set userRole in context
    ↓
Check route requireAdmin prop
    ├→ If requireAdmin=true and role !== 'admin' → Redirect to /profile
    ├→ If requireAdmin=true and role === 'admin' → Allow access to /admin
    └→ If no requireAdmin → Allow access
```

## How Admin Status Works

### During Login:
1. User signs in with email and password (or Google)
2. AuthContext checks Firestore for user document
3. Loads the `role` field from the user record
4. Sets `userRole` state in the context
5. Component checks `userRole` to determine access

### When Changing Roles:
1. Admin clicks Settings icon on a user
2. Admin portal calls `changeUserRole(userId, newRole)`
3. Updates the user's Firestore `role` field
4. If it's the current user's role that changed, AuthContext updates immediately
5. Toast notification confirms the change

## Protected Routes

### Admin Portal (`/admin`)
```jsx
<Route path="/admin" element={
  <PrivateRoute requireAdmin={true}>
    <Admin />
  </PrivateRoute>
} />
```
- Requires authentication: ✅
- Requires admin role: ✅
- Redirects to: `/profile` if not admin

### Profile Page (`/profile`)
```jsx
<Route path="/profile" element={
  <PrivateRoute>
    <Profile />
  </PrivateRoute>
} />
```
- Requires authentication: ✅
- Requires admin role: ❌
- Accessible by: Admin users and regular users

### Public Pages
- `/` (Home)
- `/blog` (Blog)
- `/join` (Expression of Interest)

No authentication required.

## Database Security Rules

For Firestore, ensure your security rules include:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only admins can read/write others
    match /users/{document=**} {
      allow read, write: if request.auth.token.admin == true;
      allow read: if request.auth.uid == document;
    }

    // Admin-only collections
    match /config/{document=**} {
      allow read: if request.auth.token.admin == true;
    }

    match /notifications/{document=**} {
      allow create: if request.auth != null;
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

## API Reference

### `useAuth()` Hook
```javascript
const { userRole, currentUser, updateUserRole } = useAuth();

// userRole values: 'admin', 'user', 'student', or null
// currentUser: Firebase user object
// updateUserRole(userId, newRole): Promise to change user role
```

### Admin Component Functions

#### changeUserRole(userId, newRole, userName)
```javascript
// Make a user an admin
await changeUserRole('user_id', 'admin', 'John Doe');
// Toast: "John Doe role changed to admin"

// Demote an admin
await changeUserRole('user_id', 'user', 'John Doe');
// Toast: "John Doe role changed to user"
```

## Common Tasks

### Grant Admin Access to a New User
1. Admin creates a new user via "Add User" button
2. Sets role to "User" initially
3. Later, go to Users & Admins tab
4. Click Settings icon next to the user
5. User is now promoted to Admin
6. They can access /admin on next login

### Remove Admin Privileges
1. Go to Users & Admins tab in Admin Portal
2. Find admin user
3. Click Settings icon (shows as yellow)
4. User is demoted to regular User
5. They lose access to Admin Portal immediately

### Setup First Admin
1. Create a user through the app
2. Use Firestore console to manually set role to "admin"
3. Or add the user via "Add User" and set role to Admin
4. User can now access Admin Portal

## Best Practices

✅ **DO:**
- Keep at least 2 admins for system administration
- Regularly audit who has admin access
- Log admin role changes in a separate collection
- Verify user identity before granting admin access
- Use strong passwords for admin accounts

❌ **DON'T:**
- Grant admin access to untrusted users
- Leave unused admin accounts active
- Share admin credentials
- Allow students to have admin roles
- Delete all admins

## Troubleshooting

### Admin portal not accessible
**Symptoms**: Redirected to profile page when trying to access /admin
**Solution**: 
- Check that your user's role is set to "admin" in Firestore
- Logout and login again to refresh auth context
- Check browser console for error messages

### Can't change user roles
**Symptoms**: Settings button not working or error message
**Solution**:
- Verify you are logged in as an admin
- Check Firestore security rules allow admin writes
- Check browser console for error details
- Ensure the user document exists in Firestore

### Role changes not taking effect
**Symptoms**: User still has old permissions after role change
**Solution**:
- User needs to logout and login again
- Or refresh the page
- Check Firestore to confirm role was actually updated

## Future Enhancements

- [ ] Role-based permission matrix
- [ ] Audit log for all admin actions
- [ ] Two-factor authentication for admins
- [ ] Role expiration dates
- [ ] Admin activity dashboard
- [ ] Role request workflow
- [ ] Team-based role management

## Version History

**v1.0** (February 1, 2026)
- Initial admin role system
- Role-based routing
- Admin portal access control
- User role management
- Real-time role updates

---

**Last Updated**: February 1, 2026
