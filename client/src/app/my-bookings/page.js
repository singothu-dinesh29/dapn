'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    CheckCircle, 
    Package, 
    ShieldCheck, 
    RefreshCcw, 
    Search,
    ChevronRight,
    CreditCard
} from 'lucide-react';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const MyBookingsPage = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            router.push('/login');
            return;
        }

        fetchMyBookings();

        // Socket setup
        const socket = io('http://127.0.0.1:5001');
        
        socket.on('bookingUpdated', (updatedBooking) => {
            setBookings(prev => {
                const oldBooking = prev.find(b => b._id === updatedBooking._id);
                
                // Show toast notifications based on changes
                if (oldBooking) {
                    if (oldBooking.status !== updatedBooking.status && updatedBooking.status === 'In Progress') {
                        toast.success(`Your booking for ${updatedBooking.projectType} is now In Progress`, {
                            icon: '🚀',
                            style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                        });
                    }
                    if (oldBooking.paymentStatus !== updatedBooking.paymentStatus && updatedBooking.paymentStatus === 'Paid') {
                        toast.success(`Payment confirmed for ${updatedBooking.projectType}`, {
                            icon: '✅',
                            style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                        });
                    }
                }

                return prev.map(b => b._id === updatedBooking._id ? updatedBooking : b);
            });
        });

        socket.on('newBooking', (newBooking) => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // Check if this booking belongs to the user
            if (newBooking.creatorId === userInfo._id) {
                setBookings(prev => [newBooking, ...prev]);
                toast.success('Project Slot Secured! ✨', {
                    style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                });
            }
        });

        return () => socket.disconnect();
    }, []);

    const filteredBookings = bookings.filter(b => 
        b.projectType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'In Progress': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50/50 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-[2px] bg-black" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Client Portal</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-black uppercase italic leading-none">
                            My <br /> <span className="text-zinc-300">Creations.</span>
                        </h1>
                    </div>
                    
                    <div className="w-full md:w-auto space-y-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-zinc-100 shadow-sm text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             Live Tracking Active
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search your projects..."
                                className="w-full md:w-80 h-14 pl-12 pr-4 bg-white border border-zinc-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse border border-zinc-100" />
                        ))}
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-zinc-100 shadow-sm">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                            <Package size={40} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-2">NO PROJECTS FOUND</h3>
                        <p className="text-zinc-500 text-sm mb-8">You haven't booked any slots yet. Start your creative journey today.</p>
                        <Link href="/home#booking" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                            Book a Slot <ChevronRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {filteredBookings.map((booking, idx) => (
                                <motion.div 
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <Package size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                booking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black tracking-tighter mb-4 text-black group-hover:translate-x-2 transition-transform duration-500 italic">
                                        {booking.projectType}
                                    </h2>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 line-clamp-2">
                                        {booking.description}
                                    </p>

                                    <div className="space-y-6 pt-8 border-t border-zinc-50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400">
                                                    <Clock size={14} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                    Est. Handover: {new Date(booking.handoverDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CreditCard size={18} className="text-zinc-200" />
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="relative pt-2">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest inline-block text-black">
                                                        Development Phase
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black inline-block text-black">
                                                        {booking.status === 'Completed' ? '100%' : booking.status === 'In Progress' ? '65%' : '25%'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-zinc-100">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: booking.status === 'Completed' ? '100%' : booking.status === 'In Progress' ? '65%' : '25%' }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                                        booking.status === 'Completed' ? 'bg-emerald-500' : 'bg-black'
                                                    }`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative background element */}
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <ShieldCheck size={180} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
