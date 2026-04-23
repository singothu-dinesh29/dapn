'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Envelope = ({ children, onOpen, username = "Guest" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHeartClicked, setIsHeartClicked] = useState(false);

    const handleOpen = () => {
        if (isHeartClicked) return;
        setIsHeartClicked(true);
        setTimeout(() => {
            setIsOpen(true);
            if (onOpen) onOpen();
        }, 300);
    };

    // Animation Variants
    const flapVariants = {
        closed: { rotateX: 0, zIndex: 10 },
        open: { 
            rotateX: 180, 
            zIndex: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        }
    };

    const letterVariants = {
        closed: { y: 20, zIndex: 1, scale: 0.95, opacity: 0 },
        open: { 
            y: -240, 
            zIndex: 40, 
            scale: 1,
            opacity: 1,
            transition: { 
                delay: 0.8, 
                duration: 1, 
                ease: [0.16, 1, 0.3, 1] // Premium ease
            } 
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center perspective-[1500px]">
             {/* Backdrop Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                className="relative w-[340px] h-[220px] md:w-[450px] md:h-[280px]"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                {/* Envelope Back / Base */}
                <div className="absolute inset-0 bg-[#fdfdfd] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-zinc-200/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50/30 to-zinc-100/50" />
                    {/* Interior Pattern (Subtle) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
                </div>

                {/* Letter Content (Slides out) */}
                <motion.div 
                    className="absolute inset-x-4 md:inset-x-8 top-4 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-lg p-6 md:p-10 border border-zinc-100 min-h-[400px] md:min-h-[500px]"
                    variants={letterVariants}
                    animate={isOpen ? "open" : "closed"}
                >
                    <div className="relative h-full text-left">
                        {children}
                    </div>
                </motion.div>

                {/* Front Components (Sides and Bottom) */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
                    {/* Bottom Flap */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-[65%] bg-[#fafafa] shadow-[0_-15px_30px_rgba(0,0,0,0.02)] border-t border-zinc-100/50"
                        style={{ clipPath: 'polygon(0 100%, 50% 25%, 100% 100%)' }}
                    />
                    
                    {/* Side Flaps */}
                    <div 
                        className="absolute inset-y-0 left-0 w-1/2 bg-[#f8f8f8]"
                        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                    />
                    <div 
                        className="absolute inset-y-0 right-0 w-1/2 bg-[#f8f8f8]"
                        style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
                    />
                </div>

                {/* Top Flap */}
                <motion.div 
                    className="absolute top-0 left-0 right-0 h-1/2 bg-[#f3f3f3] origin-top z-30 shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }}
                    variants={flapVariants}
                    animate={isOpen ? "open" : "closed"}
                />

                {/* Heart Action Button ❤️ */}
                {!isOpen && (
                    <motion.button 
                        onClick={handleOpen}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,0,0,0.15)] border-4 border-white transition-all hover:scale-110 active:scale-95"
                        initial={{ scale: 1 }}
                        animate={{ 
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                "0 10px 40px rgba(255,0,0,0.15)",
                                "0 10px 60px rgba(255,0,0,0.3)",
                                "0 10px 40px rgba(255,0,0,0.15)"
                            ]
                        }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-4xl select-none" role="img" aria-label="heart">❤️</span>
                    </motion.button>
                )}

                {/* Receiver Info */}
                {!isOpen && (
                    <div className="absolute bottom-10 left-10 z-[50] space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">For:</div>
                        <div className="text-sm font-black text-black italic font-playfair">{username}</div>
                    </div>
                )}
            </motion.div>
            
            {/* Status Prompt */}
            {!isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500 animate-pulse"
                >
                    Tap the Heart to Unveil
                </motion.div>
            )}
        </div>
    );
};

export default Envelope;
