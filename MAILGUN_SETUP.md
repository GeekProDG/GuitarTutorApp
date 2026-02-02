# 📧 Mailgun Setup Guide - Step by Step

**Time Required:** 10 minutes  
**Cost:** FREE (forever tier available)

---

## ✅ Step 1: Create Mailgun Account (2 minutes)

### 1.1 Go to Mailgun Website
- Open: https://mailgun.com/
- Click **"Sign Up"** button (top right)

### 1.2 Choose Plan
- Select **"Free - $0/month"** (scroll down if needed)
- Click **"Start Free"**

### 1.3 Create Account
- Enter your email address
- Create a password (use something you'll remember)
- Check **"I agree to the Terms of Service"**
- Click **"Create Account"**

### 1.4 Verify Your Email
- Check your email inbox
- Click the verification link from Mailgun
- Account is now active!

---

## 🔑 Step 2: Get Your API Key (3 minutes)

### 2.1 Login to Mailgun Dashboard
- Go to: https://app.mailgun.com/
- Login with your email and password

### 2.2 Go to API Keys Section
1. In the left sidebar, look for **"Settings"**
2. Click **"Settings"**
3. Click **"API Keys"** (or "API security")

### 2.3 Copy Your API Key
- You'll see a section like this:

```
Private API Key
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

- **Click the copy icon** next to it
- Or manually copy the key (it looks like `key-xxxxxxxxxxxx`)
- **Save this somewhere safe!** (notepad, password manager, etc.)

---

## 🌐 Step 3: Get Your Mailgun Domain (2 minutes)

### 3.1 Find Your Sandbox Domain
1. Go to **"Sending"** in the left sidebar
2. Click **"Domains"**
3. You'll see a domain like: `sandboxabc123def456ghi789.mailgun.org`

### 3.2 Copy Your Domain
- Look for the domain that starts with "sandbox"
- Click to copy it
- **Save this!** It looks like: `sandboxabc123def456ghi789.mailgun.org`

---

## 💾 Step 4: Save Your Credentials (1 minute)

Create a temporary file (or use a password manager) with:

```
MAILGUN_API_KEY: key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
MAILGUN_DOMAIN: sandboxabc123def456ghi789.mailgun.org
```

**⚠️ IMPORTANT:** 
- Never share this API key publicly
- Never commit it to Git
- Only use it in Firebase environment variables (kept on servers)

---

## 🚀 Step 5: Deploy to Firebase (3 minutes)

### 5.1 Set Environment Variables

Open PowerShell and run:

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"

firebase functions:config:set mailgun.api_key="key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p" mailgun.domain="sandboxabc123def456ghi789.mailgun.org"
```

**Replace the values with YOUR actual key and domain!**

### 5.2 Verify Configuration
Run:
```powershell
firebase functions:config:get
```

You should see:
```json
{
  "mailgun": {
    "api_key": "key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    "domain": "sandboxabc123def456ghi789.mailgun.org"
  }
}
```

### 5.3 Deploy Cloud Functions

First, navigate to functions folder:
```powershell
cd functions
```

Install required packages:
```powershell
npm install mailgun.js form-data
```

Create/update `functions/src/index.js` with this code:

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

        // Initialize Mailgun client with API key
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

Now deploy:
```powershell
firebase deploy --only functions
```

You should see:
```
✔ functions[sendEmail] has been deployed with identity iam.serviceaccount.com
```

---

## 🧪 Step 6: Test Email Sending (2 minutes)

### 6.1 Add a Test Email
**Important:** The email address must be verified first!

1. Go to Mailgun Dashboard
2. Click **"Sending"** → **"Authorized Recipients"**
3. Add your email address (the one you'll test with)
4. Click the verification link in the email you receive

### 6.2 Send Test from App
1. Open your app: http://localhost:5173/
2. Login as Admin
3. Go to **Students** tab
4. Click **Edit** on a student
5. Make sure their email is set to YOUR verified email
6. Click **Bell icon** (🔔)
7. Type test message: "Hello! Testing email notifications"
8. **Check the Email checkbox**
9. Click **Send**

### 6.3 Check Email
- Check your inbox (wait 5-10 seconds)
- Look for email from `noreply@sandboxabc123def456ghi789.mailgun.org`
- Click on it to verify it worked!

---

## ✅ Verification Checklist

- [ ] Mailgun account created
- [ ] API key copied and saved
- [ ] Domain copied and saved
- [ ] Email verified in Mailgun
- [ ] Firebase environment variables set (`firebase functions:config:get` shows your values)
- [ ] Cloud Functions deployed (`firebase deploy --only functions` completed)
- [ ] Test email received in inbox
- [ ] Email came from `noreply@[your-sandbox-domain]`

---

## 🐛 Troubleshooting

### **"Function deployment failed"**
```powershell
# Check Node version (must be 14+)
node --version

# Reinstall dependencies
cd functions
rm -r node_modules
npm install

# Try deploying again
firebase deploy --only functions
```

### **"Email not received"**
```
✅ Check spam/junk folder
✅ Verify email was added in Mailgun "Authorized Recipients"
✅ Check that student email matches verified email
✅ Wait 10 seconds and refresh email client
✅ Check Firebase functions logs: firebase functions:log
```

### **"Configuration error"**
```powershell
# View your current config
firebase functions:config:get

# If empty, set again with correct values
firebase functions:config:set mailgun.api_key="key-xxx" mailgun.domain="sandboxxxx.mailgun.org"

# Redeploy
firebase deploy --only functions
```

### **"Error: API key is invalid"**
```
✅ Double-check the API key (it starts with "key-")
✅ Make sure you copied the PRIVATE API key (not public)
✅ Check for extra spaces at beginning or end
✅ Re-set the config: firebase functions:config:set mailgun.api_key="your-key"
```

### **"Unauthorized sender address"**
```
This means the "from" email isn't verified
Solution: The email comes FROM your Mailgun domain, not your personal email
It will show as: noreply@sandboxabc123def456ghi789.mailgun.org
This is normal! ✅
```

---

## 📞 Mailgun Documentation

- **Main Docs:** https://documentation.mailgun.com/
- **API Reference:** https://documentation.mailgun.com/api-intro
- **Sandbox Domains:** https://documentation.mailgun.com/en/latest/user_manual.html#sending-in-sandbox-domain

---

## 🎉 You're Done!

Once you see an email in your inbox, you have:
✅ Mailgun configured
✅ Cloud Functions deployed
✅ Emails sending successfully

Next: Set up WhatsApp (optional) using Twilio
See: **QUICK_NOTIFICATION_SETUP.md** for WhatsApp instructions

---

## 💡 Tips

**Free tier includes:**
- Up to 1,250 emails/month
- Full API access
- Sandbox domain for testing
- Great for development!

**When ready for production:**
1. Add a real domain
2. Upgrade to paid plan (if needed)
3. Remove sandbox restrictions

For now, the sandbox domain works perfectly for development and testing!
