import { createContext, useContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false); // Do not block UI on load
    const [trace, setTrace] = useState("Ready");

    async function loginWithGoogle() {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        // Force Google to show the account selection popup
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            setTrace("Opening Google Login...");
            const result = await signInWithPopup(auth, provider);
            await syncUserProfile(result.user);
            return result.user;
        } catch (error) {
            setTrace("Google Login Error: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function loginWithEmail(email, password) {
        setLoading(true);
        try {
            setTrace("Logging in with email...");
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserProfile(result.user);
            return result.user;
        } catch (error) {
            setTrace("Email Login Error: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function signUpWithEmail(email, password, name) {
        setLoading(true);
        try {
            setTrace("Creating account...");
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name });
            await syncUserProfile(result.user, true); // Force new profile
            return result.user;
        } catch (error) {
            setTrace("Signup Error: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function resetPassword(email) {
        setTrace("Sending reset email...");
        try {
            await sendPasswordResetEmail(auth, email);
            setTrace("Reset link sent!");
        } catch (error) {
            setTrace("Reset Error: " + error.message);
            throw error;
        }
    }

    async function syncUserProfile(user, isNew = false) {
        if (!user) return;
        setTrace("Syncing profile...");
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists() || isNew) {
                // New user - set default role to 'user'
                const role = 'user';
                console.log('Creating new profile with role:', role);

                const profileData = {
                    email: user.email,
                    displayName: user.displayName || "New User",
                    photoURL: user.photoURL || "",
                    role: role,
                    status: 'active',
                    createdAt: Date.now(),
                    classCount: 0,
                    notificationPrefs: { email: true, whatsapp: false },
                    phone: ""
                };
                await setDoc(userRef, profileData);
                setUserRole(role);
                setTrace("Profile Created: " + role);
            } else {
                // Existing user - load role from Firestore
                const userData = userSnap.data();
                const currentRole = userData.role || 'user';

                console.log('Existing profile loaded with role:', currentRole);
                setUserRole(currentRole);
                setTrace("Profile Loaded: " + currentRole);
            }
            setCurrentUser(user);
        } catch (error) {
            console.error('Sync Error:', error);
            setTrace("Sync Error: " + error.message);
            // Allow user to proceed even if firestore fails (offline mode)
            setCurrentUser(user);
        }
    }

    function logout() {
        return signOut(auth).then(() => {
            setCurrentUser(null);
            setUserRole(null);
            setTrace("Logged out");
        });
    }

    async function updateUserRole(userId, newRole) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            
            // Update local role if it's the current user
            if (currentUser?.uid === userId) {
                setUserRole(newRole);
            }
            
            return { success: true, message: `User role updated to ${newRole}` };
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }


    // Auth state listener - syncs profile on auth state changes
    useEffect(() => {
        console.log('Setting up auth listener...');
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed, user:', user?.email);
            if (user) {
                // Call syncUserProfile to ensure role is loaded/updated
                await syncUserProfile(user);
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loading,
        trace,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        updateUserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
