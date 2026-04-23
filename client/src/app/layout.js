import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  title: {
    default: 'Dapnix v2 | Premium Artisan Ecosystem',
    template: '%s | Dapnix.creators'
  },
  description: 'The elite platform for professional creative services. Showcase your portfolio and manage direct bookings with our state-of-the-art creator ecosystem.',
  keywords: ['creative services', 'portfolio', 'video editing', 'photo editing', 'web design', 'booking system', 'creators'],
  authors: [{ name: 'Dapnix Team' }],
  creator: 'Dapnix.creators',
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} scroll-smooth`}>
        <Toaster position="top-right" reverseOrder={false} />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
