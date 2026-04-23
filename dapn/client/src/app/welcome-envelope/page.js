'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '@/components/Envelope';
import PremiumLetter from '@/components/PremiumLetter';
import { Volume2, VolumeX, X } from 'lucide-react';

export default function WelcomeEnvelopePage() {
    const router = useRouter();
    const [isOpened, setIsOpened] = useState(false);
    const [user, setUser] = useState({ name: 'Guest' });
    const [soundOn, setSoundOn] = useState(false);

    useEffect(() => {
        // Authenticate check
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            router.push('/login');
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userInfo);
            setUser({ name: parsedUser.name || 'Creative' });
        } catch (e) {
            console.error('Failed to parse user info');
        }
        
        // Optional: Skip if seen before (Disabled for now so user can enjoy the new feature)
        // const hasSeen = localStorage.getItem('hasSeenEnvelope');
        // if (hasSeen === 'true') router.push('/home');
    }, [router]);

    const handleOpen = () => {
        setIsOpened(true);
        localStorage.setItem('hasSeenEnvelope', 'true');
        
        // Auto-redirect after 15 seconds (giving time for typewriter + reading)
        const autoRedirect = setTimeout(() => {
            router.push('/home');
        }, 15000);

        return () => clearTimeout(autoRedirect);
    };

    const handleSkip = () => {
        localStorage.setItem('hasSeenEnvelope', 'true');
        router.push('/home');
    };

    return (
        <div className="relative min-h-screen bg-[#fdfbf6] flex flex-col items-center justify-center p-6 overflow-hidden select-none">
            {/* Minimal Golden Background Layout */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-[#fdfbf6] to-amber-50" />
                
                {/* Golden Animated Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-600/10 rounded-full"
                        initial={{ 
                            x: Math.random() * 100 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: Math.random()
                        }}
                        animate={{ 
                            y: [null, "-100%"],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: Math.random() * 10 + 10, 
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}

                {/* Subtle Amber Lens Flare */}
                <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[180px] animate-pulse" />
            </div>

            {/* Premium Utility Controls */}
            <div className="absolute top-10 right-10 z-[200] flex items-center gap-6">
                <button 
                    onClick={() => setSoundOn(!soundOn)}
                    className="w-12 h-12 flex items-center justify-center bg-black/5 backdrop-blur-xl border border-black/5 rounded-full text-zinc-900/40 hover:text-black transition-all hover:bg-black/10"
                >
                    {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                <button 
                    onClick={handleSkip}
                    className="group flex items-center gap-3 bg-black/5 backdrop-blur-xl border border-black/5 px-6 py-3 rounded-full text-zinc-900/40 hover:text-black transition-all hover:bg-black/10"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Skip</span>
                    <X size={14} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Branded Content Container */}
            <div className="relative z-10 w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center mb-16"
                >
                    <img 
                        src="/official_logo.png" 
                        alt="Dapnix Logo" 
                        className="h-20 w-auto object-contain drop-shadow-[0_0_40px_rgba(184,134,11,0.2)] mb-10"
                    />
                    <div className="space-y-4 text-center">
                        <h1 className="text-[10px] font-black uppercase tracking-[1.2em] text-amber-900/40 font-mono translate-x-[0.6em]">Authorized Portal Access</h1>
                        <h2 className="text-4xl md:text-7xl font-black text-amber-950 tracking-tighter italic uppercase font-playfair drop-shadow-sm">Welcome back, {user.name.split(' ')[0]}.</h2>
                    </div>
                </motion.div>

                {/* Golden Interaction Zone */}
                <div className="mt-12">
                    <Envelope onOpen={handleOpen} username={user.name}>
                        <PremiumLetter username={user.name} />
                    </Envelope>
                </div>
            </div>

            {/* Minimal Ambient Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-amber-950/20 text-[9px] font-black uppercase tracking-[0.8em]"
            >
                Dapnix &copy; 2026 • Curated Creative Ecosystem
            </motion.div>
        </div>
    );
}
