# 📧 How to Get Mailgun API Key - Visual Guide

## 🎯 The 3 Things You Need

1. **API Key** (looks like: `key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`)
2. **Domain** (looks like: `sandboxabc123def456ghi789.mailgun.org`)
3. **Verified Email** (your personal email to receive test messages)

---

## 📍 Where to Find Them in Mailgun

### **Finding Your API Key:**

```
MAILGUN DASHBOARD
├── Top Left: Click your name/profile
│   └── Settings
│       └── API Keys
│           └── Click Copy next to "Private API Key"
│               └── Your key appears here! ✅
```

**Look for:** Something starting with `key-`

### **Finding Your Domain:**

```
MAILGUN DASHBOARD
├── Left Sidebar: Sending
│   └── Domains
│       └── You'll see:
│           sandbox123abc.mailgun.org  ← This one!
│           └── Click to copy
```

**Look for:** Something starting with `sandbox`

### **Verify Your Email:**

```
MAILGUN DASHBOARD
├── Left Sidebar: Sending
│   └── Authorized Recipients
│       └── Click "Add Recipient"
│           └── Enter your email
│               └── Click verification link in email
```

---

## 🔐 These Are Your Golden Tickets

Once you have them:
1. ✅ API Key - You can send emails
2. ✅ Domain - Emails come from this domain
3. ✅ Verified Email - You receive test emails

---

## 📋 Quick Reference Card

Print this or screenshot it:

```
╔═══════════════════════════════════════════════════════════╗
║          MAILGUN SETUP REFERENCE CARD                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  MAILGUN ACCOUNT: ______________________________           ║
║  (your email address used to sign up)                     ║
║                                                            ║
║  API KEY: ________________________________________         ║
║  (Format: key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx)              ║
║                                                            ║
║  DOMAIN: __________________________________________       ║
║  (Format: sandboxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org)   ║
║                                                            ║
║  VERIFIED EMAIL: __________________________________       ║
║  (Your personal email for testing)                        ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🎬 Quick Video Guide (3 min equivalent)

### Scene 1: Sign Up (1 min)
```
1. Go to mailgun.com
2. Click Sign Up
3. Choose Free plan
4. Create account
5. Verify email
```

### Scene 2: Get API Key (1 min)
```
1. Login to app.mailgun.com
2. Click Settings (bottom left)
3. Click API Keys
4. Copy "Private API Key"
5. Save it somewhere safe
```

### Scene 3: Get Domain (30 sec)
```
1. Click "Sending" in left menu
2. Click "Domains"
3. Find sandbox domain
4. Copy it
5. Save it
```

### Scene 4: Verify Email (30 sec)
```
1. Click "Sending" in left menu
2. Click "Authorized Recipients"
3. Add your email address
4. Click link in email
5. Done!
```

---

## ✅ Done Checklist

Once you have all three:
- [ ] API Key saved
- [ ] Domain saved
- [ ] Email verified in Mailgun
- [ ] Ready to configure Firebase

**Next:** Follow **MAILGUN_COMMANDS.md** to set up Firebase

---

## 🆘 "I Can't Find My API Key"

**Solution:**
1. Go to https://app.mailgun.com/
2. Top right corner → Click your profile/name
3. Scroll down → Click "Settings"
4. Left sidebar → "API Keys"
5. You should see your Private API Key there

**If still not found:**
1. You might not be logged in
2. Try logging out and logging back in
3. Go to https://app.mailgun.com/ again

---

## 🆘 "I Can't Find My Domain"

**Solution:**
1. Go to https://app.mailgun.com/
2. Left sidebar → "Sending"
3. Click "Domains"
4. You'll see your sandbox domain listed

**It will look like:**
- `sandboxabc123def456ghi789.mailgun.org` ← This one!

---

## 🔒 Security Tips

✅ **DO:**
- Save API key in password manager
- Use it only in Firebase environment variables
- Keep it private

❌ **DON'T:**
- Share API key on public forums
- Commit it to GitHub
- Put it in client-side code

---

## 💡 For Reference

**Mailgun Free Tier Includes:**
- ✅ 1,250 emails/month
- ✅ Full API access
- ✅ Sandbox domain
- ✅ Support
- ✅ No credit card needed!

**Perfect for development!**

---

## 📍 Mailgun URLs to Bookmark

- **Main Dashboard:** https://app.mailgun.com/
- **Sign Up:** https://mailgun.com/
- **API Keys:** https://app.mailgun.com/app/account/security/api_keys
- **Domains:** https://app.mailgun.com/app/sending/domains
- **Authorized Recipients:** https://app.mailgun.com/app/sending/recipients

---

**Once you have these 3 things, you're 50% done! 🚀**

**Next:** See **MAILGUN_COMMANDS.md** for the PowerShell commands to deploy
