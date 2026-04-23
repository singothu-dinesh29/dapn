'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const ClientLayoutWrapper = ({ children }) => {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminPath && <Navbar />}
            <main className={`${!isAdminPath ? 'pt-20' : ''} min-h-screen`}>
                {children}
            </main>
            {!isAdminPath && <Footer />}
        </>
    );
};

export default ClientLayoutWrapper;
