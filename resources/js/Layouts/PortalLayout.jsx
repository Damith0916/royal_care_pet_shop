import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, PawPrint, FileText, LogOut, ChevronLeft } from 'lucide-react';

export default function PortalLayout({ children, owner, clinic }) {
    const { url } = usePage();

    const NavItem = ({ href, icon: Icon, label }) => {
        const isActive = url === href || url.startsWith(href) && href !== `/portal/${owner.id}`;
        return (
            <Link
                href={href}
                className={`flex flex-col items-center gap-1.5 px-6 py-2 transition-all duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}
            >
                <div className={`relative ${isActive ? 'scale-110' : ''}`}>
                    <Icon size={24} />
                    {isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                    )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 h-16 flex items-center px-6 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <PawPrint size={18} />
                    </div>
                    <span className="text-lg font-black tracking-tight text-gray-900 truncate max-w-[150px]">
                        {clinic?.name || 'Smart PetCare'}
                    </span>
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <LogOut size={18} />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20 pb-24 px-6 max-w-lg mx-auto w-full">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-6 inset-x-6 h-16 bg-white shadow-2xl shadow-blue-500/10 rounded-[28px] border border-gray-100 flex items-center justify-around z-50 overflow-hidden">
                <NavItem href={`/portal/${owner.id}`} icon={Home} label="Home" />
                <NavItem href={`/portal/${owner.id}/records`} icon={PawPrint} label="Health" />
                <NavItem href={`/portal/${owner.id}/invoices`} icon={FileText} label="Bills" />
            </nav>
        </div>
    );
}
