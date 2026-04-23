'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Calendar, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminRevenue = () => {
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenue();
    }, []);

    const fetchRevenue = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('https://dapn-web.vercel.app/api/admin/revenue', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRevenue(data.data);
        } catch (error) {
            console.error('Revenue Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-16">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">Financial Analytics</p>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">Revenue.</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-12">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Confirmed Revenue</div>
                            <div className="text-7xl font-black tracking-tighter italic">₹{revenue?.totalRevenue || 0}</div>
                        </div>
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center">
                            <TrendingUp size={32} />
                        </div>
                    </div>
                    
                    <div className="pt-12 border-t border-zinc-800/50">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8">Daily Distribution</div>
                        <div className="flex items-end gap-3 h-48">
                            {(revenue?.dailyRevenue || []).map((day, i) => {
                                const height = (day.total / revenue.totalRevenue) * 100;
                                return (
                                    <div key={i} className="flex-1 group relative">
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all">
                                            ₹{day.total}
                                        </div>
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(height, 5)}%` }}
                                            className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all rounded-t-xl"
                                        />
                                        <div className="mt-4 text-[8px] font-bold text-zinc-600 uppercase text-center rotate-45">
                                            {day._id.split('-').slice(1).join('/')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[40px]">
                        <Wallet className="text-zinc-500 mb-6" size={24} />
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Avg. Per Project</div>
                        <div className="text-3xl font-black italic">₹{(revenue?.totalRevenue / 14).toFixed(0)}</div>
                    </div>
                    <div className="bg-emerald-600 p-10 rounded-[40px] text-white flex flex-col justify-between h-64">
                        <ArrowUpRight size={32} />
                        <div>
                            <div className="text-4xl font-black tracking-tighter uppercase italic mb-2">+12.5%</div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Growth since last month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRevenue;
