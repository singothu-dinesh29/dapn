import Link from 'next/link';
import { Mail, Phone, Globe, MessageSquare, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-black pt-40 pb-20 overflow-hidden">
            {/* Cinematic Night Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[0.5]"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600')" }}
            >
                {/* Deep Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                    
                    {/* Left Side: Brand */}
                    <div className="md:col-span-4">
                        <div className="flex flex-col gap-10">
                            <Link href="/home" className="flex items-center group w-fit">
                                <img 
                                    src="/official_logo.png" 
                                    alt="Dapnix Logo" 
                                    className="h-12 w-auto object-contain transition-all group-hover:scale-105"
                                />
                            </Link>
                            <p className="text-white/40 text-lg leading-relaxed max-w-sm font-medium">
                                Building the definitive ecosystem for digital artisans. We merge creativity with technology to empower the next generation of global impact.
                            </p>
                            
                            {/* Social Icons */}
                            <div className="flex gap-4">
                                {[
                                    { icon: <Mail size={20} />, href: '#' },
                                    { icon: <Phone size={20} />, href: '#' },
                                    { icon: <MessageSquare size={20} />, href: '#' },
                                    { icon: <Send size={20} />, href: '#' }
                                ].map((social, idx) => (
                                    <a 
                                        key={idx} 
                                        href={social.href}
                                        className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:bg-white hover:text-black transition-all shadow-2xl"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Links */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/60">Company</h4>
                        <ul className="space-y-5 text-sm font-bold text-white/30">
                            <li><Link href="/home#about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/home#contact" className="hover:text-white transition-colors">Founders</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Career</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/60">Resources</h4>
                        <ul className="space-y-5 text-sm font-bold text-white/30">
                            <li><Link href="/home#projects" className="hover:text-white transition-colors">Portfolio</Link></li>
                            <li><Link href="/home#services" className="hover:text-white transition-colors">Service List</Link></li>
                            <li><Link href="/home#booking" className="hover:text-white transition-colors">Book a Slot</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/60">Legal</h4>
                        <ul className="space-y-5 text-sm font-bold text-white/30">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4 text-white/20">
                        <Globe size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Creative Network</span>
                    </div>
                    
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                        &copy; 2026 DAPNIX.CREATORS. ALL RIGHTS RESERVED.
                    </p>
                    
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 text-right">
                        Designed for <br className="md:hidden" /> Worldwide Impact
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
