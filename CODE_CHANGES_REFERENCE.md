# Admin Role Management - Code Changes Reference

## Overview of Changes

This document shows exactly what was changed to implement admin role management and protect the admin portal.

---

## File 1: src/contexts/AuthContext.jsx

### Change 1: Removed Hardcoded Admin Email Check

**BEFORE:**
```javascript
async function syncUserProfile(user, isNew = false) {
    // ... code ...
    const ADMIN_EMAILS = ['shyamtanubec@gmail.com'];
    const isAdmin = ADMIN_EMAILS.includes(user.email);

    alert(`SYNC DEBUG: Email=${user.email}, IsAdmin=${isAdmin}, Role will be=${isAdmin ? 'admin' : 'user'}`);

    if (!userSnap.exists() || isNew) {
        const role = isAdmin ? 'admin' : 'user';
        // ...
    }
}
```

**AFTER:**
```javascript
async function syncUserProfile(user, isNew = false) {
    // ... code ...
    
    if (!userSnap.exists() || isNew) {
        // New user - set default role to 'user'
        const role = 'user';
        // ...
    } else {
        // Existing user - load role from Firestore
        const userData = userSnap.data();
        const currentRole = userData.role || 'user';
        setUserRole(currentRole);
    }
}
```

**Why**: Removes hardcoded admin emails. All roles are now managed through Firestore.

---

### Change 2: Added updateUserRole Function

**ADDED:**
```javascript
async function updateUserRole(userId, newRole) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
        
        // Update local role if it's the current user
        if (currentUser?.uid === userId) {
            setUserRole(newRole);
        }
        
        return { success: true, message: `User role updated to ${newRole}` };
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}
```

**Why**: Allows updating user roles in the database and updating local state if it's the current user.

---

### Change 3: Exported updateUserRole

**BEFORE:**
```javascript
const value = {
    currentUser,
    userRole,
    loading,
    trace,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    resetPassword,
    logout
};
```

**AFTER:**
```javascript
const value = {
    currentUser,
    userRole,
    loading,
    trace,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    resetPassword,
    logout,
    updateUserRole  // ← NEW
};
```

**Why**: Allows components to call the updateUserRole function.

---

## File 2: src/pages/Admin.jsx

### Change 1: Import useAuth Hook

**BEFORE:**
```javascript
import { useState, useEffect } from 'react';
import { db } from '../firebase';
```

**AFTER:**
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
```

**Why**: Access the userRole to display admin status and protect admin features.

---

### Change 2: Get userRole from Hook

**BEFORE:**
```javascript
export default function Admin() {
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    // ...
}
```

**AFTER:**
```javascript
export default function Admin() {
    const { userRole } = useAuth();
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    // ...
}
```

**Why**: Access current user's role to display in header.

---

### Change 3: Add changeUserRole Function

**ADDED:**
```javascript
async function changeUserRole(userId, newRole, userName) {
    try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
        showToast(`${userName} role changed to ${newRole}`, 'success');
        fetchData();
    } catch (error) {
        console.error('Error changing user role:', error);
        showToast('Error changing user role', 'error');
    }
}
```

**Why**: Directly change a user's role in Firestore and update UI.

---

### Change 4: Update Header with Admin Status

**BEFORE:**
```javascript
<div className="flex justify-between items-center mb-12">
    <div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">ADMIN PORTAL</h1>
        <p className="text-gray-400">Manage applications, students, and notifications</p>
    </div>
</div>
```

**AFTER:**
```javascript
<div className="flex justify-between items-center mb-12">
    <div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">ADMIN PORTAL</h1>
        <div className="flex items-center gap-3">
            <p className="text-gray-400">Manage applications, students, and notifications</p>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                userRole === 'admin' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}>
                {userRole === 'admin' ? '🔴 ADMIN' : '⚪ ' + (userRole || 'USER')}
            </span>
        </div>
    </div>
</div>
```

**Why**: Display current user's admin status with color coding.

---

### Change 5: Pass onChangeRole to UsersTab

**BEFORE:**
```javascript
{activeTab === 'users' && (
    <UsersTab
        users={users.filter(u => u.role !== 'student')}
        onEdit={(user) => { ... }}
        onAdd={() => setShowAddUserModal(true)}
        onDelete={deleteUser}
    />
)}
```

**AFTER:**
```javascript
{activeTab === 'users' && (
    <UsersTab
        users={users.filter(u => u.role !== 'student')}
        onEdit={(user) => { ... }}
        onAdd={() => setShowAddUserModal(true)}
        onDelete={deleteUser}
        onChangeRole={changeUserRole}  // ← NEW
    />
)}
```

**Why**: Pass the role change function to the UsersTab component.

---

### Change 6: Update UsersTab Component

**BEFORE:**
```javascript
function UsersTab({ users, onEdit, onAdd, onDelete }) {
    return (
        // ...
        <span className={`inline-block px-3 py-1 rounded-full font-black text-xs uppercase ${
            user.role === 'admin' 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-blue-500/20 text-blue-300'
        }`}>
            {user.role}
        </span>
        // ...
        <div className="flex justify-end gap-2">
            <button onClick={() => onEdit(user)} ...>
                <Edit size={16} />
            </button>
            <button onClick={() => onDelete(user.id, user.displayName)} ...>
                <Trash2 size={16} />
            </button>
        </div>
    );
}
```

**AFTER:**
```javascript
function UsersTab({ users, onEdit, onAdd, onDelete, onChangeRole }) {  // ← Added onChangeRole
    return (
        // ...
        <span className={`inline-block px-3 py-1 rounded-full font-black text-xs uppercase ${
            user.role === 'admin' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
            {user.role === 'admin' ? '🔴 Admin' : '⚪ User'}  // ← Updated display
        </span>
        // ...
        <div className="flex justify-end gap-2">
            {user.role !== 'admin' && (
                <button
                    onClick={() => onChangeRole(user.id, 'admin', user.displayName)}
                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                    title="Make Admin"
                >
                    <Settings size={16} />
                </button>
            )}
            {user.role === 'admin' && (
                <button
                    onClick={() => onChangeRole(user.id, 'user', user.displayName)}
                    className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
                    title="Demote to User"
                >
                    <Settings size={16} />
                </button>
            )}
            <button onClick={() => onEdit(user)} ...>
                <Edit size={16} />
            </button>
            <button onClick={() => onDelete(user.id, user.displayName)} ...>
                <Trash2 size={16} />
            </button>
        </div>
    );
}
```

**Why**: 
- Add onChangeRole parameter
- Show Settings button to change role
- Different buttons for admins vs users
- Better visual representation of roles

---

## File 3: src/App.jsx

### No Changes Required!

The App.jsx already had the protection in place:

```javascript
function PrivateRoute({ children, requireAdmin }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;
  if (requireAdmin && userRole !== 'admin') return <Navigate to="/profile" />;

  return children;
}

// Usage:
<Route path="/admin" element={
  <PrivateRoute requireAdmin={true}>
    <Admin />
  </PrivateRoute>
} />
```

**How it works:**
- Checks if user is authenticated
- Checks if user role is 'admin' (if requireAdmin=true)
- Redirects to /profile if not admin
- Shows Admin component if both checks pass

---

## Summary of Changes

### AuthContext.jsx
| Change | Type | Impact |
|--------|------|--------|
| Remove hardcoded admin emails | Delete | High |
| Load role from Firestore | Modify | High |
| Add updateUserRole function | Add | Medium |
| Export updateUserRole | Add | Medium |

### Admin.jsx
| Change | Type | Impact |
|--------|------|--------|
| Import useAuth | Add | High |
| Get userRole from hook | Add | High |
| Add changeUserRole function | Add | High |
| Update header display | Modify | Medium |
| Pass onChangeRole to UsersTab | Modify | High |
| Update UsersTab component | Modify | High |

### App.jsx
| Change | Type | Impact |
|--------|------|--------|
| None - already protected | - | - |

---

## Key Differences: Before vs After

### Before
```
Login with email
    ↓
Check if email in ADMIN_EMAILS list
    ↓
Hardcode role based on email
    ↓
Cannot change role through UI
```

### After
```
Login with email
    ↓
Load user record from Firestore
    ↓
Get role field from Firestore
    ↓
Display in UI
    ↓
Can change role with Settings button
```

---

## Database Schema Changes

### User Document - Before & After

```javascript
// BEFORE (hardcoded system)
{
  id: "user_id",
  email: "john@example.com",
  displayName: "John Doe",
  role: "admin"  // Only if email matched hardcoded list
}

// AFTER (flexible system)
{
  id: "user_id",
  email: "john@example.com",
  displayName: "John Doe",
  role: "admin"  // Can be changed at any time via UI
}
```

No database schema changes - just how the role is determined!

---

## Testing the Changes

### Test 1: Access Admin Portal as Admin
```javascript
// User with role: 'admin'
→ Go to /admin
→ Should see: Admin Portal loads ✅
→ Header shows: 🔴 ADMIN
```

### Test 2: Denied Access as Regular User
```javascript
// User with role: 'user'
→ Go to /admin
→ Should see: Redirected to /profile ✅
→ URL changes to: /profile
```

### Test 3: Change User Role
```javascript
// As admin user
→ Go to Users & Admins tab
→ Click Settings (⚙️) on a user
→ Role changes to admin ✅
→ Badge updates to 🔴 Admin
→ Toast shows confirmation
```

### Test 4: Demote Admin
```javascript
// As admin user
→ Go to Users & Admins tab
→ Click Settings (⚙️) on an admin
→ Role changes to user ✅
→ Badge updates to ⚪ User
→ Toast shows confirmation
```

---

## Integration Points

### Where Role is Used

1. **AuthContext.jsx** - Stores and manages role
2. **App.jsx** - Checks role for route protection
3. **Admin.jsx** - Displays role and allows changes
4. **Navbar.jsx** - Could show admin badge (optional)
5. **Profile.jsx** - Could show role (optional)

### Where Role is Stored

- **Firestore**: `users/{userId}/role` field
- **Memory**: `userRole` state in AuthContext
- **Updated**: Whenever user logs in or role changes

---

**File**: ADMIN_IMPLEMENTATION.md
**Version**: 1.0
**Date**: February 1, 2026
