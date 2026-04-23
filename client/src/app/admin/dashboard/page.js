'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, ShieldCheck, Activity, Users, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">System Pulse</p>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">The Core.</h1>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Ecosystem
                </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Revenue', icon: CreditCard, val: '₹42,500', color: 'text-emerald-500' },
                        { label: 'Users', icon: Users, val: '128', color: 'text-blue-500' },
                        { label: 'Active Projects', icon: Activity, val: '14', color: 'text-orange-500' },
                        { label: 'Uptime', icon: ShieldCheck, val: '99.9%', color: 'text-zinc-500' }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] hover:border-zinc-700 transition-all"
                        >
                            <stat.icon className={`mb-6 ${stat.color}`} size={24} />
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</div>
                            <div className="text-3xl font-black tabular-nums">{stat.val}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-10">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-8 italic">Core Systems Status</h3>
                        <div className="space-y-6">
                            {['Database Sync', 'Payment Gateway', 'Email Automation', 'CDN Edge'].map((sys, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-zinc-800/50">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{sys}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Operational</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-emerald-600 rounded-[40px] p-10 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all">
                        <Database size={48} className="text-white/40 group-hover:text-white transition-all" />
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">Export<br />Vault Data</h3>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Generate Master JSON</p>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
