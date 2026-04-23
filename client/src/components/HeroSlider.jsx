'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
        title: 'CRAFTING DIGITAL EXCELLENCE',
        tagline: 'Leading the future of creative service delivery with premium precision.',
        cta: 'Explore Projects'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000',
        title: 'INNOVATIVE SOLUTIONS',
        tagline: 'Empowering creators with a state-of-the-art ecosystem for growth.',
        cta: 'View Services'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=2000',
        title: 'MINIMALISM MEETS MASTERY',
        tagline: 'Simplifying complex workflows through design-first architecture.',
        cta: 'Start Booking'
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] scale-110"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-white text-xs font-black tracking-[0.5em] mb-6 uppercase">
                            Dapnix Agency
                        </h2>
                        <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            {slides[current].title}
                        </h1>
                        <p className="text-zinc-300 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                            {slides[current].tagline}
                        </p>
                        <button className="h-16 px-10 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-4 hover:bg-zinc-200 transition-all group">
                            {slides[current].cta} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                <button 
                    onClick={prevSlide}
                    className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={nextSlide}
                    className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-12 z-20 flex gap-3">
                {slides.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-1 transition-all duration-500 rounded-full ${idx === current ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
