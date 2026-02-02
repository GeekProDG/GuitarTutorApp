# WhatsApp Notifications Setup Guide

## Current Status: Development Mode ✅

Your app is currently in **development mode** where WhatsApp notifications are logged to the browser console. To send **real** WhatsApp messages, follow this guide.

---

## 🔍 How to Check if Notifications are Being Processed

### **Step 1: Open Browser Console**
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for messages starting with:
   - 🔔 `NOTIFICATION SERVICE`
   - 💬 `WHATSAPP NOTIFICATION SENT`

### **Step 2: Send a Test Notification**
1. Go to **Admin Portal** → **Students** tab
2. Click the **Bell icon** (🔔) next to a student
3. Enter a test message
4. **Check Email checkbox** AND **WhatsApp checkbox**
5. Click **Send**

### **Step 3: Check Console Output**
You should see:
```
🔔 NOTIFICATION SERVICE - Processing notification for student: {
    studentName: "John Doe",
    studentEmail: "john@example.com",
    studentPhone: "+1234567890",
    channels: { email: true, whatsapp: true },
    timestamp: "2026-02-02T10:30:45.000Z"
}

→ Sending Email to john@example.com...
✅ Email sent successfully

→ Sending WhatsApp to +1234567890...
✅ WhatsApp sent successfully

✅ All notifications processed
```

---

## ⚠️ Why Real WhatsApp Isn't Working Yet

WhatsApp messages require a **paid service** to send. The app supports integration with:

1. **Twilio** (Recommended) - WhatsApp API
2. **WhatsApp Business API** - Direct integration

Both require:
- API credentials
- Verified phone number
- Twilio account setup
- Firebase Cloud Functions

---

## 🚀 Option 1: Setup Twilio WhatsApp (Recommended)

### **Step 1: Create Twilio Account**
1. Go to [Twilio.com](https://www.twilio.com/console)
2. Sign up for a free account
3. Get your **Account SID** and **Auth Token**
4. Get a Twilio phone number

### **Step 2: Enable WhatsApp Sandbox**
1. In Twilio Console → Messaging → WhatsApp → Sandbox
2. Join the sandbox by texting `join [join-code]` to the Twilio number
3. Verify your phone number

### **Step 3: Create Firebase Cloud Function**

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Cloud Function to send WhatsApp
exports.sendWhatsApp = functions.https.onCall(async (data, context) => {
    try {
        const { phone, message } = data;

        console.log('Sending WhatsApp to:', phone);

        const result = await twilioClient.messages.create({
            from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
            to: 'whatsapp:' + phone,
            body: message
        });

        console.log('WhatsApp sent:', result.sid);

        return {
            success: true,
            messageSid: result.sid,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
```

### **Step 4: Deploy Function**

```bash
cd functions
npm install twilio
firebase deploy --only functions
```

### **Step 5: Update notificationService.js**

Uncomment the production code:

```javascript
export async function sendWhatsAppNotification(phone, message) {
    try {
        console.log('💬 WHATSAPP NOTIFICATION SENT:', {
            recipient: phone,
            message: message,
            timestamp: new Date().toISOString()
        });

        // UNCOMMENT THIS FOR PRODUCTION:
        const response = await firebase.functions().httpsCallable('sendWhatsApp')({
            phone: phone,
            message: message
        });
        return response.data;

        // For development, return success response
        // return {
        //     success: true,
        //     channel: 'whatsapp',
        //     recipient: phone,
        //     timestamp: new Date().toISOString(),
        //     status: 'queued'
        // };
    } catch (error) {
        console.error('❌ Error sending WhatsApp:', error);
        throw error;
    }
}
```

---

## 🚀 Option 2: Setup SendGrid Email (If Not Already Done)

### **Step 1: Create SendGrid Account**
1. Go to [SendGrid.com](https://sendgrid.com/)
2. Sign up for a free account
3. Create an API key from Settings → API Keys

### **Step 2: Create Cloud Function for Email**

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = functions.https.onCall(async (data, context) => {
    try {
        const { email, subject, message } = data;

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>${subject}</h2>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <p>Best regards,<br>Guitar Lessons Team</p>
                </div>
            `
        };

        await sgMail.send(msg);

        return {
            success: true,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
```

---

## 📋 Checklist: Development vs Production

### **Development Mode (Current)** ✅
- [x] Notifications logged to console
- [x] Toast messages on success/error
- [x] Firestore records created
- [x] Ready for Cloud Functions integration

### **Production Mode (To Implement)**
- [ ] Twilio account created
- [ ] Twilio WhatsApp configured
- [ ] SendGrid account created
- [ ] Cloud Functions deployed
- [ ] Environment variables set
- [ ] notificationService.js updated

---

## 🧪 Testing in Development Mode

You can fully test the UI without real notifications:

1. **Verify notifications are logged:**
   - Open Console (F12)
   - Send a notification
   - Check for 🔔 NOTIFICATION SERVICE logs

2. **Verify Firestore records:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Navigate to Firestore Database
   - Check `notifications` collection
   - Each sent notification creates a document

3. **Verify Student Preferences:**
   - Edit a student
   - Toggle Email/WhatsApp checkboxes
   - Check that preferences save
   - Verify in Firestore: `users/{studentId}.notificationPrefs`

---

## 📞 Support: Phone Number Format

When adding WhatsApp phone numbers:
- Use international format: `+1234567890`
- Include country code (e.g., +1 for USA)
- No spaces or dashes in the actual field
- Example: `+919876543210` (India)

---

## 🔐 Environment Variables Setup

Once you deploy Cloud Functions, add these to your `.env`:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket

# For Cloud Functions (in Firebase)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890

SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🆘 Troubleshooting

### **"WhatsApp notifications not working"**
- ✅ Check Console (F12) for logs
- ✅ Verify phone number has `+` and country code
- ✅ Ensure student has phone number set
- ✅ Check WhatsApp checkbox in Edit Student

### **"No console logs appearing"**
- ✅ Check that you imported `sendNotificationToStudent`
- ✅ Verify the Bell icon click is calling `sendNotification`
- ✅ Check for JavaScript errors in Console tab

### **"Email not being sent"**
- ✅ Verify email address is in student record
- ✅ Check Email checkbox in notification modal
- ✅ Verify SendGrid API key is correct (once deployed)

---

## 📚 References

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [SendGrid Email API Docs](https://docs.sendgrid.com/for-developers/sending-email/api-overview)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)

---

**Current Implementation:** ✅ Console logging (Development Ready)
**Next Step:** Deploy Cloud Functions for real notifications
