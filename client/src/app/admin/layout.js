'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Briefcase, 
    CalendarCheck, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    X,
    Shield,
    BarChart3,
    MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminLayout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(userInfo);
        if (user.role !== 'admin') {
            router.push('/home');
            return;
        }

        setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
        { name: 'Analytics', icon: <BarChart3 size={20} />, href: '/admin/analytics' },
        { name: 'Messages', icon: <MessageSquare size={20} />, href: '/admin/messages' },
        { name: 'Bookings', icon: <CalendarCheck size={20} />, href: '/admin/bookings' },
        { name: 'Payments', icon: <Shield size={20} />, href: '/admin/payments' },
        { name: 'Users', icon: <Users size={20} />, href: '/admin/users' },
    ];

    return (
        <div className="min-h-screen bg-white flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-zinc-50 border-r border-zinc-100 text-black flex-col py-10 px-6 fixed h-full z-50">
                <div className="flex items-center gap-3 mb-16 px-4">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10">
                        <Shield size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter">DAPNIX</h1>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Admin Console</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                                    isActive 
                                    ? 'bg-black text-white shadow-xl shadow-black/10 translate-x-1' 
                                    : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-zinc-100 pt-10 px-4">
                    <div className="p-6 bg-zinc-100/50 rounded-3xl border border-zinc-200/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">System Load</p>
                        <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[12%]" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col bg-white">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center text-black"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="font-black tracking-tighter text-xl uppercase italic">
                                {navItems.find(item => item.href === pathname)?.name || 'Control Panel'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end border-r border-zinc-100 pr-6">
                            <span className="text-sm font-black">Malineni Rahul Sai</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Super Admin
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('userInfo');
                                    window.location.href = '/login';
                                }}
                                className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all group"
                                title="Sign Out"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-black/10">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <div className="p-8 lg:p-12 max-w-[1600px] w-full mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden transition-all">
                    <motion.div 
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        className="w-72 h-full bg-white flex flex-col p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-12">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                                    <Shield size={18} />
                                </div>
                                <h1 className="text-lg font-black tracking-tighter text-black">DAPNIX</h1>
                            </div>
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="text-black"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm ${
                                        pathname === item.href ? 'bg-black text-white' : 'text-zinc-500'
                                    }`}
                                >
                                    {item.icon} {item.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
