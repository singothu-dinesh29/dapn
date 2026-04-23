'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SecretAccessPage = () => {
    const [accessKey, setAccessKey] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccess = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocal ? 'http://127.0.0.1:5001' : 'https://dapn-web.vercel.app';

        try {
            // 1. Attempt Backend Validation
            const { data } = await axios.post(`${baseUrl}/api/admin/login`, { accessKey });

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                toast.success('Secure Core Authorized');
                router.push('/admin/dashboard');
            }
        } catch (err) {
            console.warn('Backend verification failed, checking Emergency Bypass...');
            
            // 2. EMERGENCY BYPASS (Owner Only)
            // If the backend is offline or ENV not set, allow access if key matches master
            if (accessKey === 'dapnix_master_2026') {
                localStorage.setItem('adminToken', 'bypass_token_active'); // Temporary bypass token
                toast.success('Emergency Bypass Active. Opening Vault.');
                router.push('/admin/dashboard');
                return;
            }

            toast.error('Identity Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Security Handshake.</h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Administrative Core Access</p>
                </div>

                <form onSubmit={handleAccess} className="space-y-4">
                    <div className="relative group">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                            required
                            type="password"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            placeholder="Enter Access Key"
                            className="w-full h-16 pl-14 pr-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all font-bold text-white placeholder:text-zinc-700"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full h-16 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Enter Vault'}
                    </button>
                </form>

                <div className="mt-12 flex items-center justify-center gap-2 text-zinc-800">
                    <AlertCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Unauthorized access is monitored</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SecretAccessPage;
