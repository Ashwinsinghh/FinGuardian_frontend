import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import FunnyChatbot from '@/components/FunnyChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinGuardian AI – Financial Contract Simplifier',
  description: 'Understand Insurance and Loan Documents in Seconds with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col relative`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <FunnyChatbot />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
