# Admin Portal - Enhanced Features Documentation

## Overview
The Admin Portal has been significantly enhanced with comprehensive user and student management capabilities, including email and WhatsApp notification systems.

## New Features

### 1. **User & Admin Management**
A new "Users & Admins" tab has been added to the admin portal that allows you to:

- **Add New Users/Admins**: Create new system users with different roles
  - **User Role**: Standard users with basic access
  - **Admin Role**: Administrative users with full system access
  
- **Edit User Details**: Modify user information including:
  - Full Name
  - Phone Number
  - User Role (User/Admin)

- **Delete Users**: Remove users from the system with confirmation dialog

### 2. **Enhanced Student Management**
The Students tab now includes comprehensive management tools:

- **Add New Students**: Quickly add students to the system with:
  - Full Name (required)
  - Email Address (required)
  - Phone Number (for WhatsApp)
  - Class Number Assignment
  - Notification Preferences (Email & WhatsApp)

- **Edit Student Details**: Update any student's information including:
  - Full Name
  - Phone Number
  - **Class Number** (NEW) - Assign specific class numbers
  - Class Count - Track number of completed classes
  - Next Class Time - Schedule upcoming lessons
  - Comments/Notes - Store additional information

- **Delete Students**: Remove students with confirmation
- **Visible Student Metrics**:
  - Class Number (purple badge)
  - Class Count (amber when divisible by 4)
  - Next Scheduled Class Time

### 3. **Advanced Notification System**
Send targeted notifications to students via multiple channels:

#### Features:
- **Dual Channel Support**:
  - 📧 **Email Notifications** - Uses email addresses on file
  - 💬 **WhatsApp Messages** - Uses phone numbers on file

- **Selective Channel Delivery**: Choose which channels to use for each notification
  
- **Message Templates**: Pre-built templates available in `notificationService.js`:
  - Class Reminders
  - Payment Reminders
  - Class Cancellations
  - Bulk Announcements

#### How to Use:
1. Click the **Bell Icon** on any student row
2. Enter your message (plain text supported)
3. Select notification channels (Email, WhatsApp, or both)
4. Click **Send**

### 4. **Database Structure**
New fields added to student documents:

```javascript
{
  id: "student_email",
  displayName: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  role: "student",
  status: "active",
  classNumber: 101,        // NEW - Class assignment
  classCount: 5,           // Total classes completed
  nextClassTime: 1234567,  // Unix timestamp
  comments: "Notes here",
  notificationPrefs: {
    email: true,
    whatsapp: true
  },
  createdAt: 1234567,
  approvedAt: 1234567
}
```

New `notifications` collection for tracking:

```javascript
{
  studentId: "student_email",
  studentName: "John Doe",
  studentEmail: "john@example.com",
  studentPhone: "+1234567890",
  message: "Your class reminder...",
  channels: { email: true, whatsapp: true },
  status: "sent",
  sentAt: timestamp
}
```

## Integration with Email & WhatsApp

### Email Integration
To enable real email notifications:
1. Set up Firebase Cloud Functions
2. Integrate SendGrid or Gmail API
3. Update `sendEmailNotification()` in `notificationService.js`

### WhatsApp Integration
To enable WhatsApp messages:
1. Set up Twilio WhatsApp Business Account
2. Create Firebase Cloud Function
3. Update `sendWhatsAppNotification()` in `notificationService.js`

### Example Cloud Function (Firebase):
```javascript
// functions/sendEmail.js
exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { email, subject, message } = data;
  // Use SendGrid SDK to send email
  await sgMail.send({
    to: email,
    from: 'noreply@guitartutorapp.com',
    subject,
    text: message
  });
  return { success: true };
});

// functions/sendWhatsApp.js
exports.sendWhatsApp = functions.https.onCall(async (data, context) => {
  const { phone, message } = data;
  // Use Twilio to send WhatsApp message
  await twilioClient.messages.create({
    from: 'whatsapp:+1234567890',
    to: `whatsapp:${phone}`,
    body: message
  });
  return { success: true };
});
```

## UI Components

### Tabs Available
1. **Applications** - Manage application approvals
2. **Students** - Student roster with management tools
3. **Users & Admins** - System user management

### Action Buttons
- **Edit** (Pencil Icon) - Modify details
- **Send Notification** (Bell Icon) - Send email/WhatsApp
- **Delete** (Trash Icon) - Remove from system

### Status Indicators
- **Class Number Badge** - Purple, shows assigned class
- **Class Count Badge** - Amber when class count is divisible by 4
- **Role Badge** - Red for Admin, Blue for User

## Permissions & Security

Currently, the admin portal is accessible to:
- Email: `shyamtanubec@gmail.com` (hardcoded admin)

To modify admin access, update `AuthContext.jsx`:
```javascript
const ADMIN_EMAILS = ['admin@example.com', 'another@example.com'];
```

## Notification Center

All sent notifications are logged in the `notifications` collection for:
- Audit trail
- Delivery confirmation
- Analytics
- Resend capability

## Usage Examples

### Adding a Student
1. Go to **Students** tab
2. Click **Add Student** button
3. Fill in required fields (Name, Email)
4. Set Class Number (e.g., 101)
5. Enable/disable notification preferences
6. Click **Add Student**

### Sending a Class Reminder
1. Find student in roster
2. Click **Bell Icon**
3. Enter message: "Your class is scheduled for tomorrow at 3 PM"
4. Select **Email** and **WhatsApp**
5. Click **Send**

### Managing Class Numbers
1. Click **Edit** (pencil icon) on student
2. Update **Class Number** field
3. Save changes

### Adding an Admin User
1. Go to **Users & Admins** tab
2. Click **Add User**
3. Fill in details
4. Set Role to **Admin**
5. Click **Add User**

## Toast Notifications
The system provides real-time feedback:
- ✅ **Green** - Success messages
- ❌ **Red** - Error messages
- ℹ️ **Blue** - Information messages

## Future Enhancements
- Bulk notification sending
- Notification scheduling
- Template management
- Student groups/batches
- Class attendance tracking
- Payment integration
- SMS notifications (in addition to WhatsApp)
- Notification history/logs viewer

## Support
For issues or questions, contact the development team.
