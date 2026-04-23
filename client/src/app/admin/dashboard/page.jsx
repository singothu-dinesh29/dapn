'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock, Users, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // bookings, users
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || userInfo.role !== 'admin') {
                window.location.href = '/home';
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            try {
                const [bookingsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/admin/bookings', config),
                    axios.get('http://localhost:5001/api/admin/users', config)
                ]);
                setBookings(bookingsRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Fetch failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Socket integration
        const s = io('http://localhost:5001');
        setSocket(s);

        s.on('bookingUpdate', (updatedBooking) => {
            setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
        });

        return () => s.disconnect();
    }, []);

    const updateBookingStatus = async (id, updates) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        try {
            const { data } = await axios.patch(`http://localhost:5001/api/admin/bookings/${id}`, updates, config);
            setBookings(prev => prev.map(b => b._id === id ? data : b));
        } catch (err) {
            alert('Failed to update booking');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="text-blue-500 animate-spin" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter italic uppercase">Admin Control.</h1>
                        <p className="text-zinc-500 text-sm mt-2">Monitoring Dapnix Ecosystem • Real-Time Core Active</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setActiveTab('bookings')}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-500'}`}
                        >
                            Bookings
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-500'}`}
                        >
                            Users
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Bookings', val: bookings.length, icon: <Calendar />, color: 'blue' },
                        { label: 'Total Users', val: users.length, icon: <Users />, color: 'purple' },
                        { label: 'Pending UPI', val: bookings.filter(b => b.paymentStatus === 'Pending').length, icon: <DollarSign />, color: 'amber' },
                        { label: 'Completed', val: bookings.filter(b => b.status === 'Completed').length, icon: <CheckCircle />, color: 'emerald' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                            <div className={`p-3 bg-${s.color}-500/10 text-${s.color}-500 w-fit rounded-xl mb-4`}>
                                {s.icon}
                            </div>
                            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{s.label}</h4>
                            <p className="text-3xl font-black mt-1 tracking-tighter">{s.val}</p>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'bookings' ? (
                        <motion.div 
                            key="bookings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/10">
                                    <tr>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Project</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Payment</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black">
                                                        {b.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm">{b.name}</div>
                                                        <div className="text-[10px] text-zinc-500">{b.emailOrMobile}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-sm italic">{b.projectType}</div>
                                                <div className="text-[10px] text-zinc-500 max-w-[200px] truncate">{b.description}</div>
                                            </td>
                                            <td className="p-6">
                                                <select 
                                                    value={b.status}
                                                    onChange={(e) => updateBookingStatus(b._id, { status: e.target.value })}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                                                >
                                                    {['Pending', 'Confirmed', 'In Progress', 'Completed'].map(s => (
                                                        <option key={s} value={s} className="bg-zinc-900">{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${b.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : b.paymentStatus === 'Failed' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                        {b.paymentStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2">
                                                    {b.paymentStatus === 'Pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => updateBookingStatus(b._id, { paymentStatus: 'Paid' })}
                                                                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                                                                title="Mark as Paid"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => updateBookingStatus(b._id, { paymentStatus: 'Failed' })}
                                                                className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                                title="Mark as Failed"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl"
                        >
                             <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/10">
                                    <tr>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Email</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Role</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Member Since</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/10 rounded-full overflow-hidden">
                                                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="" />
                                                    </div>
                                                    <div className="font-bold text-sm tracking-tight">{u.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-zinc-400">{u.email}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-6 text-sm text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
