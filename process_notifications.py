#!/usr/bin/env python3
"""
Simple Email Notification Processor
Watches Firebase notifications collection and sends emails

This script:
1. Connects to your Firebase Firestore
2. Queries for notifications with status='pending'
3. Sends them via Gmail SMTP
4. Updates status to 'sent' or 'failed'
"""

import firebase_admin
from firebase_admin import credentials, firestore
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import sys

# TODO: Download your Firebase key from Firebase Console
# Go to: Project Settings → Service Accounts → Generate New Private Key
# Save as: firebase_key.json in the same folder as this script

# Configuration
FIREBASE_KEY_PATH = './firebase_key.json'  # Download from Firebase Console
GMAIL_SENDER = 'shyamtanubec@gmail.com'      # Your Gmail address (for authentication)
GMAIL_APP_PASSWORD = 'bfkjmqvtvdtrtvdq'  # Your Gmail App Password (no spaces!)
EMAIL_FROM_ADDRESS = 'noreply@student-guitar-tutor-app.firebaseapp.com'  # Display sender

def send_email(recipient, subject, message, sender, cc_recipients=[]):
    """Send email via Gmail SMTP with CC support"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'Admin <{EMAIL_FROM_ADDRESS}>'  # Use Firebase domain
        msg['To'] = recipient
        if cc_recipients:
            msg['Cc'] = ', '.join(cc_recipients)

        # Create HTML version
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #f59e0b; border-bottom: 3px solid #f59e0b; padding-bottom: 10px;">🎸 Guitar Lesson Update</h2>
              <p style="color: #4b5563; line-height: 1.6;">{message.replace(chr(10), '<br>')}</p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                Sent from Student Guitar Tutor App<br>
                Please do not reply to this email
              </p>
            </div>
          </body>
        </html>
        """

        # Attach both plain text and HTML
        msg.attach(MIMEText(message, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        # Send via Gmail - include CC recipients
        all_recipients = [recipient] + (cc_recipients if cc_recipients else [])
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(GMAIL_SENDER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_SENDER, all_recipients, msg.as_string())

        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

def check_upcoming_classes(db, gmail_sender):
    """Check for upcoming classes within 4 hours and create reminder notifications"""
    from datetime import datetime, timedelta
    
    try:
        # Current time
        now = datetime.utcnow()
        reminder_window_start = now + timedelta(hours=3.5)  # 3.5 hours from now
        reminder_window_end = now + timedelta(hours=4.5)    # 4.5 hours from now
        
        # Track which reminders we've already created today
        reminder_key_today = now.strftime('%Y-%m-%d')
        
        # Get all admin users for CC
        admins = db.collection('users').where('role', '==', 'admin').get()
        admin_emails = [admin.to_dict().get('email') for admin in admins if admin.to_dict().get('email')]
        
        if not admin_emails:
            print(f"⚠️ No admin users found for CC")
            return
        
        print(f"📅 Checking for upcoming classes (admins to CC: {', '.join(admin_emails)})")
        
        # Query all users to find students with upcoming classes
        users = db.collection('users').where('role', '==', 'user').get()
        
        reminders_created = 0
        for user_doc in users:
            user_data = user_doc.to_dict()
            user_email = user_data.get('email')
            user_name = user_data.get('displayName', 'Student')
            
            # Check if user has a nextClassTime field
            if not user_data.get('nextClassTime'):
                continue
            
            # Convert nextClassTime to datetime if it's a Firestore timestamp
            next_class = user_data.get('nextClassTime')
            if hasattr(next_class, 'timestamp'):
                next_class_dt = datetime.utcfromtimestamp(next_class.timestamp())
            else:
                try:
                    next_class_dt = datetime.fromisoformat(str(next_class).replace('Z', '+00:00'))
                except:
                    continue
            
            # Check if class is within reminder window
            if reminder_window_start <= next_class_dt <= reminder_window_end:
                # Format the class time nicely
                class_time_str = next_class_dt.strftime('%I:%M %p UTC')
                class_date_str = next_class_dt.strftime('%A, %B %d, %Y')
                
                # Create reminder notification
                message = f"""Hello {user_name},

You have an upcoming guitar lesson:
📅 {class_date_str}
🕐 {class_time_str}

Please make sure you're ready 5 minutes before your scheduled class time.

If you need to reschedule or have any questions, please contact your tutor.

Best regards,
Your Guitar Tutor App"""
                
                # Check if reminder already sent today
                existing_reminders = db.collection('notifications')\
                    .where('recipient', '==', user_email)\
                    .where('type', '==', 'class_reminder')\
                    .where('reminderDate', '==', reminder_key_today)\
                    .get()
                
                if not existing_reminders:
                    # Create notification document
                    db.collection('notifications').add({
                        'type': 'class_reminder',
                        'from': 'system',
                        'recipient': user_email,
                        'cc': admin_emails,  # Add all admins to CC
                        'subject': f'Class Reminder - {class_date_str}',
                        'message': message,
                        'status': 'pending',
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'studentName': user_name,
                        'classTime': next_class_dt,
                        'reminderDate': reminder_key_today
                    })
                    
                    reminders_created += 1
                    print(f"   ✅ Created reminder for {user_name} ({user_email}) - Class: {class_time_str}")
        
        if reminders_created > 0:
            print(f"✅ Created {reminders_created} class reminder(s)\n")
        
    except Exception as e:
        print(f"❌ Error checking upcoming classes: {e}\n")

def process_notifications():
    """Connect to Firebase and process pending notifications"""
    
    # Initialize Firebase
    try:
        firebase_admin.initialize_app(credentials.Certificate(FIREBASE_KEY_PATH))
    except:
        # Already initialized
        pass
    
    db = firestore.client()
    
    print("🔔 Starting notification processor...")
    print(f"📧 Sender: {EMAIL_FROM_ADDRESS} (authenticated as {GMAIL_SENDER})")
    print("Watching notifications collection for pending items...\n")
    
    processed_count = 0
    last_scheduler_run = 0  # Track when scheduler last ran
    scheduler_interval = 1800  # Run every 30 minutes (1800 seconds)
    
    while True:
        try:
            # Run scheduler every 15 minutes
            current_time = time.time()
            if current_time - last_scheduler_run >= scheduler_interval:
                check_upcoming_classes(db, GMAIL_SENDER)
                last_scheduler_run = current_time
            
            # Query pending notifications
            pending_docs = db.collection('notifications')\
                .where('status', '==', 'pending')\
                .limit(5)\
                .get()
            
            for doc in pending_docs:
                notif = doc.to_dict()
                doc_id = doc.id
                notif_type = notif.get('type', 'email')
                recipient = notif.get('recipient')
                
                # Skip WhatsApp notifications (not implemented yet)
                if notif_type == 'whatsapp':
                    print(f"📤 Skipping: {doc_id} (WhatsApp - not yet implemented)")
                    db.collection('notifications').document(doc_id).update({
                        'status': 'skipped',
                        'reason': 'WhatsApp notifications not yet implemented'
                    })
                    print(f"   ⏭️ Skipped\n")
                    continue
                
                # Only process email notifications
                if notif_type != 'email':
                    print(f"📤 Skipping: {doc_id} (Unknown type: {notif_type})")
                    db.collection('notifications').document(doc_id).update({
                        'status': 'skipped',
                        'reason': f'Unknown notification type: {notif_type}'
                    })
                    print(f"   ⏭️ Skipped\n")
                    continue
                
                # Validate email recipient
                if not recipient or '@' not in str(recipient):
                    print(f"📤 Processing: {doc_id}")
                    print(f"   To: {recipient}")
                    print(f"   ❌ Invalid email address (appears to be phone: {recipient})")
                    db.collection('notifications').document(doc_id).update({
                        'status': 'failed',
                        'error': f'Invalid email recipient: {recipient}'
                    })
                    print(f"   ❌ Failed\n")
                    continue
                
                print(f"📤 Processing: {doc_id}")
                print(f"   To: {recipient}")
                print(f"   Subject: {notif.get('subject', 'Guitar Lesson Update')}")
                
                # Get CC recipients if available
                cc_recipients = notif.get('cc', [])
                if cc_recipients:
                    print(f"   CC: {', '.join(cc_recipients)}")
                
                # Send email
                success = send_email(
                    recipient=recipient,
                    subject=notif.get('subject', 'Guitar Lesson Update'),
                    message=notif.get('message', ''),
                    sender=GMAIL_SENDER,
                    cc_recipients=cc_recipients
                )
                
                # Update status
                if success:
                    db.collection('notifications').document(doc_id).update({
                        'status': 'sent',
                        'sentAt': firestore.SERVER_TIMESTAMP
                    })
                    print(f"   ✅ Sent successfully!\n")
                    processed_count += 1
                else:
                    db.collection('notifications').document(doc_id).update({
                        'status': 'failed',
                        'error': 'SMTP error'
                    })
                    print(f"   ❌ Failed to send\n")
            
            # Wait before checking again
            time.sleep(5)
            
        except KeyboardInterrupt:
            print(f"\n✅ Processor stopped. Processed {processed_count} notifications total.")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    # Validate configuration
    if GMAIL_SENDER == 'your-email@gmail.com':
        print("❌ ERROR: Update GMAIL_SENDER in this script!")
        print("Set it to your actual Gmail address")
        sys.exit(1)
    
    if GMAIL_APP_PASSWORD == 'your-16-char-app-password':
        print("❌ ERROR: Update GMAIL_APP_PASSWORD in this script!")
        print("Get it from: myaccount.google.com/security → App Passwords")
        sys.exit(1)
    
    # Check for Firebase key
    import os
    if not os.path.exists(FIREBASE_KEY_PATH):
        print(f"❌ ERROR: Firebase key not found at {FIREBASE_KEY_PATH}")
        print("\nTo get it:")
        print("1. Go to: https://console.firebase.google.com/project/student-guitar-tutor-app")
        print("2. Click ⚙️ Settings → Service Accounts")
        print("3. Click 'Generate New Private Key'")
        print(f"4. Save as: {FIREBASE_KEY_PATH} in this folder")
        sys.exit(1)
    
    # Start processor
    process_notifications()
