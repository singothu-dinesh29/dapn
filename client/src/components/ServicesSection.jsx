'use client';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Presentation, Globe, Smartphone, FolderOpen, ExternalLink } from 'lucide-react';

const services = [
    { 
        name: 'Photo Editing', 
        description: 'Professional color grading and retouching.',
        icon: <ImageIcon size={20} />, 
        color: 'bg-blue-50',
        text: 'View Gallery',
        linkIcon: <FolderOpen size={14} />,
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        name: 'Video Editing', 
        description: 'High-impact motion graphics and montages.',
        icon: <Video size={20} />, 
        color: 'bg-red-50',
        text: 'View Gallery',
        linkIcon: <FolderOpen size={14} />,
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
    },
    { 
        name: 'PPT Designing', 
        description: 'Corporate decks and investor pitches.',
        icon: <Presentation size={20} />, 
        color: 'bg-orange-50',
        text: 'View Gallery',
        linkIcon: <FolderOpen size={14} />,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    { 
        name: 'Website Creation', 
        description: 'Next.js powered responsive experiences.',
        icon: <Globe size={20} />, 
        color: 'bg-emerald-50',
        text: 'Open URL',
        linkIcon: <ExternalLink size={14} />,
        url: 'https://tn28apparels.com/?v=11.0',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800'
    },
    { 
        name: 'App Building', 
        description: 'Native-feel mobile applications.',
        icon: <Smartphone size={20} />, 
        color: 'bg-purple-50',
        text: 'Open URL',
        linkIcon: <ExternalLink size={14} />,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'
    },
];

const ServicesSection = () => {
    return (
        <section 
            id="services" 
            className="py-32 px-6 relative overflow-hidden"
            style={{ 
                backgroundImage: "url('/section_bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-300 mb-4 font-mono">Our Expertise</h2>
                    <h3 className="text-6xl font-black tracking-tighter text-black">Services Designed for Impact.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {services.map((service, idx) => (
                        <motion.div
                            key={service.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            onClick={() => {
                                if (service.url) {
                                    window.open(service.url, '_blank');
                                } else {
                                    const projectsSection = document.getElementById('projects');
                                    if (projectsSection) {
                                        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } else {
                                        // Fallback if ID is missing
                                        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                                    }
                                }
                            }}
                            className="group bg-zinc-50 rounded-[40px] overflow-hidden shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-500 cursor-pointer"
                        >
                            {/* Role Visual (Always Displayed) */}
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img 
                                    src={service.image} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm">
                                    {service.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h4 className="text-xl font-black tracking-tighter text-black mb-3">{service.name}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                    {service.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 group cursor-pointer hover:text-black transition-colors">
                                    {service.linkIcon}
                                    <span>{service.text}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
