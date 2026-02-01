import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SupportModal({ isOpen, onClose, userEmail = '' }) {
    const [formData, setFormData] = useState({
        email: userEmail,
        description: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');

        try {
            await addDoc(collection(db, 'support_requests'), {
                ...formData,
                submittedAt: serverTimestamp(),
                status: 'pending'
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ email: userEmail, description: '' });
            }, 2000);
        } catch (error) {
            console.error('Support request error:', error);
            setStatus('error');
        }
    }

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-black text-white">CONTACT SUPPORT</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">REQUEST SENT!</h3>
                        <p className="text-gray-400">We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                                <input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-baseline mb-2">
                                <label className="text-xs font-black text-amber-500 uppercase tracking-widest ml-1">
                                    How can we help?
                                </label>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">
                                    {formData.description.length} / 500 words
                                </span>
                            </div>
                            <div className="relative group">
                                <MessageSquare className="absolute left-4 top-6 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                                <textarea
                                    required
                                    maxLength={2500}
                                    placeholder="Describe your question or issue..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all h-48 resize-none leading-relaxed"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={status === 'submitting'}
                                className="px-6 py-3 text-gray-400 hover:text-white transition font-bold disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-black uppercase transition flex items-center gap-2"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-center text-xs font-bold uppercase tracking-widest">
                                Something went wrong. Please try again.
                            </p>
                        )}
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
