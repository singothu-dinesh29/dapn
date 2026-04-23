'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RootGatekeeper() {
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            // Already authenticated -> Check if seen envelope
            const hasSeen = localStorage.getItem('hasSeenEnvelope');
            if (hasSeen === 'true') {
                router.push('/home');
            } else {
                router.push('/welcome-envelope');
            }
        } else {
            // Unauthenticated -> Force Login
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center animate-spin">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 animate-pulse">
                Synchronizing Session
            </div>
        </div>
    );
}
