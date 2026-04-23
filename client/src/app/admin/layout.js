'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    CreditCard, 
    Users, 
    PlusCircle, 
    LogOut, 
    ShieldCheck, 
    Menu, 
    X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/dashboard-secure-9x7k');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Revenue', icon: CreditCard, path: '/admin/revenue' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Add Content', icon: PlusCircle, path: '/admin/content' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/dashboard-secure-9x7k');
    };

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside 
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed lg:relative z-50 w-72 h-screen bg-zinc-900/50 border-r border-zinc-800/50 backdrop-blur-3xl flex flex-col p-8"
                    >
                        <div className="flex items-center gap-3 mb-16 px-2">
                            <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center font-black italic shadow-xl shadow-white/10">
                                D.
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Admin</h1>
                                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1 flex items-center gap-1">
                                    <ShieldCheck size={8} /> Secure Core
                                </p>
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link 
                                        key={item.path} 
                                        href={item.path}
                                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group ${
                                            isActive 
                                            ? 'bg-white text-black shadow-2xl shadow-white/10' 
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <item.icon size={18} className={isActive ? 'text-black' : 'group-hover:text-white'} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <button 
                            onClick={handleLogout}
                            className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
                        >
                            <LogOut size={18} />
                            Terminate
                        </button>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                <header className="lg:hidden p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-zinc-800">
                    <div className="font-black italic tracking-tighter">DAPNIX.</div>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>
                <div className="p-8 lg:p-16 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
