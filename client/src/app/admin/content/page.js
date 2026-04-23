'use client';
import { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Upload, Link as LinkIcon, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AdminContent = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'image',
        fileUrl: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('https://dapn-web.vercel.app/api/admin/content/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Content Added Successfully');
            setFormData({ title: '', type: 'image', fileUrl: '', description: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-1000 max-w-4xl">
            <div className="mb-16">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">Creative Studio</p>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">Ecosystem Assets.</h1>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-12 lg:p-16">
                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Project Title</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter asset name..."
                                className="w-full bg-transparent border-b-2 border-zinc-800 py-4 outline-none focus:border-white transition-all text-xl font-bold placeholder:text-zinc-800"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Media Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-zinc-800 py-4 outline-none focus:border-white transition-all text-xl font-bold appearance-none cursor-pointer"
                            >
                                <option className="bg-black" value="image">Image Asset</option>
                                <option className="bg-black" value="video">Cinematic Video</option>
                                <option className="bg-black" value="ppt">Professional PPT</option>
                                <option className="bg-black" value="website">Web Experience</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Source URL (File OR Link)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700" size={20} />
                            <input 
                                required
                                value={formData.fileUrl}
                                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                placeholder="https://..."
                                className="w-full bg-transparent border-b-2 border-zinc-800 py-4 pl-10 outline-none focus:border-emerald-500 transition-all text-sm font-medium placeholder:text-zinc-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Asset Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Briefly describe this project..."
                            className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 outline-none focus:border-zinc-600 transition-all text-sm font-medium placeholder:text-zinc-800 resize-none"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full lg:w-auto px-16 h-20 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-3xl hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <PlusCircle size={20} />
                                Deploy Asset
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminContent;
