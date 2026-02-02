# 🚀 Mailgun Setup - Quick Checklist

## Phase 1: Create Mailgun Account ✅

- [ ] Go to https://mailgun.com/
- [ ] Click "Sign Up"
- [ ] Choose FREE plan
- [ ] Create account with your email
- [ ] Verify your email (click link in inbox)

**Status: Ready for next phase?** → Yes ✅

---

## Phase 2: Get Your Credentials ✅

### Get API Key:
1. Go to https://app.mailgun.com/
2. Login
3. Left sidebar → Settings → API Keys
4. Copy your **Private API Key**
   - Format: `key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
   - Save it! ⬇️

```
My API Key: _________________________________
```

### Get Domain:
1. Left sidebar → Sending → Domains
2. Copy your **sandbox domain**
   - Format: `sandboxabc123def456ghi789.mailgun.org`
   - Save it! ⬇️

```
My Domain: _________________________________
```

**Status: Have both credentials?** → Yes ✅

---

## Phase 3: Verify an Email Address ✅

1. Go to https://app.mailgun.com/
2. Left sidebar → Sending → **Authorized Recipients**
3. Click **Add Recipient**
4. Enter your personal email (the one you'll test with)
5. Click verification link in that email
6. Done!

**Status: Email verified?** → Yes ✅

---

## Phase 4: Configure Firebase ✅

### Open PowerShell and run:

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"

firebase functions:config:set mailgun.api_key="YOUR_API_KEY_HERE" mailgun.domain="YOUR_DOMAIN_HERE"
```

**Example:**
```powershell
firebase functions:config:set mailgun.api_key="key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p" mailgun.domain="sandboxabc123def456ghi789.mailgun.org"
```

### Verify it worked:
```powershell
firebase functions:config:get
```

Should show:
```json
{
  "mailgun": {
    "api_key": "key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    "domain": "sandboxabc123def456ghi789.mailgun.org"
  }
}
```

**Status: Config set correctly?** → Yes ✅

---

## Phase 5: Deploy Cloud Functions ✅

### Navigate to functions folder:
```powershell
cd functions
```

### Install packages:
```powershell
npm install mailgun.js form-data
```

### Create/Update `functions/src/index.js`

Copy the entire code from **MAILGUN_SETUP.md** → Step 5.3

Paste it in `functions/src/index.js`

### Deploy:
```powershell
firebase deploy --only functions
```

Should show:
```
✔ functions[sendEmail] has been deployed...
```

**Status: Functions deployed?** → Yes ✅

---

## Phase 6: Test Email Sending ✅

### Send Test Email:
1. Open http://localhost:5173/
2. Login as Admin
3. Go to **Students** tab
4. Click **Edit** on a student
5. Set their email to YOUR verified email address
6. Click **Bell icon** (🔔)
7. Type: "Test email notification"
8. Check ✅ **Email Notifications**
9. Click **Send**

### Check Your Email:
- Wait 5-10 seconds
- Check inbox for email from `noreply@sandboxabc123def456ghi789.mailgun.org`
- If found → ✅ SUCCESS!

**Status: Email received?** → Yes ✅

---

## 🎉 ALL DONE!

Your app can now send real emails! 

### What's working:
✅ Email notifications working
✅ Students receive real emails
✅ Firestore keeps audit trail
✅ Admin panel fully functional

### Next (Optional):
Set up WhatsApp notifications with Twilio
→ See: **QUICK_NOTIFICATION_SETUP.md**

---

## ❌ Stuck? Check These:

1. **Email not arriving?**
   - Check spam folder
   - Verify student email was added as "Authorized Recipient" in Mailgun
   - Check browser console (F12) for error messages

2. **Deployment failed?**
   - Run: `firebase functions:log` to see error
   - Check API key is correct (no extra spaces)
   - Run: `cd functions && npm install` again

3. **Can't find API key?**
   - Go to https://app.mailgun.com/
   - Click your profile icon (top right)
   - Go to Settings → API Keys

---

## 📞 Need Help?

See **MAILGUN_SETUP.md** for detailed step-by-step guide with troubleshooting!
