'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSlider from '@/components/HeroSlider';
import Envelope from '@/components/Envelope';
import ProjectSection from '@/components/ProjectSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import BookingSection from '@/components/BookingSection';
import FounderSection from '@/components/FounderSection';
import LiveTracking from '@/components/LiveTracking';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/login');
    }
  }, [router]);
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSlider />
      
      {/* Live Tracking Core */}
      <LiveTracking />

      {/* Featured Interaction Section Refactored with Anime Background */}
      <section className="relative py-40 overflow-hidden min-h-[800px] flex items-center">
        {/* Anime Background (Image 2) */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600')" }} // Re-using the premium creative workspace as it fits best for 'Delivering Value'
        >
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
            <div>
                <h2 className="text-sm uppercase tracking-[0.6em] font-black text-white/40 mb-6 font-mono">Interactive Experience</h2>
                <h3 className="text-6xl font-black tracking-tighter text-white mb-8 max-w-md uppercase italic leading-[0.9]">
                    Delivering <br /> 
                    <span className="text-white/20">Value in Every</span> <br /> 
                    Message.
                </h3>
                <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-sm">
                    Our platform uses high-end animations to make every interaction feel premium. The "Envelope" system signifies our commitment to professional results.
                </p>
                <ul className="space-y-8">
                    <li className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-black text-white text-xl tracking-tighter uppercase">Tailored Aesthetics</h4>
                            <p className="text-sm text-white/40 mt-1">Every portfolio is a work of art, designed to impress at first glance.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <div>
                            <h4 className="font-black text-white text-xl tracking-tighter uppercase">High Performance</h4>
                            <p className="text-sm text-white/40 mt-1">Built on Next.js for lightning-fast speeds and optimal global delivery.</p>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end">
                <div className="relative group">
                    {/* Floating Glow behind Envelope */}
                    <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full scale-150 animate-pulse" />
                    
                    <Envelope>
                        <div className="space-y-6">
                            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-300">New Message</div>
                            <h4 className="text-3xl font-black text-black tracking-tighter">Your Future Starts Here.</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Join thousands of creators who have found their professional home at Dapnix. We handle the bookings; you focus on the creativity.
                            </p>
                            <div className="h-[1px] bg-zinc-100 w-full" />
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status: Available</span>
                                <span className="text-[10px] font-black text-black border-b-2 border-black tracking-widest uppercase cursor-pointer hover:text-zinc-600 hover:border-zinc-600 transition-all">Open Platform</span>
                            </div>
                        </div>
                    </Envelope>
                </div>
            </div>
        </div>
      </section>

      <ServicesSection />
      <ProjectSection />
      <AboutSection />
      <BookingSection />
      <FounderSection />
    </div>
  );
}
