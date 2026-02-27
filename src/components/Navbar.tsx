'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ShieldCheck, LogOut, LayoutDashboard, UploadCloud } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        setToken(Cookies.get('token') || null);
    }, [pathname]);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setToken(null);
        router.push('/');
    };

    if (!isMounted) return null;

    return (
        <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            FinGuardian <span className="text-blue-600">AI</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {token ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center transition-colors">
                                    <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                                </Link>
                                <Link href="/upload" className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center transition-colors">
                                    <UploadCloud className="w-4 h-4 mr-1" /> Analyze
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center transition-colors ml-4"
                                >
                                    <LogOut className="w-4 h-4 mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
