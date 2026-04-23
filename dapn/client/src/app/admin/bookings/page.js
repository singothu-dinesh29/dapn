'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('http://127.0.0.1:5001/api/bookings');
                setBookings(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://127.0.0.1:5001/api/bookings/${id}`, { status });
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">BOOKINGS</h1>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Global Order Stream</p>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-zinc-300" size={40} />
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 italic font-black uppercase text-[10px] text-zinc-400">
                                <th className="px-10 py-8">Client</th>
                                <th className="px-6 py-8">Service Info</th>
                                <th className="px-6 py-8">Timeline</th>
                                <th className="px-6 py-8">Status</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="font-bold text-zinc-900">{booking.name}</div>
                                        <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
                                            <Mail size={10} /> {booking.emailOrMobile}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="text-sm font-medium">{booking.description}</div>
                                        <div className="inline-block mt-2 px-3 py-1 bg-zinc-100 rounded-full text-[9px] font-black uppercase tracking-tight">
                                            {booking.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500">
                                                <Calendar size={12} /> IN: {new Date(booking.submissionDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                                                <Clock size={12} /> OUT: {new Date(booking.handoverDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                                            booking.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => updateStatus(booking._id, 'Completed')}
                                                className="w-10 h-10 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(booking._id, 'Cancelled')}
                                                className="w-10 h-10 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
