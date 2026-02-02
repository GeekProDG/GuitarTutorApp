# 🚀 Nodemailer + Gmail - Quick Commands

**Just copy and paste these!**

---

## Step 1: Set Firebase Configuration

Replace the values with YOUR Gmail info:

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"

firebase functions:config:set nodemailer.email="your-email@gmail.com" nodemailer.password="YOUR_16_CHAR_APP_PASSWORD"
```

**Example:**
```powershell
firebase functions:config:set nodemailer.email="john.doe@gmail.com" nodemailer.password="abcdefghijklmnop"
```

---

## Step 2: Verify Configuration

``"powershell
firebase functions:config:get
```

Should show your credentials. ✅

---

## Step 3: Install Nodemailer

```powershell
cd functions
npm install nodemailer
```

---

## Step 4: Update Cloud Function Code

**Replace ENTIRE content of `functions/src/index.js` with:**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Create email transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

/**
 * Cloud Function to send email notifications
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
    try {
        const { email, subject, message } = data;

        console.log(`📧 Sending email to ${email}...`);

        // Email HTML template
        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background: #f9fafb; border-radius: 8px;">
                <div style="border-left: 4px solid #d97706; padding-left: 15px; background: white; padding: 20px; border-radius: 4px;">
                    <h2 style="color: #d97706; margin-top: 0;">🎸 Guitar Lessons Notification</h2>
                    <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">
                        ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
                    </p>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px;">
                    <p>Student Guitar Tutor App<br>
                    ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        // Send email
        const result = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: subject,
            html: htmlMessage,
            text: message
        });

        console.log(`✅ Email sent successfully to ${email}`);
        console.log(`Response: ${result.response}`);

        return {
            success: true,
            messageId: result.messageId,
            recipient: email,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Cloud Function placeholder for WhatsApp
 */
exports.sendWhatsApp = functions.https.onCall(async (data, context) => {
    try {
        const { phone, message } = data;

        console.log(`💬 WhatsApp function called for ${phone}`);
        console.log(`Message: ${message}`);

        console.warn('⚠️ WhatsApp integration not yet configured. Use Twilio for real WhatsApp.');

        return {
            success: false,
            channel: 'whatsapp',
            recipient: phone,
            status: 'not_configured',
            message: 'WhatsApp integration requires Twilio setup'
        };

    } catch (error) {
        console.error('❌ Error in WhatsApp function:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
```

---

## Step 5: Deploy Functions

```powershell
firebase deploy --only functions
```

Wait for it to complete. You should see:
```
✔ functions[sendEmail] has been deployed
✔ functions[sendWhatsApp] has been deployed
```

---

## Step 6: Test

1. Open http://localhost:5173/
2. Login as Admin
3. Go to Students tab
4. Edit a student
5. Set their email to YOUR Gmail address
6. Click Bell icon
7. Type test message
8. Check Email checkbox
9. Click Send
10. Check your Gmail inbox

**If you got the email → Done!** ✅

---

## 📋 Copy-Paste Summary

```powershell
# 1. Configure
firebase functions:config:set nodemailer.email="your@gmail.com" nodemailer.password="16char_password"

# 2. Verify
firebase functions:config:get

# 3. Install
cd functions
npm install nodemailer

# 4. Update functions/src/index.js (see above)

# 5. Deploy
firebase deploy --only functions

# 6. Check logs if needed
firebase functions:log
```

---

## 🎯 That's it!

Emails are now working with Gmail! 🎉

See **NODEMAILER_GMAIL_SETUP.md** for detailed guide if you hit any issues.
