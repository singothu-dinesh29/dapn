'use client';
import { motion } from 'framer-motion';
import { Target, Eye, Flag, ShieldCheck } from 'lucide-react';
import ReviewSection from './ReviewSection';

const AboutSection = () => {
    const coreValues = [
        {
            id: 'mission',
            title: 'Our Mission',
            icon: <Target className="text-black" size={24} />,
            text: 'To provide a premium ecosystem where high-end creators can showcase their mastery and connect with global clients with absolute trust.'
        },
        {
            id: 'vision',
            title: 'Our Vision',
            icon: <Eye className="text-black" size={24} />,
            text: 'To become the world’s most trusted standard for elite digital services, merging artistic creativity with corporate-level reliability.'
        },
        {
            id: 'goals',
            title: 'Key Goals',
            icon: <Flag className="text-black" size={24} />,
            text: 'Simplifying the creative workflow, standardizing high-quality delivery, and amplifying the voices of digital artisans everywhere.'
        }
    ];

    const benefits = [
        'Secure Payment Escrow',
        'Verified Creator Network',
        'automated Slot Management',
        'Direct Client Communication',
        'High-Resolution Portfolios',
        'Standardized Project Handover'
    ];

    return (
        <section id="about" className="py-32 bg-zinc-50 px-6 border-t border-zinc-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Left: Philosophy */}
                    <div className="lg:w-1/2">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-300 mb-6">Our Philosophy</h2>
                        <h3 className="text-5xl font-black tracking-tighter text-black mb-10 leading-[0.9]">
                            DAPNIX <br /> <span className="text-zinc-300">IS THE FUTURE.</span>
                        </h3>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-md mb-12">
                            We believe that creativity should not be hindered by administrative complexity. Dapnix.creators was built to bridge the gap between artistic genius and professional execution.
                        </p>
                        
                        <div className="grid grid-cols-1 gap-12">
                            {coreValues.map((value) => (
                                <div key={value.id} className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 flex-shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                                        {value.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black tracking-tighter mb-2">{value.title}</h4>
                                        <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                                            {value.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Benefits & Visual */}
                    <div className="lg:w-1/2">
                        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-zinc-100 h-full flex flex-col">
                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400 mb-8 font-mono">
                                <ShieldCheck size={16} className="text-black" /> Why Choose Dapnix?
                            </div>
                            
                            <h3 className="text-3xl font-black tracking-tighter mb-10">Unmatched Benefits for Every Stakeholder.</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-12">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                        {benefit}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-10 border-t border-zinc-50">
                                <div className="p-8 bg-zinc-50 rounded-3xl relative overflow-hidden group hover:bg-black transition-all">
                                    <div className="relative z-10">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-2">Platform Goal No. 1</p>
                                        <p className="text-lg font-black tracking-tighter leading-tight group-hover:text-white transition-colors">
                                            Empowering 1 Million <br /> Digital Artisans by 2030.
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Proof / Reviews Section */}
                <ReviewSection />
            </div>
        </section>
    );
};

export default AboutSection;
