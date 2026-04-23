'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('https://dapn-web.vercel.app/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data.data);
        } catch (error) {
            console.error('Users Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="animate-in fade-in duration-1000">
            <div className="mb-16">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">Identity Management</p>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">Users.</h1>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-xl">
                <div className="p-10 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-xl font-black italic uppercase">Master Registry</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{users.length} Authorized Identities</div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800/30">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Registered On</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Privileges</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/20">
                            {users.map((user, i) => (
                                <motion.tr 
                                    key={user._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-10 py-8 font-bold text-lg">{user.name}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                            <Mail size={14} className="text-zinc-600" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
                                            <Clock size={14} className="text-zinc-600" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            user.role === 'admin' 
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
