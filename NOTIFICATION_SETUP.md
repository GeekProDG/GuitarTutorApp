/**
 * SETUP INSTRUCTIONS FOR EMAIL & WHATSAPP INTEGRATION
 * 
 * This file contains step-by-step instructions to integrate real email and WhatsApp
 * notifications into the Student Guitar App.
 */

// ============================================================================
// PART 1: SETUP FIREBASE CLOUD FUNCTIONS
// ============================================================================

/*
Run these commands in your Firebase project directory:

```bash
npm install -g firebase-tools
firebase init functions
cd functions
npm install @sendgrid/mail twilio
```
*/

// ============================================================================
// PART 2: SENDGRID EMAIL SETUP (for email notifications)
// ============================================================================

/*
1. Sign up for SendGrid: https://sendgrid.com/
2. Create an API key from Settings > API Keys
3. Create a Firestore document at: config/sendgrid
   {
     "apiKey": "your-sendgrid-api-key",
     "fromEmail": "noreply@yourdomain.com"
   }
4. Use the Cloud Function below
*/

// ============================================================================
// CLOUD FUNCTION: sendEmail (functions/index.js)
// ============================================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Configure SendGrid
exports.sendEmail = functions.https.onCall(async (data, context) => {
    try {
        const { email, subject, message, studentName } = data;

        // Validate input
        if (!email || !subject || !message) {
            throw new Error('Missing required fields: email, subject, message');
        }

        // Get SendGrid config from Firestore
        const configDoc = await admin.firestore().collection('config').doc('sendgrid').get();
        if (!configDoc.exists) {
            throw new Error('SendGrid configuration not found');
        }

        const config = configDoc.data();
        sgMail.setApiKey(config.apiKey);

        // Compose email
        const emailContent = {
            to: email,
            from: config.fromEmail,
            subject: subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                        <h2 style="color: #2c3e50;">Guitar Lesson Notification</h2>
                        <p>Hi ${studentName || 'Student'},</p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <p style="margin-top: 30px; color: #7f8c8d; font-size: 12px;">
                            This is an automated message from Student Guitar App.
                        </p>
                    </div>
                </div>
            `
        };

        // Send email
        await sgMail.send(emailContent);

        // Log in Firestore
        await admin.firestore().collection('notifications').add({
            type: 'email',
            recipient: email,
            subject: subject,
            message: message,
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            studentName: studentName
        });

        return { success: true, message: 'Email sent successfully' };

    } catch (error) {
        console.error('Error sending email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ============================================================================
// PART 3: TWILIO WHATSAPP SETUP (for WhatsApp notifications)
// ============================================================================

/*
1. Sign up for Twilio: https://www.twilio.com/
2. Enable WhatsApp Business Account integration
3. Get your WhatsApp Number and Auth Token
4. Create a Firestore document at: config/twilio
   {
     "accountSid": "your-account-sid",
     "authToken": "your-auth-token",
     "fromWhatsApp": "+1234567890"
   }
5. Use the Cloud Function below
*/

// ============================================================================
// CLOUD FUNCTION: sendWhatsApp (functions/index.js)
// ============================================================================

const twilio = require('twilio');

exports.sendWhatsApp = functions.https.onCall(async (data, context) => {
    try {
        const { phone, message, studentName } = data;

        // Validate input
        if (!phone || !message) {
            throw new Error('Missing required fields: phone, message');
        }

        // Get Twilio config from Firestore
        const configDoc = await admin.firestore().collection('config').doc('twilio').get();
        if (!configDoc.exists) {
            throw new Error('Twilio configuration not found');
        }

        const config = configDoc.data();
        const client = twilio(config.accountSid, config.authToken);

        // Send WhatsApp message
        const result = await client.messages.create({
            from: `whatsapp:${config.fromWhatsApp}`,
            to: `whatsapp:${phone}`,
            body: message
        });

        // Log in Firestore
        await admin.firestore().collection('notifications').add({
            type: 'whatsapp',
            recipient: phone,
            message: message,
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            studentName: studentName,
            twilioMessageSid: result.sid
        });

        return { success: true, message: 'WhatsApp message sent successfully', sid: result.sid };

    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ============================================================================
// PART 4: UPDATE NOTIFICATION SERVICE (src/services/notificationService.js)
// ============================================================================

/*
Replace the notificationService.js file with this updated version that calls 
the Cloud Functions:
*/

import { firebase, db } from '../firebase';

export async function sendEmailNotification(email, subject, message, studentName) {
    try {
        const sendEmail = firebase.functions().httpsCallable('sendEmail');
        const result = await sendEmail({
            email,
            subject,
            message,
            studentName
        });
        return result.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendWhatsAppNotification(phone, message, studentName) {
    try {
        const sendWhatsApp = firebase.functions().httpsCallable('sendWhatsApp');
        const result = await sendWhatsApp({
            phone,
            message,
            studentName
        });
        return result.data;
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw error;
    }
}

// ============================================================================
// PART 5: DEPLOYMENT
// ============================================================================

/*
Deploy Cloud Functions:

1. In the functions directory, run:
   ```bash
   firebase deploy --only functions
   ```

2. Set environment variables if needed:
   ```bash
   firebase functions:config:set sendgrid.apikey="your-key"
   firebase deploy --only functions
   ```

3. Access in web app:
   ```javascript
   import { firebase } from '../firebase';
   const sendEmail = firebase.functions().httpsCallable('sendEmail');
   ```
*/

// ============================================================================
// PART 6: FIRESTORE SECURITY RULES
// ============================================================================

/*
Update your firestore.rules to allow Cloud Functions to write notifications:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow Cloud Functions to log notifications
    match /notifications/{document=**} {
      allow create: if request.auth != null || request.auth.token.iss.contains('firebase');
      allow read, write: if request.auth.token.admin == true;
    }

    // Config accessible only to admin
    match /config/{document=**} {
      allow read: if request.auth.token.admin == true;
    }

    // Users collection
    match /users/{document=**} {
      allow read, write: if request.auth.token.admin == true;
      allow read: if request.auth.uid == document;
    }

    // Applications collection
    match /applications/{document=**} {
      allow read, write: if request.auth.token.admin == true;
      allow create: if request.auth == null; // Public submissions
    }
  }
}
*/

// ============================================================================
// PART 7: TESTING LOCALLY
// ============================================================================

/*
To test Cloud Functions locally:

1. Start the emulator:
   ```bash
   firebase emulators:start
   ```

2. The functions will be available at:
   http://localhost:5001/your-project-id/region/functionName

3. Test with curl:
   ```bash
   curl -X POST http://localhost:5001/your-project-id/us-central1/sendEmail \
     -H "Content-Type: application/json" \
     -d '{"data": {"email": "test@example.com", "subject": "Test", "message": "Hello"}}'
   ```
*/

// ============================================================================
// PART 8: MONITORING & LOGGING
// ============================================================================

/*
Monitor your Cloud Functions:

1. Go to Firebase Console > Functions
2. Check logs and performance metrics
3. Set up alerts for errors

View logs:
   firebase functions:log
*/

// ============================================================================
// PART 9: EXAMPLE NOTIFICATION TEMPLATES
// ============================================================================

/*
Use these templates in your admin panel:
*/

export const NOTIFICATION_TEMPLATES = {
    classReminder: (studentName, classTime, classNumber) => ({
        subject: 'Reminder: Your Guitar Class is Coming Up',
        message: `Hi ${studentName},

This is a friendly reminder about your guitar class coming up!

📅 Class Time: ${classTime}
🎸 Class Number: ${classNumber}

Please make sure you:
- Have your guitar ready
- Are in a quiet space
- Have your lesson materials ready
- Join 5 minutes early if it's an online class

See you soon!

Best regards,
Your Guitar Tutor`
    }),

    paymentReminder: (studentName, amount, dueDate) => ({
        subject: 'Payment Reminder',
        message: `Hi ${studentName},

This is a friendly reminder about your pending payment.

💰 Amount Due: $${amount}
📅 Due Date: ${dueDate}

Please arrange the payment at your earliest convenience. You can:
- Transfer online
- Pay via card
- Cash on the next class

Thank you for your continued lessons!

Best regards,
Your Guitar Tutor`
    }),

    classCancellation: (studentName, originalTime, reason, rescheduleTime) => ({
        subject: 'Class Cancellation Notice',
        message: `Hi ${studentName},

Unfortunately, your guitar class has been cancelled.

❌ Original Time: ${originalTime}
📝 Reason: ${reason}

✅ New Scheduled Time: ${rescheduleTime}

I apologize for any inconvenience. We will make up for this class as scheduled.

Feel free to reach out if you have any questions.

Best regards,
Your Guitar Tutor`
    }),

    bulkAnnouncement: (announcement) => ({
        subject: 'Important Announcement',
        message: announcement
    })
};

// ============================================================================
// PART 10: TROUBLESHOOTING
// ============================================================================

/*
Common Issues:

1. "SendGrid configuration not found"
   - Make sure you created the config/sendgrid document in Firestore
   - Check the document has: apiKey and fromEmail fields

2. "Twilio configuration not found"
   - Make sure you created the config/twilio document in Firestore
   - Check the document has: accountSid, authToken, fromWhatsApp fields

3. "Permission denied" errors
   - Update firestore.rules to allow Cloud Functions
   - Make sure security rules aren't blocking notifications collection

4. Messages not being sent
   - Check Cloud Functions logs: firebase functions:log
   - Verify API keys are correct
   - Check phone numbers are in E.164 format: +country-code-number

5. Testing without real services
   - The basic notificationService.js logs to console for development
   - This allows testing the UI without setting up real services first
*/
