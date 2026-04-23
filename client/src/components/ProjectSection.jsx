import { useState, useEffect } from 'react';
import axios from 'axios';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Video, Presentation, Globe, Smartphone, Folder, X, Sparkles } from 'lucide-react';

const ProjectSection = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cmsContent, setCmsContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCmsWork();
    }, []);

    const fetchCmsWork = async () => {
        try {
            const { data } = await axios.get('https://dapn-web.vercel.app/api/admin/content/all');
            setCmsContent(data.data);
        } catch (error) {
            console.error('CMS Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        {
            name: 'Recent Studio Work',
            icon: <Sparkles size={22} className="text-emerald-500" />,
            description: 'Latest high-end assets deployed from the Admin Vault.',
            type: 'gallery',
            image: cmsContent[0]?.fileUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
            items: cmsContent.map(item => ({
                id: item._id,
                title: item.title,
                url: item.fileUrl,
                type: item.type,
                external: item.externalLink
            }))
        },
        {
            name: 'Photo Editing',
            icon: <ImageIcon size={22} />,
            description: 'Professional color grading and retouching.',
            type: 'gallery',
            image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800',
            items: [
                { id: 1, title: 'Johnny Stale Life', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e' },
                { id: 2, title: 'RAW Style Edit', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' }
            ]
        },
        {
            name: 'Video Editing',
            icon: <Video size={22} />,
            description: 'High-impact motion graphics and montages.',
            type: 'gallery',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
            items: [
                { id: 1, title: 'Achromatic Motion', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f' },
                { id: 2, title: 'HEY YOU Campaign', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279' }
            ]
        },
        {
            name: 'Website Creation',
            icon: <Globe size={22} />,
            description: 'Next.js powered responsive experiences.',
            type: 'link',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
            url: 'https://tn28apparels.com/?v=11.0'
        },
        {
            name: 'App Building',
            icon: <Smartphone size={22} />,
            description: 'Native-feel mobile applications.',
            type: 'link',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
            url: 'https://dapnix.app'
        }
    ];

    const handleCategoryClick = (cat) => {
        if (cat.type === 'link') {
            window.open(cat.url, '_blank');
        } else {
            setSelectedCategory(cat);
        }
    };

    return (
        <section 
            id="projects" 
            className="py-32 px-6 relative overflow-hidden"
            style={{ 
                backgroundImage: "url('/section_bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="mb-24">
                    <h2 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-300 mb-4 font-mono">Portfolio</h2>
                    <h3 className="text-6xl font-black tracking-tighter text-black uppercase italic">Mastering the Digital Craft.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => handleCategoryClick(cat)}
                            className="group bg-zinc-50 rounded-[40px] overflow-hidden shadow-sm border border-zinc-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                        >
                            {/* Realistic Showcase Image */}
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm">
                                    {cat.icon}
                                </div>
                            </div>

                            {/* Portfolio Content */}
                            <div className="p-8">
                                <h4 className="text-xl font-black tracking-tighter text-black mb-1 group-hover:text-blue-500 transition-colors uppercase">{cat.name}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                    {cat.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">
                                    {cat.type === 'link' ? <ExternalLink size={14} /> : <Folder size={14} />}
                                    <span>{cat.type === 'link' ? 'Launch URL' : 'Enter Archive'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Folder-Style Gallery Modal */}
            <AnimatePresence>
                {selectedCategory && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-white/95 backdrop-blur-3xl w-full max-w-5xl rounded-[50px] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border border-white/20"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                                        {selectedCategory.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black tracking-tighter text-black uppercase italic">{selectedCategory.name}</h4>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Project Archive</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedCategory(null)}
                                    className="w-12 h-12 bg-zinc-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Gallery Grid */}
                            <div className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 scrollbar-hide">
                                {selectedCategory.items?.map((item) => (
                                    <div key={item.title} className="group relative aspect-square bg-zinc-100 rounded-[40px] overflow-hidden">
                                        <NextImage 
                                            src={item.url} 
                                            alt={item.title} 
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                                            <h5 className="text-white font-black text-2xl tracking-tighter uppercase italic">{item.title}</h5>
                                            <div className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mt-4 px-4 py-2 bg-white/10 w-fit rounded-full border border-white/10 backdrop-blur">
                                                Archive Ref: {item.id}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.8em] text-zinc-300">
                                Protected Ecosystem &copy; 2026 Dapnix
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProjectSection;
