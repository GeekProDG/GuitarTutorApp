# 📧 Nodemailer + Gmail - Quick Checklist

**2 Minutes Setup | Completely FREE | Production Ready**

---

## Phase 1: Get Gmail App Password (1 min)

- [ ] Go to https://myaccount.google.com/
- [ ] Click "Security" in left sidebar
- [ ] Find "2-Step Verification"
  - If OFF → Turn it ON (takes 2 min)
  - If ON → Skip to next step
- [ ] Find "App passwords"
- [ ] Select: App = "Mail", Device = "Windows Computer"
- [ ] Click "Generate"
- [ ] Copy the 16-character password

**Save This:**
```
My Gmail: _shyamtanubec@gmail.com________
My App Password: encb ehsd xcsr afkf____________
```

---

## Phase 2: Configure Firebase (1 min)

Run in PowerShell:

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"
firebase functions:config:set nodemailer.email="your-gmail@gmail.com" nodemailer.password="your-16-char-password"
```

**Verify it worked:**
```powershell
firebase functions:config:get
```

✅ Should show your credentials

---

## Phase 3: Install & Deploy (2 min)

```powershell
cd functions
npm install nodemailer
```

**Update file:** `functions/src/index.js`
- See **NODEMAILER_COMMANDS.md** for the code to paste

**Deploy:**
```powershell
firebase deploy --only functions
```

✅ Should show: `✔ functions[sendEmail] has been deployed`

---

## Phase 4: Test Email (1 min)

1. Open http://localhost:5173/
2. Login as Admin
3. Go to **Students** tab
4. **Edit** any student
5. Set their email to **YOUR Gmail address**
6. Click **Bell icon** (🔔)
7. Type: "Test message"
8. Check ✅ **Email Notifications**
9. Click **Send**
10. Check your Gmail inbox

✅ **Email received?** → SUCCESS!

---

## 🎉 Done!

You now have:
✅ Real emails working  
✅ Completely FREE  
✅ No credit card  
✅ Unlimited (for your use)  
✅ Professional  

---

## ⚠️ If Something Fails

### "Config not recognized"
```powershell
firebase functions:config:get
```
If empty, set again with correct values.

### "Deployment error"
```powershell
cd functions
npm install nodemailer
firebase deploy --only functions
```

### "Email not arriving"
```
✅ Check spam folder
✅ Verify student email = your email
✅ Wait 10 seconds
✅ Check: firebase functions:log
```

---

## 📚 Full Guide

See: **NODEMAILER_GMAIL_SETUP.md** for detailed explanations

---

## 💡 Quick Reference

| Item | Value |
|------|-------|
| Cost | FREE |
| Setup time | 2 minutes |
| Email limit | 1,500/day |
| Emails sent so far | 0 (ready!) |
| Configuration | Done ✅ |

---

**Ready to start?** Follow Phase 1-4 above!
