'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Shield, 
    Search, 
    Filter, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle, 
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPaymentsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            // Payments are part of bookings in this system
            const { data } = await axios.get('http://127.0.0.1:5001/api/admin/bookings', config);
            setBookings(data.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = bookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (b.transactionId && b.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = statusFilter === 'All' || b.paymentStatus === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { name: 'Total Revenue', value: `₹${bookings.filter(b => b.paymentStatus === 'Paid').length * 2500}`, icon: <ArrowUpRight className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { name: 'Pending Verification', value: bookings.filter(b => b.paymentStatus === 'Pending').length, icon: <AlertCircle className="text-amber-500" />, bg: 'bg-amber-50' },
        { name: 'Verified Payments', value: bookings.filter(b => b.paymentStatus === 'Paid').length, icon: <CheckCircle2 className="text-blue-500" />, bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-black mb-2 uppercase italic">Financial Ops</h1>
                    <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Transaction & Payment Verification Protocol</p>
                </div>
                <button 
                    onClick={fetchPayments}
                    className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-[20px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                    <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.name}</p>
                            <h4 className="text-3xl font-black tracking-tighter text-black">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters and Table */}
            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search transaction ID or user..."
                            className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-transparent focus:border-zinc-100 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Filter className="text-zinc-400" size={18} />
                        {['All', 'Paid', 'Pending'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === filter ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-400 hover:text-black'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Transaction Details</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Artisan</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Amount</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            <AnimatePresence>
                                {filteredPayments.map((payment, idx) => (
                                    <motion.tr 
                                        key={payment._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-zinc-50/50 transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black tracking-tight uppercase">{payment.transactionId || 'NO-ID-RECORDED'}</p>
                                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{payment.paymentMethod} • {new Date(payment.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-black uppercase">{payment.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase truncate max-w-[120px]">{payment.creatorId?.email || 'System User'}</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-black">₹2,500.00</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                payment.paymentStatus === 'Paid' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-200">
                                                    <ExternalLink size={14} className="text-zinc-400" />
                                                </button>
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-200">
                                                    <MoreHorizontal size={14} className="text-zinc-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                
                {filteredPayments.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-200">
                            <Shield size={32} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">No Transaction Records Found</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentsPage;
