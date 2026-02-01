/**
 * Notification Service
 * Handles sending notifications via email and WhatsApp
 * 
 * To integrate with real email/WhatsApp services:
 * 1. Email: Use Firebase Functions + SendGrid/Gmail API
 * 2. WhatsApp: Use Firebase Functions + Twilio API
 */

export async function sendEmailNotification(email, subject, message) {
    try {
        // In production, call a Firebase Cloud Function
        // Example: await firebase.functions().httpsCallable('sendEmail')({email, subject, message})
        console.log('📧 Email Notification:', { email, subject, message });
        
        // For development, log to console
        return {
            success: true,
            channel: 'email',
            recipient: email,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendWhatsAppNotification(phone, message) {
    try {
        // In production, call a Firebase Cloud Function
        // Example: await firebase.functions().httpsCallable('sendWhatsApp')({phone, message})
        console.log('💬 WhatsApp Notification:', { phone, message });
        
        // For development, log to console
        return {
            success: true,
            channel: 'whatsapp',
            recipient: phone,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw error;
    }
}

export async function sendNotificationToStudent(student, message, channels) {
    const results = [];

    try {
        if (channels.email && student.email) {
            const emailResult = await sendEmailNotification(
                student.email,
                'Guitar Lesson Notification',
                message
            );
            results.push(emailResult);
        }

        if (channels.whatsapp && student.phone) {
            const whatsappResult = await sendWhatsAppNotification(
                student.phone,
                message
            );
            results.push(whatsappResult);
        }

        return results;
    } catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
}

/**
 * Template functions for common notification scenarios
 */

export function getClassReminderTemplate(studentName, classTime, classNumber) {
    return `Hi ${studentName},

This is a reminder for your guitar class tomorrow at ${classTime}.

Class Number: ${classNumber}

Please be on time and have your guitar ready.

See you soon!`;
}

export function getPaymentReminderTemplate(studentName, amount) {
    return `Hi ${studentName},

This is a friendly reminder about your upcoming payment of $${amount} for your guitar lessons.

Please settle this at your earliest convenience.

Thank you!`;
}

export function getClassCancellationTemplate(studentName, classTime, reason) {
    return `Hi ${studentName},

Unfortunately, your guitar class scheduled for ${classTime} has been cancelled.

Reason: ${reason}

We will reschedule your class soon. Please check your email for more details.

Apologies for the inconvenience!`;
}

export function getBulkAnnouncementTemplate(announcement) {
    return announcement;
}
