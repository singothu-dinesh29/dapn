'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, Key } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            };
            await axios.post(
                'http://127.0.0.1:5001/api/auth/forgot-password',
                { email },
                config
            );
            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600')" }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full px-6 flex justify-center">
                <div className="w-full max-w-[440px] backdrop-blur-xl bg-[#1a1c2ec0] p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                            <Key size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
                        <p className="text-zinc-400 text-sm">Enter your email to receive reset instructions.</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center">
                                    {error}
                                </div>
                            )}
                            
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    required
                                    type="email" 
                                    placeholder="Email Address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/5 rounded-2xl text-white text-sm focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>

                            <button 
                                disabled={loading}
                                type="submit" 
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>Send Reset Link</>
                                )}
                            </button>

                            <Link href="/login" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl text-sm font-medium">
                                We've sent a password reset link to <br/> <b>{email}</b>
                            </div>
                            <p className="text-zinc-500 text-xs">Didn't receive the email? Check your spam folder or try again.</p>
                            <Link href="/login" className="flex items-center justify-center gap-2 text-white bg-white/5 h-14 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold">
                                <ArrowLeft size={16} /> Return to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
