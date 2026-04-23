'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Users, 
    Search, 
    Mail, 
    Shield, 
    Calendar, 
    MoreVertical, 
    UserPlus,
    CheckCircle2,
    RefreshCw,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get('http://127.0.0.1:5001/api/admin/users', config);
            setUsers(data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-black mb-2 uppercase italic">User Directory</h1>
                    <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Registered Artisan & Admin Registry</p>
                </div>
                <button 
                    onClick={fetchUsers}
                    className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-[20px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                    <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* User Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Total Registered', value: users.length, icon: <Users size={20} />, bg: 'bg-zinc-50', color: 'text-black' },
                    { name: 'Active Admins', value: users.filter(u => u.role === 'admin').length, icon: <Shield size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' },
                    { name: 'Artisan Creators', value: users.filter(u => u.role === 'user').length, icon: <UserPlus size={20} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                ].map((stat, idx) => (
                    <motion.div 
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${stat.bg} p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-center gap-6`}
                    >
                        <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center ${stat.color} shadow-sm`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.name}</p>
                            <h4 className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Users Table Container */}
            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-transparent focus:border-zinc-100 rounded-2xl outline-none text-sm font-medium transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Filter className="text-zinc-400" size={18} />
                        {['All', 'Admin', 'User'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setRoleFilter(filter)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    roleFilter === filter ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-400 hover:text-black'
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
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">User Profile</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Security Role</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Registration Date</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Account Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            <AnimatePresence>
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr 
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-zinc-50/50 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-100 shadow-sm">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black tracking-tight uppercase">{user.name}</p>
                                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                                        <Mail size={12} />
                                                        <p className="text-[10px] font-bold lowercase tracking-normal">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'admin' ? <Shield size={14} className="text-blue-500" /> : <Users size={14} className="text-zinc-400" />}
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Calendar size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit border border-emerald-100">
                                                <CheckCircle2 size={12} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <button className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl text-zinc-400 hover:bg-black hover:text-white transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-200">
                            <Users size={40} />
                        </div>
                        <h4 className="text-xl font-black tracking-tighter uppercase mb-2">No Users Found</h4>
                        <p className="text-zinc-400 text-sm max-w-xs mx-auto font-medium">Try adjusting your search or filter to find specific registry members.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
