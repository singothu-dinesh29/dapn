'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Database, Package, TrendingUp, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const VaultControl = () => {
    const [isLocal, setIsLocal] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔐 HARDWARE LOCK: Only allow access on Localhost
        const checkLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        setIsLocal(checkLocal);

        if (checkLocal) {
            fetchAdminData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAdminData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || userInfo.role !== 'admin') {
                setLoading(false);
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            // Fetch from your production backend
            const baseUrl = 'https://dapn-web.vercel.app';
            const [bookingRes, statsRes] = await Promise.all([
                axios.get(`${baseUrl}/api/v1/vault-core/bookings`, config),
                axios.get(`${baseUrl}/api/v1/vault-core/stats`, config)
            ]);

            setBookings(bookingRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Vault Access Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    // ⛔ ACCESS DENIED: Shown on Vercel or non-local environments
    if (!isLocal) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                    <ShieldAlert size={48} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-4">Access Denied</h1>
                <p className="text-zinc-500 max-w-md font-medium uppercase tracking-widest text-[10px]">
                    This administrative vault is hardware-locked to the developer's local environment. 
                    Unauthorized access to the cloud core is prohibited.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">
                            <Lock size={12} className="text-emerald-500" /> Secure Local Vault Active
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic">Control Center.</h1>
                    </div>
                    {stats && (
                        <div className="flex gap-8">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Bookings</div>
                                <div className="text-4xl font-black tabular-nums tracking-tighter">{stats.totalBookings}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Confirmed</div>
                                <div className="text-4xl font-black tabular-nums tracking-tighter text-emerald-500">{stats.confirmedBookings}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bookings Table */}
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Project</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Timeline</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-sm mb-1">{booking.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-medium">{booking.contact || booking.email}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold">{booking.productType || booking.projectType}</div>
                                        <div className="text-[10px] text-zinc-600 line-clamp-1">{booking.description}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-medium">{new Date(booking.submissionDate || booking.date).toLocaleDateString()}</div>
                                        <div className="text-[9px] text-zinc-600 uppercase font-black">Slot: {booking.timeSlot || 'Standard'}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            booking.status === 'confirmed' 
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && (
                        <div className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
                            No active data found in the vault.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VaultControl;
