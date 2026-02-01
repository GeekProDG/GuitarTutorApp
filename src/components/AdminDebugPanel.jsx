import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDebugPanel() {
    const { currentUser, userRole, loginWithGoogle, trace } = useAuth();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        setStatus('⏳ Opening Google login...');
        try {
            await loginWithGoogle();
            setStatus('✅ Logged in successfully!');
        } catch (error) {
            setStatus(`❌ Login error: ${error.message}`);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function forceSetAdmin() {
        if (!currentUser) {
            setStatus('❌ No user logged in');
            return;
        }

        try {
            setStatus('⏳ Checking Firestore...');
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setStatus('⏳ Updating existing user to admin...');
                await updateDoc(userRef, { role: 'admin' });
                setStatus('✅ Updated to admin! Refreshing in 2s...');
            } else {
                setStatus('⏳ Creating new admin profile...');
                await setDoc(userRef, {
                    email: currentUser.email,
                    displayName: currentUser.displayName || 'Admin',
                    photoURL: currentUser.photoURL || '',
                    role: 'admin',
                    status: 'active',
                    createdAt: Date.now(),
                    classCount: 0,
                    notificationPrefs: { email: true, whatsapp: false },
                    phone: ''
                });
                setStatus('✅ Created admin profile! Refreshing in 2s...');
            }

            // Force reload after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            setStatus(`❌ Error: ${error.message}`);
            console.error('Force admin error:', error);
        }
    }

    return (
        <div className="fixed bottom-4 right-4 bg-neutral-900 border-2 border-amber-500 p-6 rounded-xl text-white z-50 max-w-md shadow-2xl">
            <h3 className="text-lg font-black text-amber-500 mb-4">🔧 ADMIN SETUP</h3>

            <div className="space-y-2 mb-4 text-sm font-mono bg-black/30 p-3 rounded-lg">
                <div><span className="text-gray-400">Email:</span> <span className={currentUser ? 'text-green-400' : 'text-red-400'}>{currentUser?.email || 'Not logged in'}</span></div>
                <div><span className="text-gray-400">Role:</span> <span className={userRole ? 'text-green-400' : 'text-yellow-400'}>{userRole || 'NULL'}</span></div>
                <div><span className="text-gray-400">UID:</span> {currentUser?.uid?.slice(0, 12) || 'N/A'}</div>
                <div><span className="text-gray-400">Trace:</span> <span className="text-blue-400 text-xs">{trace}</span></div>
            </div>

            {!currentUser ? (
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3 px-4 rounded-lg transition"
                >
                    {loading ? '⏳ LOGGING IN...' : '🔐 LOGIN WITH GOOGLE'}
                </button>
            ) : currentUser.email === 'shyamtanubec@gmail.com' ? (
                <div className="space-y-3">
                    <button
                        onClick={forceSetAdmin}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-3 px-4 rounded-lg transition"
                    >
                        ⚡ FORCE SET AS ADMIN
                    </button>

                    {userRole === 'admin' && (
                        <div className="bg-green-900/50 text-green-300 p-3 rounded-lg text-sm font-bold text-center">
                            ✅ You are already admin!
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-yellow-900/50 text-yellow-300 p-3 rounded-lg text-sm font-bold">
                    ⚠️ This panel is only for shyamtanubec@gmail.com
                </div>
            )}

            {status && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-bold ${status.includes('✅') ? 'bg-green-900/50 text-green-300' :
                        status.includes('❌') ? 'bg-red-900/50 text-red-300' :
                            'bg-blue-900/50 text-blue-300'
                    }`}>
                    {status}
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500 text-center">
                Use the LOGIN button above to sign in with Google
            </div>
        </div>
    );
}
