'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Package, ShieldCheck, RefreshCcw } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const LiveTracking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            try {
                const { data } = await axios.get('http://127.0.0.1:5001/api/bookings', config);
                setBookings(data.data);
            } catch (err) {
                console.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();

        // Real-time listener
        const socket = io('http://127.0.0.1:5001');
        socket.on('bookingUpdated', (updatedBooking) => {
            setBookings(prev => {
                const oldBooking = prev.find(b => b._id === updatedBooking._id);
                if (oldBooking) {
                    if (oldBooking.status !== updatedBooking.status && updatedBooking.status === 'In Progress') {
                        toast.success(`Booking for ${updatedBooking.projectType} is now In Progress`, {
                            icon: '🚀',
                            style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
                        });
                    }
                    if (oldBooking.paymentStatus !== updatedBooking.paymentStatus && updatedBooking.paymentStatus === 'Paid') {
                        toast.success(`Payment confirmed for ${updatedBooking.projectType}`, {
                            icon: '✅',
                            style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
                        });
                    }
                }
                return prev.map(b => b._id === updatedBooking._id ? updatedBooking : b);
            });
        });

        return () => socket.disconnect();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500';
            case 'In Progress': return 'bg-orange-500';
            case 'Confirmed': return 'bg-blue-500';
            case 'Failed': return 'bg-red-500';
            default: return 'bg-amber-500';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'In Progress': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    if (loading || bookings.length === 0) return null;

    return (
        <section className="py-24 bg-zinc-50 border-y border-zinc-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-4 font-mono">Real-Time Core</h4>
                        <h3 className="text-4xl font-black tracking-tighter text-black uppercase italic">Track Your Vision.</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-zinc-100 shadow-sm">
                        <RefreshCcw size={14} className="animate-spin text-blue-500" /> Live Synchronization Active
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {bookings.map((booking) => (
                            <motion.div 
                                key={booking._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                                        <Package size={20} />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                <h5 className="text-xl font-black tracking-tighter mb-2">{booking.projectType}</h5>
                                <p className="text-sm text-zinc-500 line-clamp-2 mb-8">{booking.description}</p>
                                
                                <div className="space-y-4 pt-6 border-t border-zinc-50">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-400">Payment Status</span>
                                        <span className={booking.paymentStatus === 'Paid' ? 'text-emerald-500' : booking.paymentStatus === 'Failed' ? 'text-red-500' : 'text-amber-500'}>
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                    
                                    {/* Visual Progress Bar */}
                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: booking.status === 'Completed' ? '100%' : booking.status === 'In Progress' ? '60%' : '20%' }}
                                            className={`h-full transition-colors duration-500 ${getStatusColor(booking.status)}`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-300">
                                        <Clock size={12} /> Last update: {new Date(booking.updatedAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default LiveTracking;
