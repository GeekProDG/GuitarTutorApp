# 📧 Send Emails with Python Script (No Backend Required!)

**Simple Python script that runs locally and sends your notifications**

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Python & Firebase Library

```powershell
# Install Python (if you don't have it)
# Download from: https://www.python.org/downloads/

# Verify installation
python --version

# Install Firebase library
pip install firebase-admin
```

### Step 2: Get Firebase Key

1. Go to: https://console.firebase.google.com/project/student-guitar-tutor-app/settings/serviceaccounts/adminsdk
2. Click **"Generate New Private Key"**
3. Save the downloaded JSON file as: `firebase_key.json`
4. Put it in your project folder: `d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp\`

### Step 3: Configure Gmail

Edit `process_notifications.py` and update these 2 lines:

```python
GMAIL_SENDER = 'shyamtanubec@gmail.com'      # Your Gmail address
GMAIL_APP_PASSWORD = 'encb ehsd xcsr afkf'   # Your app password
```

### Step 4: Run the Script

```powershell
cd "d:\Backup\Media\Hobby\AntiGravityProjects\StudentGuitarApp"
python process_notifications.py
```

You should see:
```
🔔 Starting notification processor...
📧 Sender: shyamtanubec@gmail.com
Watching notifications collection for pending items...
```

**Leave this running in the background!** (It checks every 5 seconds)

---

## ✅ Test It

With the script running:

1. Open http://localhost:5173/
2. Login as Admin
3. Go to **Students** tab
4. **Edit** a student
5. Click **Bell icon** (send notification)
6. Type a message
7. Click **Send**

**Watch the Python window:**
```
📤 Processing: notifications_xyz
   To: student@gmail.com
   Subject: Guitar Lesson Update
   ✅ Sent successfully!
```

**Check your email** - it should arrive in 10 seconds! ✅

---

## 🔧 Troubleshooting

### "ModuleNotFoundError: No module named 'firebase_admin'"
```powershell
pip install firebase-admin
```

### "ERROR: Firebase key not found"
- Download key from Firebase Console
- Save as: `firebase_key.json` in project folder
- Make sure filename is exactly `firebase_key.json`

### "Email not sending"
```
Check:
✅ Gmail address is correct
✅ App password is correct (16 chars, from myaccount.google.com/security)
✅ 2-Factor Auth is ON in Google Account
✅ Script is still running (check console)
```

### "Status stays 'pending'"
- Script may not be running
- Check the console window is still showing "Watching notifications..."
- Try sending another notification

---

## 🚀 How It Works

```
Your App sends notification
   ↓
Stores in Firestore (status='pending')
   ↓
Python script watches Firestore (every 5 sec)
   ↓
Finds pending notifications
   ↓
Sends via Gmail SMTP
   ↓
Updates Firestore (status='sent')
   ↓
Email in inbox ✅
```

---

## 📋 File Checklist

Make sure you have these in your project folder:

- ✅ `process_notifications.py` (the script)
- ✅ `firebase_key.json` (download from Firebase)
- ✅ Script is running in PowerShell/Terminal

---

## 🎉 Done!

Your notifications now send automatically!

**To keep emails sending:**
- Keep the Python script running in background
- Or set it up as Windows Service (advanced)
- Or use Firebase Extensions for no-code solution

**Which approach?**
- **Python script** = Simple, works locally, easy to debug
- **Firebase Extensions** = No code, runs in cloud, needs install in Console

Both work! Pick your favorite.
