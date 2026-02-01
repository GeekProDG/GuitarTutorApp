import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, Chrome, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, initialView = 'login' }) {
    const { loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } = useAuth();
    const [view, setView] = useState(initialView);

    // Ensure view resets when modal is opened from a different entry point
    useEffect(() => {
        if (isOpen) setView(initialView);
    }, [isOpen, initialView]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        if (view === 'signup' && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (view === 'forgotPassword') {
            setLoading(true);
            try {
                await resetPassword(email);
                setMessage("Reset link sent! Please check your email inbox.");
                setFailedAttempts(0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            if (view === 'signup') {
                await signUpWithEmail(email, password, name);
            } else {
                await loginWithEmail(email, password);
            }
            setFailedAttempts(0);
            onClose();
            window.location.reload();
        } catch (err) {
            if (view === 'login') {
                const newAttempts = failedAttempts + 1;
                setFailedAttempts(newAttempts);
                
                if (newAttempts >= 3) {
                    setError(`Invalid password. After 3 failed attempts, please reset your password.`);
                } else {
                    setError(`${err.message} (${newAttempts}/3 failed attempts)`);
                }
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setError('');
        try {
            await loginWithGoogle();
            onClose();
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
            <div className="bg-neutral-900 border border-white/20 w-full max-w-md rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative my-auto animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                        {view === 'signup' ? 'Join the Studio' : view === 'forgotPassword' ? 'Reset Password' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {view === 'signup' ? 'Start your journey to guitar mastery' : view === 'forgotPassword' ? 'Enter your email to receive a reset link' : 'Unlock your next level of skill'}
                    </p>
                </div>

                {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center font-semibold animate-pulse">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-8 bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-4 rounded-xl text-center font-semibold">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {view === 'signup' && (
                        <div className="relative group">
                            <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white focus:border-amber-500/50 focus:bg-black/60 transition-all outline-none"
                            />
                        </div>
                    )}
                    <div className="relative group">
                        <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white focus:border-amber-500/50 focus:bg-black/60 transition-all outline-none"
                        />
                    </div>
                    {view !== 'forgotPassword' && (
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-amber-500/50 focus:bg-black/60 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-amber-400 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => {
                                    setView('forgotPassword');
                                    setFailedAttempts(0);
                                }}
                                className="text-xs text-amber-500/70 hover:text-amber-500 font-semibold"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    {view === 'login' && failedAttempts >= 3 && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-sm text-red-400 mb-3">Too many failed attempts. Please reset your password.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setView('forgotPassword');
                                    setFailedAttempts(0);
                                }}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition"
                            >
                                Reset Password
                            </button>
                        </div>
                    )}

                    {view === 'signup' && (
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-amber-500/50 focus:bg-black/60 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-amber-400 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-black py-4 rounded-2xl transition shadow-lg shadow-amber-500/20 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Entering...' : (view === 'signup' ? 'Create Account' : view === 'forgotPassword' ? 'Send Reset Link' : 'Login Now')}
                    </button>
                </form>

                <div className="relative my-10 text-center">
                    <hr className="border-white/5" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-6 text-xs text-gray-600 uppercase tracking-[0.2em] font-bold">or</span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-4 group"
                >
                    <Chrome size={22} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    Continue with Google
                </button>

                <p className="mt-10 text-center text-sm text-gray-500">
                    {view === 'signup' ? 'Already a member?' : view === 'forgotPassword' ? 'Remember your password?' : "Don't have an account yet?"}{' '}
                    <button
                        onClick={() => {
                            setError('');
                            setMessage('');
                            setView(view === 'login' ? 'signup' : 'login');
                        }}
                        className="text-amber-500 hover:text-amber-400 font-black underline underline-offset-4 decoration-2 transition-colors ml-1"
                    >
                        {view === 'login' ? 'Join Free' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>,
        document.body
    );
}
