# 🔧 Mailgun Setup - Copy & Paste Commands

**Just copy and paste these commands in PowerShell!**

---

## Step 1: Navigate to Your Project

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"
```

---

## Step 2: Get Your Credentials from Mailgun

### Go to: https://app.mailgun.com/
### Settings → API Keys → Copy your Private API Key
### Sending → Domains → Copy your Sandbox Domain

---

## Step 3: Set Firebase Environment Variables

**⚠️ REPLACE the values with YOUR credentials!**

```powershell
firebase functions:config:set mailgun.api_key="KEY_HERE" mailgun.domain="DOMAIN_HERE"
```

### Example (with real values):
```powershell
firebase functions:config:set mailgun.api_key="key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p" mailgun.domain="sandboxabc123def456ghi789.mailgun.org"
```

---

## Step 4: Verify Configuration

```powershell
firebase functions:config:get
```

Should output something like:
```json
{
  "mailgun": {
    "api_key": "key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    "domain": "sandboxabc123def456ghi789.mailgun.org"
  }
}
```

**If output is empty:**
- Try Step 3 again with correct values
- Make sure no extra spaces

---

## Step 5: Install Dependencies

```powershell
cd functions
npm install mailgun.js form-data
```

---

## Step 6: Create Cloud Function

**Create or update file: `functions/src/index.js`**

Copy this entire code:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mailgun = require('mailgun.js');
const FormData = require('form-data');

admin.initializeApp();

// Initialize Mailgun
const mg = new mailgun(FormData);

exports.sendEmail = functions.https.onCall(async (data, context) => {
    try {
        const { email, subject, message } = data;
        const apiKey = process.env.MAILGUN_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;

        console.log(`📧 Sending email to ${email}...`);

        // Initialize Mailgun client
        const mailgunClient = mg.client({
            username: 'api',
            key: apiKey
        });

        // Create message
        const msg = {
            from: `Guitar Lessons <noreply@${domain}>`,
            to: email,
            subject: subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <div style="border-left: 4px solid #d97706; padding-left: 15px;">
                        <h2 style="color: #d97706; margin-top: 0;">Guitar Lessons</h2>
                        <p style="line-height: 1.6; color: #333;">
                            ${message.replace(/\n/g, '<br>')}
                        </p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        <strong>Student Guitar Tutor App</strong><br>
                        ${new Date().toLocaleString()}<br>
                        <a href="https://yourapp.com" style="color: #d97706; text-decoration: none;">Visit Portal</a>
                    </p>
                </div>
            `
        };

        // Send email
        const result = await mailgunClient.messages.create(domain, msg);

        console.log(`✅ Email sent successfully to ${email}`);
        console.log(`Message ID: ${result.id}`);

        return {
            success: true,
            messageId: result.id,
            recipient: email,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
```

Save the file (Ctrl+S)

---

## Step 7: Deploy Functions

```powershell
firebase deploy --only functions
```

Wait for it to finish. You should see:
```
✔ functions[sendEmail] has been deployed
```

---

## Step 8: Test Email

1. Open http://localhost:5173/ in browser
2. Login as Admin
3. Go to Students tab
4. Edit a student
5. Set their email to YOUR email (the one you verified in Mailgun)
6. Click Bell icon
7. Type test message
8. Check Email checkbox
9. Click Send
10. Check your email inbox (wait 10 seconds)

---

## ✅ Success!

If you received an email, everything is working! 🎉

---

## ⚠️ If Something Goes Wrong

### Check Firebase logs:
```powershell
firebase functions:log
```

### Redeploy functions:
```powershell
firebase deploy --only functions
```

### Verify your config again:
```powershell
firebase functions:config:get
```

### See full setup guide:
Read: **MAILGUN_SETUP.md** in your project root

---

## 📋 Copy-Paste Summary

1. `cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"`
2. `firebase functions:config:set mailgun.api_key="YOUR_KEY" mailgun.domain="YOUR_DOMAIN"`
3. `cd functions`
4. `npm install mailgun.js form-data`
5. Create `functions/src/index.js` with code above
6. `firebase deploy --only functions`
7. Test in app (send email via Bell icon)
8. Check your email inbox

Done! ✅
