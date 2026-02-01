import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Globe, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ExpressionOfInterest() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        description: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');

        try {
            await addDoc(collection(db, 'applications'), {
                ...formData,
                status: 'pending',
                submittedAt: serverTimestamp()
            });
            setStatus('success');
            // Notification/Email trigger logic would go here (e.g. Cloud Function)
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="max-w-md w-full bg-neutral-900/50 border border-amber-500/20 p-12 rounded-3xl text-center backdrop-blur-xl animate-in zoom-in-95 duration-500">
                    <CheckCircle className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">APPLICATION RECEIVED</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Your expression of interest has been recorded. We've sent a confirmation email to <span className="text-amber-400 font-bold">{formData.email}</span>.
                        Our team will review your application and get back to you shortly.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl transition-all transform hover:scale-[1.02]"
                    >
                        RETURN HOME
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                        START YOUR <span className="text-amber-500 italic underline decoration-amber-500/30">JOURNEY</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Apply to become a part of our exclusive guitar tutoring program. We select students based on their passion and commitment.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/40 border border-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                required
                                type="text"
                                placeholder="Jimi Hendrix"
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                required
                                type="email"
                                placeholder="jimi@voodoochild.com"
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">WhatsApp Contact</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                required
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">Your Timezone</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input
                                required
                                type="text"
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all cursor-not-allowed"
                                value={formData.timezone}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">Why do you want to learn guitar?</label>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">{formData.description.length} / 1000 words</span>
                        </div>
                        <div className="relative group">
                            <MessageSquare className="absolute left-4 top-6 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <textarea
                                required
                                maxLength={5000}
                                placeholder="Tell us about your musical dreams..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all h-64 resize-none leading-relaxed"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={status === 'submitting'}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-amber-500/10"
                        >
                            {status === 'submitting' ? (
                                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send size={24} />
                                    SUBMIT EXPRESSION OF INTEREST
                                </>
                            )}
                        </button>
                        {status === 'error' && (
                            <p className="text-red-500 text-center mt-4 font-bold uppercase text-xs tracking-widest">Something went wrong. Please try again.</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
