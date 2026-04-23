'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TrendingUp, 
    Users, 
    CalendarCheck, 
    Shield, 
    ArrowUpRight, 
    ArrowDownRight,
    RefreshCw
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get('http://127.0.0.1:5001/api/admin/analytics', config);
            setData(data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex flex-col gap-8">
                <div className="h-12 w-64 bg-zinc-100 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-zinc-50 rounded-[32px] animate-pulse border border-zinc-100" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                    <div className="h-[400px] bg-zinc-50 rounded-[40px] animate-pulse border border-zinc-100" />
                    <div className="h-[400px] bg-zinc-50 rounded-[40px] animate-pulse border border-zinc-100" />
                </div>
            </div>
        );
    }

    const statCards = [
        { 
            name: 'Total Bookings', 
            value: data.totalBookings, 
            change: '+12%', 
            trend: 'up', 
            icon: <CalendarCheck size={20} />, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            name: 'Total Revenue', 
            value: `₹${data.totalRevenue.toLocaleString()}`, 
            change: '+8.4%', 
            trend: 'up', 
            icon: <TrendingUp size={20} />, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50' 
        },
        { 
            name: 'Pending Orders', 
            value: data.pendingCount, 
            change: '-2%', 
            trend: 'down', 
            icon: <RefreshCw size={20} />, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50' 
        },
        { 
            name: 'Completed Projects', 
            value: data.completedCount, 
            change: '+5%', 
            trend: 'up', 
            icon: <Shield size={20} />, 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50' 
        },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-black mb-2">Platform Metrics</h1>
                    <p className="text-zinc-500 font-medium">Global analytics and growth performance data.</p>
                </div>
                <button 
                    onClick={fetchAnalytics}
                    className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-[20px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                    <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm group hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.name}</p>
                            <h4 className="text-3xl font-black tracking-tighter text-black">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Growth Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm"
                >
                    <div className="mb-8">
                        <h5 className="text-lg font-black tracking-tighter uppercase mb-1">Revenue Performance</h5>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">7 Day Growth Stream</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.dailyStats}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 900, fill: '#A1A1AA'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 900, fill: '#A1A1AA'}}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Bookings Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm"
                >
                    <div className="mb-8">
                        <h5 className="text-lg font-black tracking-tighter uppercase mb-1">Booking Volume</h5>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Client Engagement Pulse</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 900, fill: '#A1A1AA'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 900, fill: '#A1A1AA'}}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8f8f8'}}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                                    {data.dailyStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === data.dailyStats.length - 1 ? '#000' : '#E4E4E7'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
            
            {/* System Info */}
            <div className="p-10 bg-black rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-black/20">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black tracking-tighter uppercase">Intelligent Growth Protocol</h3>
                    <p className="text-zinc-400 text-sm font-medium">All systems operational. Metrics synced with core database.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Server Latency</p>
                        <p className="text-sm font-black">24ms</p>
                    </div>
                    <div className="px-6 py-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Active Nodes</p>
                        <p className="text-sm font-black">128</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
