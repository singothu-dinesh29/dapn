'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Filter, Loader2, Image as ImageIcon } from 'lucide-react';

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Photo Editing',
        thumbnail: '',
        description: '',
        externalLink: ''
    });

    const getAuthHeader = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return {};
        const { token } = JSON.parse(userInfo);
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('http://127.0.0.1:5001/api/projects');
            setProjects(data.data);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/projects/${id}`, {
                headers: getAuthHeader()
            });
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            const msg = err.response?.status === 401 ? '401: Unauthorized session.' : 'Delete failed.';
            alert(msg);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5001/api/projects', formData, {
                headers: getAuthHeader()
            });
            setIsAddModalOpen(false);
            fetchProjects();
            setFormData({ title: '', category: 'Photo Editing', thumbnail: '', description: '', externalLink: '' });
        } catch (err) {
            const msg = err.response?.status === 401 ? '401: Unauthorized session.' : 'Creation failed.';
            alert(msg);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">PROJECTS</h1>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Global Showcase Inventory</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-14 px-8 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
                >
                    <Plus size={20} /> Add New Project
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-zinc-300" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-[32px] border border-zinc-100 p-6 flex flex-col group hover:shadow-2xl hover:shadow-black/5 transition-all">
                            <div className="aspect-video bg-zinc-100 rounded-3xl mb-6 overflow-hidden relative border border-zinc-50">
                                {project.thumbnail ? (
                                    <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-2">
                                        <ImageIcon size={32} />
                                        <span className="text-[10px] font-bold tracking-widest">NO MEDIA</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight text-black border border-zinc-100 shadow-sm">
                                    {project.category}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold tracking-tight mb-2 uppercase italic">{project.title}</h3>
                            <p className="text-zinc-500 text-sm mb-8 line-clamp-2 font-medium">{project.description}</p>
                            
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-50">
                                <a 
                                    href={project.externalLink} 
                                    target="_blank" 
                                    className="text-zinc-400 hover:text-black transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <button 
                                    onClick={() => handleDelete(project._id)}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl border border-white/20">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-4xl font-black tracking-tighter italic uppercase text-black">NEW PROJECT</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="h-10 px-4 bg-zinc-100 hover:bg-black hover:text-white rounded-full text-[10px] font-black uppercase transition-all">Close</button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project Title</label>
                                    <input 
                                        required
                                        className="w-full h-14 bg-zinc-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 ring-black transition-all text-black"
                                        placeholder="e.g. MNC Logo Collection"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</label>
                                    <select 
                                        className="w-full h-14 bg-zinc-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 ring-black transition-all text-black"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option>Photo Editing</option>
                                        <option>Video Editing</option>
                                        <option>PPT Designing</option>
                                        <option>Website Creation</option>
                                        <option>App Building</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Thumbnail URL</label>
                                <input 
                                    required
                                    className="w-full h-14 bg-zinc-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 ring-black transition-all text-black"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Short Description</label>
                                <textarea 
                                    className="w-full p-6 bg-zinc-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-black transition-all h-32 text-black"
                                    placeholder="Describe the project..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <button className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all mt-4">
                                Publish Project
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjects;
