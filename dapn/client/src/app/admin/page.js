'use client';
import { useState, useEffect } from 'react';
import { 
    Search, 
    MoreVertical, 
    CheckCircle2, 
    Clock, 
    Trash2, 
    Filter,
    ChevronDown,
    RefreshCw,
    Check,
    CalendarCheck,
    Shield
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    const API_BASE = 'http://127.0.0.1:5001/api/admin';

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get(`${API_BASE}/bookings`, config);
            setBookings(data.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // Socket setup
        const socket = io('http://127.0.0.1:5001');
        
        socket.on('bookingUpdated', (updatedBooking) => {
            setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
        });

        socket.on('newBooking', (newBooking) => {
            setBookings(prev => [newBooking, ...prev]);
        });

        return () => socket.disconnect();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`${API_BASE}/update-status/${id}`, { status: newStatus }, config);
            fetchBookings();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleMarkAsPaid = async (id) => {
        setUpdatingId(id);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`${API_BASE}/payment-status/${id}`, { paymentStatus: 'Paid' }, config);
            fetchBookings();
        } catch (error) {
            console.error('Error marking as paid:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        setUpdatingId(id);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`${API_BASE}/bookings/${id}`, config);
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.projectType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'In Progress': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100'; // Pending / default as Yellow/Amber
        }
    };

    const stats = [
        { name: 'Total Bookings', value: bookings.length, icon: <CalendarCheck size={20} />, color: 'bg-black' },
        { name: 'Pending Action', value: bookings.filter(b => b.status === 'Pending').length, icon: <Clock size={20} />, color: 'bg-amber-500' },
        { name: 'Paid Revenue', value: `₹${bookings.filter(b => b.paymentStatus === 'Paid').length * 2500}`, icon: <Shield size={20} />, color: 'bg-emerald-500' },
        { name: 'Active Projects', value: bookings.filter(b => b.status === 'In Progress').length, icon: <RefreshCw size={20} />, color: 'bg-blue-500' },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-black mb-2">Command Center</h1>
                    <p className="text-zinc-500 font-medium">Monitoring system performance and booking streams.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-100 rounded-[20px] text-sm font-medium focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all shadow-sm" 
                            placeholder="Search client or service..." 
                        />
                    </div>
                    <button 
                        onClick={fetchBookings}
                        className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-[20px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                        <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group"
                    >
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{stat.name}</p>
                            <h4 className="text-2xl font-black tracking-tighter text-black">{loading ? '...' : stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === filter 
                                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                                    : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-2 bg-zinc-50 rounded-lg">
                        Live Feed: {filteredBookings.length} results
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-black/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">User Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Type</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Submission Date</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Booking Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={`skeleton-${i}`} className="animate-pulse">
                                                <td colSpan="6" className="px-10 py-8">
                                                    <div className="h-4 bg-zinc-100 rounded-full w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                                                        <Filter size={40} />
                                                    </div>
                                                    <p className="font-bold uppercase text-xs tracking-widest">No matching records</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((booking) => (
                                            <motion.tr 
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={booking._id} 
                                                className={`group hover:bg-zinc-50/50 transition-colors ${updatingId === booking._id ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-sm text-black">{booking.name}</span>
                                                        <span className="text-[11px] text-zinc-400 font-medium tracking-tight">{booking.emailOrMobile}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="text-xs font-bold bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100 text-zinc-600">
                                                        {booking.projectType}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-black">
                                                            {new Date(booking.submissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">Logged</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                            booking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                                                        }`}>
                                                            {booking.paymentStatus}
                                                        </span>
                                                        {booking.paymentStatus !== 'Paid' && (
                                                            <button 
                                                                onClick={() => handleMarkAsPaid(booking._id)}
                                                                className="w-9 h-9 flex items-center justify-center hover:bg-emerald-50 text-emerald-400 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                                title="Mark as Paid"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="relative inline-block group/status">
                                                        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all hover:shadow-lg hover:shadow-black/5 ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                            <ChevronDown size={14} />
                                                        </button>
                                                        
                                                        {/* Status Dropdown */}
                                                        <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-zinc-100 rounded-[24px] shadow-2xl shadow-black/10 p-3 hidden group-focus-within/status:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300 px-3 mb-2">Update Status</div>
                                                            {['Pending', 'Confirmed', 'In Progress', 'Completed'].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleUpdateStatus(booking._id, s)}
                                                                    className="w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50 transition-colors flex items-center justify-between group/item"
                                                                >
                                                                    {s}
                                                                    {booking.status === s ? <Check size={14} className="text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover/item:bg-black transition-colors" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button 
                                                            onClick={() => handleDelete(booking._id)}
                                                            className="w-11 h-11 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination / Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    System Protocol v2.4.0 — Secure Data Layer
                </p>
                <div className="flex gap-3">
                    <button className="px-8 py-4 bg-zinc-50 text-[10px] font-black uppercase tracking-widest rounded-2xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all">Previous</button>
                    <button className="px-8 py-4 bg-black text-[10px] font-black uppercase tracking-widest rounded-2xl text-white shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">Next Page</button>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboard;
