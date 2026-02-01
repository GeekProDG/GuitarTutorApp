# Admin Role Management - Visual Guide

## 🔐 Access Control Flow

```
User Logs In
    ↓
Check User Role in Firestore
    ↓
    ├─→ role: "admin"     ──→ Can access /admin portal ✅
    ├─→ role: "user"      ──→ Can access /profile only 📄
    └─→ role: "student"   ──→ Can access /profile only 📚

Tries to Access /admin
    ↓
    ├─→ Is admin? YES     ──→ Load Admin Portal ✅
    ├─→ Is admin? NO      ──→ Redirect to /profile ❌
```

## 🎯 Admin Portal Header

```
┌─────────────────────────────────────────────┐
│                                             │
│  ADMIN PORTAL        🔴 ADMIN               │
│  Manage applications, students & more       │
│                                             │
└─────────────────────────────────────────────┘

User Status Badge Colors:
🔴 Red   = Administrator (full access)
⚪ Blue  = Regular User (limited access)
```

## 📊 Users & Admins Tab Layout

```
┌─────────────────────────────────────────────────┐
│ Users & Admins              [+ Add User]         │
├─────────────────────────────────────────────────┤
│
│ Name       │ Email        │ Phone   │ Role │ Act│
├────────────┼──────────────┼─────────┼──────┼────┤
│ John Doe   │ john@ex.com  │ +1...   │ 🔴   │ ⚙️ │
│            │              │         │ Admin│    │
├────────────┼──────────────┼─────────┼──────┼────┤
│ Jane Smith │ jane@ex.com  │ +1...   │ ⚪   │ ⚙️ │
│            │              │         │ User │    │
├────────────┼──────────────┼─────────┼──────┼────┤
│ Bob Wilson │ bob@ex.com   │ +1...   │ ⚪   │ ⚙️ │
│            │              │         │ User │    │
└─────────────────────────────────────────────────┘

Action Buttons (from left to right):
⚙️  = Change Role (Settings icon)
✏️  = Edit Details (Pencil icon)
🗑️  = Delete User (Trash icon)
```

## 🔄 How to Change User Roles

### Grant Admin Privileges

```
1. Open Admin Portal
   └─→ Navigate to "Users & Admins" tab

2. Find the user (Blue "⚪ User" badge)
   │
   └─→ John Smith  │ john@example.com │ ⚪ User │ [⚙️]

3. Click the Settings (⚙️) button
   │
   └─→ System updates: role = "admin"

4. Confirmation Toast Appears
   │
   └─→ "John Smith role changed to admin" ✅ (Green)

5. User Badge Changes
   │
   └─→ John Smith  │ john@example.com │ 🔴 Admin │ [⚙️]

6. On Next Login, User Can Access Admin Portal
   │
   └─→ /admin route now available
```

### Demote Admin to User

```
1. Open Admin Portal
   └─→ Navigate to "Users & Admins" tab

2. Find the admin (Red "🔴 Admin" badge)
   │
   └─→ Jane Doe    │ jane@example.com │ 🔴 Admin │ [⚙️]

3. Click the Settings (⚙️) button (now yellow)
   │
   └─→ System updates: role = "user"

4. Confirmation Toast Appears
   │
   └─→ "Jane Doe role changed to user" ✅ (Green)

5. User Badge Changes
   │
   └─→ Jane Doe    │ jane@example.com │ ⚪ User │ [⚙️]

6. User Loses Admin Access Immediately
   │
   └─→ Cannot access /admin anymore
   └─→ Redirected to /profile if accessing /admin
```

## 🔑 Role Comparison Matrix

```
Feature                  │ Admin │ User │ Student
────────────────────────┼───────┼──────┼─────────
Access Admin Portal      │   ✅  │  ❌  │   ❌
Add/Delete Users         │   ✅  │  ❌  │   ❌
Grant Admin Rights       │   ✅  │  ❌  │   ❌
Manage Students          │   ✅  │  ❌  │   ❌
Send Notifications       │   ✅  │  ❌  │   ❌
View Applications        │   ✅  │  ❌  │   ❌
Access Profile           │   ✅  │  ✅  │   ✅
Receive Messages         │   ✅  │  ✅  │   ✅
View Lessons             │   ✅  │  ✅  │   ✅
```

## 🔐 Permission Levels by Route

```
Route        Requires Auth?  Requires Admin?  Accessible By
─────────────────────────────────────────────────────────
/            No              No               Everyone
/blog        No              No               Everyone
/join        No              No               Everyone
/profile     Yes ✅          No               Admin + User
/admin       Yes ✅          Yes ✅           Admin Only

┌─ Route Protection Logic ─┐
│                          │
│ No Auth? → Public ✅     │
│ Has Auth?                │
│  ├─ Requires Admin?      │
│  │  ├─ Is Admin? → OK ✅ │
│  │  └─ Not Admin? → Deny │
│  └─ No Admin Req? → OK ✅
│                          │
└──────────────────────────┘
```

## 📱 UI State Examples

### When You ARE an Admin

**Header displays:**
```
ADMIN PORTAL        🔴 ADMIN
Manage applications, students & more
```

**Users & Admins tab shows:**
- Full list of all users
- Can make other users admins
- Can demote admins to users
- Can edit/delete users

### When You Are NOT an Admin

**Header displays:**
```
ADMIN PORTAL        ⚪ USER
Manage applications, students & more
```

**But you can't see anything:**
- Auto-redirected from /admin to /profile
- Users & Admins tab hidden
- Cannot manage any users

## 🔘 Button States & Meaning

### Settings Icon (⚙️) States

```
Regular User Row:
┌─────────────────────────────────┐
│ John Doe │ john@ex.com │ ⚪ User │
│          │             │       │ [⚙️] Red
│          │             │       │ ← Make Admin
└─────────────────────────────────┘

Admin User Row:
┌─────────────────────────────────┐
│ Jane Doe │ jane@ex.com │ 🔴 Admin│
│          │             │       │ [⚙️] Yellow
│          │             │       │ ← Demote to User
└─────────────────────────────────┘

Color Coding:
🔴 Red button (⚙️)    = Click to make Admin
🟨 Yellow button (⚙️) = Click to demote
```

## 📲 Role Change Timeline

```
Timeline of Making Someone an Admin:

T=0s   User logs in as regular user
       │
       └─→ userRole = "user"
           Can access: /profile
           Cannot access: /admin
       
T=30s  Admin clicks Settings button
       │
       └─→ Firestore: role = "admin"
       
T=31s  Toast notification appears
       │
       └─→ "John Doe role changed to admin" ✅
       
T=32s  User's badge updates in UI
       │
       └─→ ⚪ User → 🔴 Admin
       
T=60s+ User refreshes page or logs out
       │
       └─→ AuthContext reloads role
       └─→ userRole = "admin"
           Can access: /admin, /profile
           Cannot access: (nothing restricted)
```

## ⚠️ Important Notes

```
┌─────────────────────────────────────────┐
│ ⚠️  ADMIN ROLE REQUIREMENTS              │
├─────────────────────────────────────────┤
│                                         │
│ For a user to be an admin:              │
│ • Must have role: "admin" in Firestore  │
│ • Must logout and login to refresh      │
│ • OR refresh page after role change     │
│                                         │
│ Admin privileges:                       │
│ • CANNOT be revoked by non-admins       │
│ • CAN be revoked by other admins        │
│ • System always checks Firestore        │
│                                         │
│ No hardcoded admin emails!              │
│ All roles managed via Firestore DB      │
│                                         │
└─────────────────────────────────────────┘
```

## 🚀 Quick Reference

```
Want to...                          Do this...
──────────────────────────────────────────────
Give someone admin access     Go to Users & Admins
                              Click blue ⚙️ button

Remove admin privileges       Go to Users & Admins
                              Click yellow ⚙️ button

Check if someone is admin     Look for badge:
                              🔴 Admin = Yes
                              ⚪ User = No

Give yourself access          Ask another admin to
to admin portal               grant you admin role

See who are admins            Users & Admins tab shows
                              all users with roles

Add a new admin               Create user, then promote
                              with ⚙️ button
```

---

**Version**: 1.0
**Last Updated**: February 1, 2026
