'use client';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Mail } from 'lucide-react';

// Real Images Import
import dineshImg from '@/assets/founders/dinesh.jpg';
import pempalImg from '@/assets/founders/pempal.jpg';
import nithinImg from '@/assets/founders/nithin.png';
import aliImg from '@/assets/founders/ali.jpg';

const founders = [
    {
        name: 'Singothu Dinesh',
        role: 'Lead Architect',
        instagram: 'theonlydinesh',
        whatsapp: '9959259761',
        email: 'singothudinesh@gmail.com',
        image: dineshImg
    },
    {
        name: 'Pem pal',
        role: 'Creative Director',
        instagram: 'lapmerp',
        whatsapp: '6304421057',
        email: 'palprem74201@gmail.com',
        image: pempalImg
    },
    {
        name: 'Ali Ahammad',
        role: 'Operations Head',
        instagram: 'ahammadshaikalibhai',
        whatsapp: '9849314891',
        email: 'shaikalibhai9895@gmail.com',
        image: aliImg
    },
    {
        name: 'Nithin',
        role: 'Tech Lead',
        instagram: 'devil_rider_nithin_46',
        whatsapp: '9618037025',
        email: 'nithinveenni@gmail.com',
        image: nithinImg
    }
];

const FounderSection = () => {
    return (
        <section id="contact" className="relative py-40 px-3 overflow-hidden">
            {/* HD Anime-Style Studio Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600')" }} // Anime/Studio atmosphere URL
            >
                {/* Dark Cinematic Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-sm font-black uppercase tracking-[0.5em] text-white/40 mb-4 font-mono"
                    >
                        The Visionaries
                    </motion.h2>
                    <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black tracking-tighter text-white italic uppercase"
                    >
                        FOUNDERS.
                    </motion.h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {founders.map((founder, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative backdrop-blur-xl bg-white/5 rounded-[45px] p-2 overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/30"
                        >
                            {/* Profile Image */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px]">
                                <NextImage 
                                    src={founder.image} 
                                    alt={founder.name} 
                                    fill
                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>

                            {/* Info */}
                            <div className="p-8 text-center">
                                <h4 className="text-xl font-black tracking-tighter text-white mb-1 group-hover:text-blue-400 transition-colors uppercase">{founder.name}</h4>
                                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30 mb-6">{founder.role}</p>
                                
                                <div className="flex justify-center gap-4">
                                    <a 
                                        href={`https://instagram.com/${founder.instagram}`} 
                                        target="_blank"
                                        className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-all shadow-lg"
                                    >
                                        <Globe size={18} />
                                    </a>
                                    <a 
                                        href={`https://wa.me/91${founder.whatsapp}`} 
                                        target="_blank"
                                        className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-all shadow-lg"
                                    >
                                        <MessageSquare size={18} />
                                    </a>
                                    <a 
                                        href={`mailto:${founder.email}`} 
                                        className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-all shadow-lg"
                                    >
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FounderSection;
