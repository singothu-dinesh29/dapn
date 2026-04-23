'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
    Search, 
    Send, 
    User, 
    MoreVertical, 
    Phone, 
    Video, 
    Smile,
    CheckCheck,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMessagesPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://127.0.0.1:5001/api/admin/users', config);
                // Filter out current admin from the list
                setUsers(data.data.filter(u => u._id !== userInfo._id));
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        socket.current = io('http://127.0.0.1:5001');
        socket.current.emit('join', userInfo._id);

        socket.current.on('newMessage', (message) => {
            if (selectedUser && (message.senderId._id === selectedUser._id || message.receiverId === selectedUser._id)) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => socket.current.disconnect();
    }, [selectedUser]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedUser) return;
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://127.0.0.1:5001/api/messages/${selectedUser._id}`, config);
                setMessages(data.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, [selectedUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('http://127.0.0.1:5001/api/messages', {
                receiverId: selectedUser._id,
                message: newMessage
            }, config);

            setMessages(prev => [...prev, data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-160px)] bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden flex">
            {/* Users Sidebar */}
            <div className="w-80 border-r border-zinc-100 flex flex-col">
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-xl font-black tracking-tighter mb-4">MESSAGES</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search creators..."
                            className="w-full h-10 pl-10 pr-4 bg-zinc-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-zinc-200 transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {filteredUsers.map(user => (
                        <button 
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-4 flex items-center gap-3 hover:bg-zinc-50 transition-all border-b border-zinc-50 ${selectedUser?._id === user._id ? 'bg-zinc-50' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-black tracking-tight truncate uppercase">{user.name}</p>
                                <p className="text-[10px] font-bold text-zinc-400 truncate uppercase tracking-widest">{user.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-50/30">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} alt="avatar" />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight uppercase">{selectedUser.name}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Online Now</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-400">
                                <Phone size={18} className="cursor-not-allowed opacity-50" />
                                <Video size={18} className="cursor-not-allowed opacity-50" />
                                <MoreVertical size={18} className="cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId._id === JSON.parse(localStorage.getItem('userInfo'))._id;
                                return (
                                    <motion.div 
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] px-6 py-4 rounded-[24px] shadow-sm ${
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
                        <div className="p-6 bg-white border-t border-zinc-100">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <button type="button" className="text-zinc-400 hover:text-black transition-colors">
                                    <Smile size={24} />
                                </button>
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a creative message..."
                                    className="flex-1 h-14 px-6 bg-zinc-50 border border-transparent focus:border-zinc-100 rounded-2xl outline-none text-sm font-medium transition-all"
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
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm mb-6 text-zinc-200">
                            <Send size={40} />
                        </div>
                        <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">SELECT A CREATOR</h4>
                        <p className="text-zinc-400 text-sm max-w-xs font-medium">Select a user from the left to start a real-time creative collaboration.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessagesPage;
