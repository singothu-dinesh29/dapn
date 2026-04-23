'use client';
import { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Shield, 
    Bell, 
    Lock, 
    ChevronRight, 
    Save, 
    Camera,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        // Load persistent avatar from localStorage
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            setPreviewImage(savedAvatar);
        }
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Settings updated successfully!', {
                style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            });
        }, 1000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreviewImage(base64String);
                localStorage.setItem('userAvatar', base64String);
                // Trigger navbar update
                window.dispatchEvent(new Event('storage'));
                toast.success('Profile Photo Synchronized! ✨', {
                    style: { borderRadius: '16px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return null;

    const tabs = [
        { id: 'profile', name: 'General Profile', icon: <User size={18} /> },
        { id: 'security', name: 'Security & Auth', icon: <Lock size={18} /> },
        { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
        { id: 'billing', name: 'Billing & Plans', icon: <Shield size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50/50 pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        <div className="mb-10 px-4">
                            <h1 className="text-4xl font-black tracking-tighter text-black uppercase italic leading-none mb-2">Account</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Settings Protocol</p>
                        </div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                                    activeTab === tab.id 
                                    ? 'bg-black text-white shadow-xl shadow-black/10' 
                                    : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    {tab.icon}
                                    {tab.name}
                                </div>
                                {activeTab === tab.id && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>

                    {/* Main Settings Form */}
                    <div className="flex-1">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm"
                        >
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSave} className="space-y-10">
                                    <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-zinc-50">
                                        <div className="relative group">
                                            <div className="w-32 h-32 bg-zinc-100 rounded-[32px] overflow-hidden border-2 border-white shadow-xl relative">
                                                <img 
                                                    src={previewImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                                    alt="avatar" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <input 
                                                type="file" 
                                                id="avatarInput"
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => document.getElementById('avatarInput').click()}
                                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tighter uppercase mb-1">{user.name}</h3>
                                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">{user.role || 'Creator Account'}</p>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                <CheckCircle2 size={12} /> Verified Member
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Public Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                                <input 
                                                    defaultValue={user.name}
                                                    className="w-full h-14 pl-12 pr-6 bg-zinc-50 border border-transparent focus:border-zinc-100 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                                <input 
                                                    disabled
                                                    defaultValue={user.email}
                                                    className="w-full h-14 pl-12 pr-6 bg-zinc-100 border border-transparent rounded-2xl outline-none text-sm font-medium text-zinc-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Artisan Bio</label>
                                            <textarea 
                                                rows="4"
                                                placeholder="Tell us about your creative vision..."
                                                className="w-full p-6 bg-zinc-50 border border-transparent focus:border-zinc-100 focus:bg-white rounded-[24px] outline-none text-sm font-medium transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <button 
                                            disabled={loading}
                                            type="submit" 
                                            className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                        >
                                            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab !== 'profile' && (
                                <div className="h-96 flex flex-col items-center justify-center text-center p-10">
                                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 text-zinc-200">
                                        {tabs.find(t => t.id === activeTab).icon}
                                    </div>
                                    <h4 className="text-xl font-black tracking-tighter uppercase mb-2">{activeTab} Coming Soon</h4>
                                    <p className="text-zinc-400 text-sm max-w-xs font-medium">We're finalizing the {activeTab} protocols. Stay tuned for advanced account controls.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
