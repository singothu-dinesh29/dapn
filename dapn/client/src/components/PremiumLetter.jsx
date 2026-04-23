'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from './TypewriterText';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PremiumLetter = ({ username }) => {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);

    const motivationalLines = [
        "Welcome.",
        "Not to a platform… But to a new version of yourself.",
        "Every expert was once unknown. Every winner was once doubted. Today, you begin anyway.",
        "\"You didn’t come this far just to stay the same.\"",
        "This is your moment.",
        "Build. Grow. Become."
    ];

    // Show button after 7 seconds (approx time for typewriter)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full flex flex-col justify-between font-inter">
            <div className="space-y-12">
                {/* Header */}
                <div className="flex justify-between items-start pt-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Authorized Presence</p>
                        <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{username}</h3>
                    </div>
                    <div className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        Ref: DP-2026-HQ
                    </div>
                </div>

                {/* Content */}
                <div className="font-playfair italic">
                    <TypewriterText texts={motivationalLines} speed={35} delayAfterLine={600} />
                </div>
            </div>

            {/* Exit Action */}
            <div className="mt-auto pt-10">
                <AnimatePresence>
                    {showButton && (
                        <motion.button
                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 1 }}
                            onClick={() => router.push('/home')}
                            className="group flex items-center gap-4 bg-black text-white px-8 py-5 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Enter Dashboard</span>
                            <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    )}
                </AnimatePresence>
                
                {/* Footer Mark */}
                <div className="mt-8 flex items-center gap-3 text-zinc-200">
                    <div className="w-8 h-[1px] bg-zinc-100" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.6em]">Dapnix Ecosystem</span>
                </div>
            </div>
        </div>
    );
};

export default PremiumLetter;
