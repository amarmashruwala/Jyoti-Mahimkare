import type {Metadata} from 'next';
import {Playfair_Display, Montserrat} from 'next/font/google';
import './globals.css'; // Global styles

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jyoti Mahimkar | Soulful Vocalist',
  description: 'Official portfolio website for Jyoti Mahimkar. Soulful Renditions of Classic Melodies.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-body text-[#ede0df] bg-[#0F0F0F] min-h-screen antialiased selection:bg-[#D4AF37] selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
