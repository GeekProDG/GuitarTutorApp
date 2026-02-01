import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import BrandPulse from './BrandPulse';
import SupportModal from './SupportModal';

export default function Navbar() {
    const { currentUser, userRole, logout, trace } = useAuth();
    const navigate = useNavigate();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log('Navbar - Current User:', currentUser?.email);
        console.log('Navbar - User Role:', userRole);
    }, [currentUser, userRole]);
    const [loginView, setLoginView] = useState('login');
    const [error, setError] = useState(null);

    function handleLoginClick() {
        setLoginView('login');
        setIsLoginOpen(true);
    }

    return (
        <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <div className="max-w-[1920px] mx-auto flex justify-between items-center gap-8">
                <div className="flex items-center gap-8 shrink-0">
                    <Link to="/" className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent tracking-tighter">
                        GUITARMASTER
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest">
                        <Link to="/" className="text-gray-400 hover:text-amber-500 transition">Home</Link>
                        <Link to="/blog" className="text-gray-400 hover:text-amber-500 transition">Blog</Link>
                        <button
                            onClick={() => setIsSupportOpen(true)}
                            className="text-gray-400 hover:text-amber-500 transition"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>

                <BrandPulse />

                <div className="flex gap-6 items-center shrink-0">
                    {/* Only show Start Learning Now if NOT logged in */}
                    {!currentUser && (
                        <Link
                            to="/join"
                            className="hidden sm:block text-amber-500 hover:text-amber-400 text-xs font-black uppercase tracking-widest transition"
                        >
                            Start Learning Now
                        </Link>
                    )}

                    <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                    {currentUser ? (
                        <div className="flex gap-4 items-center">
                            {userRole === 'admin' && (
                                <Link to="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400">Admin</Link>
                            )}
                            <Link to="/profile" className="relative group">
                                <img
                                    src={currentUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.uid}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full ring-2 ring-amber-500/20 group-hover:ring-amber-500 transition-all"
                                />
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="bg-amber-500 hover:bg-amber-600 text-black px-7 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition transform hover:scale-105 shadow-lg shadow-amber-500/20"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Error/Trace Overlays */}
            {(error || trace) && (
                <div className="absolute top-full left-0 right-0 bg-black/90 border-b border-white/5 py-1 px-6 flex justify-between gap-4 pointer-events-none">
                    {error && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter truncate">{error}</span>}
                    {trace && <span className="text-[9px] text-amber-500/40 font-black uppercase tracking-tighter truncate text-right flex-1">{trace}</span>}
                </div>
            )}

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                initialView={loginView}
            />
            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
                userEmail={currentUser?.email || ''}
            />
        </nav>
    );
}
