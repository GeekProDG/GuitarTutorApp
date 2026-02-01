# Admin Portal - Quick Reference Guide

## 🎯 Admin Dashboard Access
**URL**: `http://localhost:5176/admin`
**Required**: Admin email (default: shyamtanubec@gmail.com)

---

## 📋 Three Main Tabs

### 1️⃣ Applications Tab
**Purpose**: Review and approve new student applications

**Actions**:
- 👁️ View applicant details (name, email, phone, timezone, statement)
- ✅ **Approve** - Converts application to active student

**Status**: 
- Shows count of pending applications
- Badge shows "Pending" status

---

### 2️⃣ Students Tab (NEW & ENHANCED)
**Purpose**: Manage all students and their classes

**Quick Actions**:
| Button | Action | Shortcut |
|--------|--------|----------|
| 🟢 Add Student | Create new student | Quick enrollment |
| ✏️ Edit | Modify student details | Update info |
| 🔔 Send | Send email/WhatsApp | Instant notification |
| 🗑️ Delete | Remove student | Confirmation required |

**Student Information Displayed**:
- 👤 Name & Timezone
- 📧 Email & Phone
- 🎓 Class Number (purple badge) ← **NEW**
- 📊 Classes Completed (yellow if divisible by 4)
- 📅 Next Class Schedule

---

### 3️⃣ Users & Admins Tab (NEW)
**Purpose**: Manage system users and administrators

**Quick Actions**:
| Button | Action | Shortcut |
|--------|--------|----------|
| 🟢 Add User | Create new user | Admin or User role |
| ✏️ Edit | Modify user details | Change role/info |
| 🗑️ Delete | Remove user | Confirmation required |

**User Information Displayed**:
- 👤 Full Name
- 📧 Email Address
- 📱 Phone Number
- 🔑 Role (Admin = Red, User = Blue)

---

## 🆕 NEW FEATURES

### Class Number Assignment ⭐
**What**: Assign specific class/batch numbers to students
**Where**: Edit Student → Class Number field
**Example**: Class 101, 102, 201, etc.
**Display**: Purple badge in student roster

### Email & WhatsApp Notifications ⭐
**How to Send**:
1. Click 🔔 Bell icon on student row
2. Type your message
3. Select channels:
   - ☑️ Email (📧)
   - ☑️ WhatsApp (💬)
4. Click Send

**Logged**: All notifications saved to Firestore for audit trail

---

## 🎨 UI Elements Explained

### Status Badges
```
🟪 Purple     = Class Number
🟨 Amber      = Classes (divisible by 4)
🔵 Blue       = User role badge
🔴 Red        = Admin role badge
```

### Toast Messages
```
✅ Green = Success
❌ Red   = Error
ℹ️ Blue   = Information
```

### Modal Dialogs
- **Add Student**: Quick student enrollment
- **Add User**: Create system user/admin
- **Edit Student**: Modify student profile
- **Edit User**: Modify user details
- **Send Notification**: Compose and send message

---

## ⌨️ Keyboard Tips
- **Tab**: Navigate form fields
- **Enter**: Submit form
- **Esc**: Close modal (if supported)

---

## 📊 Common Tasks

### ➕ Add a Student
```
Students Tab → Add Student button → 
Fill form → Add Student
```
Fields: Name, Email, Phone, Class #, Notifications

### ✏️ Update Student
```
Student row → Edit button → 
Modify fields → Save Changes
```
Editable: Name, Phone, Class #, Class Count, Next Class, Notes

### 🔔 Send Notification
```
Student row → Bell icon → 
Type message → Select channels → Send
```
Channels: Email and/or WhatsApp

### 👤 Add Admin User
```
Users & Admins tab → Add User → 
Set role to "Admin" → Add User
```

### 🗑️ Delete Student/User
```
Click trash icon → Confirm deletion → Done
```
⚠️ Cannot be undone!

---

## 📱 Notification Examples

### Class Reminder
```
Hi John,

This is a reminder for your guitar class tomorrow at 3:00 PM.

Class Number: 101

Please be on time and have your guitar ready.

See you soon!
```

### Payment Reminder
```
Hi John,

This is a friendly reminder about your pending payment of $50 
for your guitar lessons.

Please settle this at your earliest convenience.

Thank you!
```

### Class Cancellation
```
Hi John,

Unfortunately, your guitar class scheduled for tomorrow at 3 PM 
has been cancelled due to unexpected circumstances.

We will reschedule your class soon. Please check your email for updates.

Apologies for the inconvenience!
```

---

## 🔐 Permissions

**Admin Access**: 
- Create/Edit/Delete users and students
- Send notifications
- View all applications
- Manage all records

**Student Access** (if applicable):
- View own profile
- Receive notifications only

---

## 🆘 Troubleshooting

### Issue: Can't access Admin Portal
**Solution**: 
- Verify login email is `shyamtanubec@gmail.com`
- Clear browser cache and reload
- Check Firebase auth configuration

### Issue: Notifications not sending
**Solution**:
- Check browser console for errors
- Verify student has valid email/phone
- Ensure at least one channel is selected
- Check Firebase Cloud Functions are deployed

### Issue: Student not appearing in list
**Solution**:
- Page may be loading (check spinner)
- Refresh page
- Check Firestore database directly
- Verify student record exists in `users` collection

### Issue: Can't delete student
**Solution**:
- Check confirmation dialog
- Verify user has admin privileges
- Check Firestore security rules

---

## 📈 Data Organization

### Firestore Collections
```
Firebase Database
├── applications/        (New signups)
├── users/              (All users & students)
│   ├── role: "student"
│   ├── role: "user"
│   └── role: "admin"
├── notifications/      (All sent messages)
└── config/            (API keys - admin only)
    ├── sendgrid
    └── twilio
```

---

## 🔄 Workflow Example

### Full Student Journey
1. **Application**: Student fills interest form
2. **Review**: Admin approves application in "Applications" tab
3. **Assignment**: Student appears in "Students" tab with default values
4. **Configuration**: Admin assigns class number and other details
5. **Communication**: Admin sends notifications via email/WhatsApp
6. **Tracking**: Monitor classes and schedule next sessions

---

## 💡 Pro Tips

✅ **Tip 1**: Keep class numbers organized (e.g., 100s for beginner, 200s for intermediate)

✅ **Tip 2**: Use consistent notation in notifications for professional appearance

✅ **Tip 3**: Test email/WhatsApp notifications with your own number first

✅ **Tip 4**: Check notification logs in Firestore for delivery confirmation

✅ **Tip 5**: Backup student data regularly if using critical information

---

## 📞 Quick Support

**For Setup Issues**: See `NOTIFICATION_SETUP.md`

**For Features**: See `ADMIN_FEATURES.md`

**For Integration**: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎓 Learning Resources

- Firebase Firestore: https://firebase.google.com/docs/firestore
- SendGrid Email: https://sendgrid.com/docs/
- Twilio WhatsApp: https://www.twilio.com/docs/whatsapp
- React Hooks: https://react.dev/reference/react

---

**Last Updated**: February 1, 2026
**Version**: 1.0
