'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
    Send, 
    Shield, 
    Phone, 
    Video, 
    Smile,
    CheckCheck,
    ChevronLeft,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserChatPage = () => {
    const [admin, setAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const socket = useRef();
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            router.push('/login');
            return;
        }

        const fetchAdmin = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${JSON.parse(userInfo).token}` } };
                // Fetch users to find an admin
                const { data } = await axios.get('http://127.0.0.1:5001/api/admin/users', config);
                const supportAdmin = data.data.find(u => u.role === 'admin');
                setAdmin(supportAdmin);
            } catch (error) {
                console.error('Error fetching admin:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();

        const user = JSON.parse(userInfo);
        socket.current = io('http://127.0.0.1:5001');
        socket.current.emit('join', user._id);

        socket.current.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => socket.current.disconnect();
    }, [router]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!admin) return;
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://127.0.0.1:5001/api/messages/${admin._id}`, config);
                setMessages(data.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, [admin]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !admin) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('http://127.0.0.1:5001/api/messages', {
                receiverId: admin._id,
                message: newMessage
            }, config);

            setMessages(prev => [...prev, data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-zinc-50 flex flex-col pt-20">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white shadow-2xl shadow-black/5 overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 bg-black text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}`} alt="avatar" />
                        </div>
                        <div>
                            <p className="text-sm font-black tracking-tighter uppercase">{admin?.name || 'Support Admin'}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active System Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500">
                        <Phone size={18} className="cursor-not-allowed" />
                        <Video size={18} className="cursor-not-allowed" />
                        <MoreVertical size={18} />
                    </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-zinc-50/50">
                    <div className="text-center py-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 mb-4">
                            <Shield size={12} className="text-blue-500" /> End-to-End Artisan Encrypted
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Wednesday, Oct 24</p>
                    </div>

                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId._id === JSON.parse(localStorage.getItem('userInfo'))._id;
                        return (
                            <motion.div 
                                key={msg._id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-6 py-4 rounded-[28px] shadow-sm ${
                                    isMe 
                                    ? 'bg-black text-white rounded-tr-none' 
                                    : 'bg-white text-black border border-zinc-100 rounded-tl-none'
                                }`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                    <div className={`flex items-center gap-2 mt-2 ${isMe ? 'text-zinc-500 justify-end' : 'text-zinc-400'}`}>
                                        <span className="text-[8px] font-black uppercase tracking-widest">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && <CheckCheck size={12} className="text-blue-500" />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white border-t border-zinc-100">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <button type="button" className="text-zinc-400 hover:text-black transition-colors">
                            <Smile size={24} />
                        </button>
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message our creative team..."
                            className="flex-1 h-14 px-8 bg-zinc-50 border border-transparent focus:border-zinc-100 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-black/10"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserChatPage;
