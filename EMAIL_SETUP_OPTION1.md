# ✉️ Send Emails Using Firebase Extensions (No Cloud Functions!)

**No Blaze plan required | No code needed | Email notifications working in 5 minutes**

---

## What This Does
Firebase Extensions watches your `notifications` collection and automatically sends emails when status is `pending`.

---

## Step 1: Install Firebase Extension

### In Firebase Console:
1. Go: https://console.firebase.google.com/project/student-guitar-tutor-app
2. Left sidebar → **Extensions**
3. Click **Explore extensions**
4. Search: **"Trigger Email"** (by Google Cloud)
5. Click it and **Install**

### Configuration:
- **Collection Path**: `notifications`
- **Document field containing email recipient**: `recipient`
- **Document field containing message subject**: `subject` 
- **Document field containing message content**: `message`
- **SMTP connection string**: (leave blank - use default)

Click **Install extension** and wait 2-3 minutes.

---

## Step 2: Test It

1. Go to http://localhost:5173/
2. Login as Admin
3. Go to Students tab
4. Edit a student
5. Click Bell icon (send notification)
6. Type message and send
7. Check your email inbox in 10 seconds

✅ Email should arrive!

---

## Step 3: Update From Email (Optional)

The extension will send from a default Gmail. If you want to customize:

1. Go back to Extensions in Firebase Console
2. Click the installed extension
3. Click **Reconfigure**
4. Set custom SMTP details if desired

---

## How It Works

```
Your App
   ↓
Stores notification in notifications/ collection
   ↓
Firebase Extension watches collection
   ↓
Detects status='pending'
   ↓
Sends email to recipient
   ↓
Updates notification status='sent'
   ↓
Done! ✅
```

---

## Troubleshooting

**"Email still not received"**
- Check spam folder
- Verify recipient email is correct (Edit Student)
- Wait 30 seconds - extension has small delay
- Check Extension Logs in Firebase Console

**"Extension installation failed"**
- Make sure you're logged into right Google account
- Try clearing browser cache
- Refresh Firebase Console

**"Want to change sending email?"**
- Extension defaults work fine for testing
- For production, reconfigure with custom SMTP

---

## Done! 🎉

Now your notifications auto-send when stored! No more waiting for emails.
