'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, LogOut, Settings, Package, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);

    // Handle scroll effect and user state
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        const checkUser = () => {
            const userInfo = localStorage.getItem('userInfo');
            const savedAvatar = localStorage.getItem('userAvatar');
            
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setUser(prev => JSON.stringify(prev) !== JSON.stringify(parsedUser) ? parsedUser : prev);
            } else {
                setUser(null);
            }

            if (savedAvatar) {
                setAvatar(savedAvatar);
            }
        };

        checkUser();
        const interval = setInterval(checkUser, 1000);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', checkUser);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkUser);
            clearInterval(interval);
        };
    }, []);

    const navLinks = [
        { name: 'HOME', href: '/home' },
        { name: 'PROJECT', href: '/home#projects' },
        { name: 'SERVICES', href: '/home#services' },
        { name: 'ABOUT', href: '/home#about' },
        { name: 'BOOKING', href: '/home#booking' },
        { name: 'CONNECT', href: '/home#contact' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-4' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/home" className="flex items-center group">
                    <img 
                        src="/official_logo.png" 
                        alt="Dapnix Logo" 
                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-[10px] font-black tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    {!user ? (
                        <Link 
                            href="/login" 
                            className="text-[10px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="relative">
                            <button 
                                onClick={toggleProfile}
                                className="flex items-center gap-2 group outline-none"
                            >
                                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 group-hover:bg-zinc-200 transition-colors overflow-hidden">
                                    <img src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                                </div>
                                <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-12 right-0 w-64 bg-white border border-zinc-100 rounded-[32px] shadow-2xl py-6 px-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="px-4 pb-6 mb-4 border-b border-zinc-50 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 overflow-hidden shadow-sm">
                                            <img src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-black uppercase tracking-tight text-black truncate">{user.name}</p>
                                            <p className="text-[9px] font-black text-zinc-400 truncate uppercase tracking-widest">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Link href="/my-bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all">
                                            <div className="flex items-center gap-3">
                                                <Package size={14} /> My Bookings
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </Link>
                                        
                                        <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all">
                                            <Settings size={14} /> Account Settings
                                        </Link>

                                        <div className="h-[1px] bg-zinc-50 my-2 mx-4" />

                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <Link href="/register" className="h-10 px-6 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={toggleMenu}
                    className="lg:hidden w-10 h-10 flex items-center justify-center text-black"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-100 py-8 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-black tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-[1px] bg-zinc-100 my-2" />
                    {user ? (
                        <>
                            <Link 
                                href="/my-bookings"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-3"
                            >
                                <Package size={18} /> My Bookings
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-3"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link 
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-bold uppercase tracking-widest text-black"
                        >
                            Login
                        </Link>
                    )}
                    <Link 
                        href="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="h-14 w-full bg-black text-white text-sm font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center shadow-lg"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
