import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAn_Wd0rJR-Uj8fyzpzcM9XitOBD1iM_Gg",
    authDomain: "student-guitar-tutor-app.firebaseapp.com",
    projectId: "student-guitar-tutor-app",
    storageBucket: "student-guitar-tutor-app.firebasestorage.app",
    messagingSenderId: "498193263275",
    appId: "1:498193263275:web:9d71fe23097f67dac0a5ee",
    measurementId: "G-WQ7JRWLC03"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
