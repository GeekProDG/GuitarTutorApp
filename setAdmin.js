// Admin Utility Script - Run this to manually set a user as admin
// Usage: node setAdmin.js <user-email>

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Your Firebase config (from firebase.js)
const firebaseConfig = {
    apiKey: "AIzaSyDU5ssFIB6sJ_Dl5KZy5yC8VUtxZbTqLQo",
    authDomain: "student-guitar-tutor-app.firebaseapp.com",
    projectId: "student-guitar-tutor-app",
    storageBucket: "student-guitar-tutor-app.firebasestorage.app",
    messagingSenderId: "663064835867",
    appId: "1:663064835867:web:8cc7a1c18cbb4d5b50e6cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setAdminRole(email) {
    try {
        console.log(`Looking for user with email: ${email}`);

        // Query for user by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('❌ User not found in database');
            console.log('The user needs to log in at least once to create their profile');
            return;
        }

        snapshot.forEach(async (userDoc) => {
            console.log(`✓ Found user:`, userDoc.id);
            console.log(`  Current role:`, userDoc.data().role);

            await updateDoc(doc(db, 'users', userDoc.id), {
                role: 'admin'
            });

            console.log(`✓✓ Updated role to 'admin'`);
            console.log('Please refresh the app and log in again');
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

const email = process.argv[2] || 'shyamtanubec@gmail.com';
console.log('=== Setting Admin Role ===');
setAdminRole(email).then(() => {
    console.log('=== Complete ===');
    process.exit(0);
});
