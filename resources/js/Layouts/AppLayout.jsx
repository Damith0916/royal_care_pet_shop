import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    PawPrint,
    Users,
    Stethoscope,
    Settings,
    LogOut,
    Search,
    Bell,
    Menu,
    X,
    ChevronDown,
    Folder,
    Trash2,
    RefreshCw,
    Package,
    CreditCard,
    Activity,
    BarChart3
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${active
            ? 'bg-blue-50 text-primary-blue'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <Icon size={18} className={`${active ? 'text-primary-blue' : 'text-slate-500 group-hover:text-primary-blue'} shrink-0 transition-colors`} />
        {!collapsed && <span className={`text-sm font-bold tracking-tight ${active ? 'text-primary-blue' : ''}`}>{label}</span>}
        {active && !collapsed && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-blue rounded-l-full shadow-[0_0_12px_rgba(16,98,255,0.4)]" />
        )}
    </Link>
);

export default function AppLayout({ children, title, header: customHeader, mainClassName }) {
    const { auth, clinic } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const currentRoute = window.location.pathname;

    // Auto-collapse sidebar on New Case page to maximize space
    React.useEffect(() => {
        if (currentRoute.startsWith('/new-case')) {
            setSidebarCollapsed(true);
        }
    }, [currentRoute]);

    React.useEffect(() => {
        const toggleSidebar = () => {
            if (window.innerWidth < 1024) {
                setMobileMenuOpen(prev => !prev);
            } else {
                setSidebarCollapsed(prev => !prev);
            }
        };
        window.addEventListener('toggle-sidebar', toggleSidebar);
        return () => window.removeEventListener('toggle-sidebar', toggleSidebar);
    }, []);

    const clinicDisplayName = typeof clinic === 'string' ? clinic : (clinic?.name || 'Smart Pet Care');

    // Mock Notifications for UI demonstration
    const [notifications, setNotifications] = useState([
        { id: 2, title: 'Low Stock Alert', description: 'NexGard (Large) is below threshold.', time: '5h ago', read: false, link: '/inventory' },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const navItems = [
        { icon: Stethoscope, label: 'New Case', href: '/new-case' },
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: PawPrint, label: 'Pets', href: '/pets' },
        { icon: Users, label: 'Owners', href: '/owners' },
        { icon: Activity, label: 'Diagnoses', href: '/diagnoses' },
        { icon: Package, label: 'Inventory', href: '/inventory' },
        { icon: CreditCard, label: 'Billing', href: '/billing' },
        { icon: BarChart3, label: 'Reports', href: '/reports' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-app flex font-sans text-text-primary">
            {/* Sidebar Backdrop (Mobile) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 bg-white border-r border-border-gray transition-all duration-300 z-[70] flex flex-col 
                    ${sidebarCollapsed ? (currentRoute.startsWith('/new-case') ? 'w-0 -translate-x-full' : 'w-20') : 'w-64'}
                    ${mobileMenuOpen ? 'translate-x-0' : (sidebarCollapsed && currentRoute.startsWith('/new-case') ? '-translate-x-full' : 'translate-x-0')}
                `}
            >
                <div
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={`border-b border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors ${sidebarCollapsed ? 'py-4' : 'py-5 px-4'}`}
                >
                    <div className="flex flex-col items-center">
                        <img
                            src="/storage/smartpetcarelogo.png"
                            alt="Smart Pet Care Logo"
                            className={`${sidebarCollapsed ? 'h-8' : 'h-14'} w-auto object-contain mb-2 transition-all duration-300`}
                        />
                        {!sidebarCollapsed && (
                            <div className="text-center">
                                <span className="text-sm font-bold text-slate-900 leading-tight block">{clinicDisplayName}</span>
                                <span className="text-[10px] font-medium text-primary-blue leading-none mt-1 block opacity-80">Veterinary Clinic</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-8 custom-scrollbar">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            {...item}
                            active={currentRoute.startsWith(item.href)}
                            collapsed={sidebarCollapsed}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? (currentRoute.startsWith('/new-case') ? 'pl-0' : 'lg:pl-20') : 'lg:pl-64'}`}>
                {/* Upper Branding Strip (Mobile Only) */}
                <div className="lg:hidden bg-primary-blue py-2.5 px-6 flex items-center justify-center border-b border-primary-dark/20 shadow-sm relative z-50">
                    <div className="flex flex-col items-center">
                        <span className="text-[12px] font-black text-white uppercase tracking-[0.05em] leading-none">{clinicDisplayName}</span>
                        <span className="text-[8px] font-bold text-white/70 uppercase tracking-[0.1em] mt-1 leading-none tracking-tight">Clinic Management System</span>
                    </div>
                </div>

                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border-gray flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
                    {customHeader ? (
                        <div className="flex-1 flex items-center h-full">
                            {customHeader}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                                {/* Hamburger Menu (Mobile) */}
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden group"
                                >
                                    <Menu size={24} className="group-active:scale-90 transition-transform" />
                                </button>

                                <div
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className="hidden lg:flex items-center gap-3 shrink-0 border-r border-slate-100 pr-8 mr-4 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden p-1 group-hover:bg-slate-50 transition-colors">
                                        <img src="/storage/smartpetcarelogo.png" alt="Logo" className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 leading-none tracking-tight uppercase group-hover:text-primary-blue transition-colors">{clinicDisplayName}</h2>
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div> {clinic?.tagline || 'Secure Clinical Node'}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative max-w-lg w-full">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Search size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search records, patients..."
                                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 focus:bg-white focus:border-primary-blue/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 lg:gap-6">
                                <div className="relative">
                                    <button
                                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        className={`relative p-2.5 rounded-xl transition-all h-11 w-11 flex items-center justify-center border ${notificationsOpen ? 'bg-primary-blue/5 border-primary-blue/20 text-primary-blue' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-blue border-transparent'}`}
                                    >
                                        <Bell size={20} />
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white shadow-sm animate-bounce"></span>
                                        )}
                                    </button>

                                    {/* Notifications Popover */}
                                    <AnimatePresence>
                                        {notificationsOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)}></div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-80 lg:w-96 bg-white rounded-2xl border border-border-gray shadow-xl z-20 overflow-hidden flex flex-col max-h-[500px]"
                                                >
                                                    <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-primary-blue shadow-[0_0_8px_rgba(16,98,255,0.6)]"></div>
                                                            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                                        </div>
                                                        <button
                                                            onClick={markAllRead}
                                                            className="text-xs font-semibold text-primary-blue hover:bg-primary-blue/5 px-3 py-1.5 rounded-lg transition-all"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    </div>

                                                    <div className="overflow-y-auto custom-scrollbar flex-1">
                                                        {notifications.length > 0 ? (
                                                            notifications.map((n) => (
                                                                <Link
                                                                    key={n.id}
                                                                    href={n.link}
                                                                    onClick={() => setNotificationsOpen(false)}
                                                                    className={`flex gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all relative ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                                >
                                                                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-blue"></div>}
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                        <Bell size={18} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className={`text-sm tracking-tight truncate ${!n.read ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{n.title}</p>
                                                                                {!n.read && (
                                                                                    <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[7px] font-black uppercase tracking-widest rounded shadow-sm">NEW</span>
                                                                                )}
                                                                                {n.title.toLowerCase().includes('due') && (
                                                                                    <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[7px] font-black uppercase tracking-widest rounded shadow-sm">DUE</span>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">{n.time}</span>
                                                                        </div>
                                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{n.description}</p>
                                                                    </div>
                                                                </Link>
                                                            ))
                                                        ) : (
                                                            <div className="py-20 text-center">
                                                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100 shadow-inner">
                                                                    <Bell size={20} />
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">All caught up!</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href="#"
                                                        className="p-3 bg-slate-50 text-center text-[10px] font-bold text-slate-400 hover:text-primary-blue uppercase tracking-widest border-t border-slate-100 transition-all"
                                                    >
                                                        View All Notifications
                                                    </Link>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative">
                                    <div
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-3 lg:gap-4 pl-4 lg:pl-6 border-l border-border-gray cursor-pointer group"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-primary-blue transition-colors">
                                                {auth?.user?.first_name} {auth?.user?.last_name}
                                            </p>
                                            <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mt-1.5 opacity-70">
                                                Administrator
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary-blue font-bold text-sm border border-border-gray shadow-sm group-hover:border-primary-blue/30 transition-all">
                                            {auth?.user?.first_name?.charAt(0) || 'A'}
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Profile Dropdown */}
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-border-gray shadow-xl z-20 overflow-hidden"
                                                >
                                                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                        <p className="text-sm font-bold text-slate-900 truncate">{auth?.user?.email}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <Link href={route('settings.index')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                                                            <Settings size={16} className="text-slate-400 group-hover:text-primary-blue" />
                                                            <span className="text-sm font-semibold text-slate-700">Settings</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => router.post(route('logout'))}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger hover:bg-red-50 transition-all group mt-1"
                                                        >
                                                            <LogOut size={16} className="text-danger/70 group-hover:text-danger" />
                                                            <span className="text-sm font-semibold">Logout</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </>
                    )}
                </header>

                {/* Page Content */}
                <main className={mainClassName || "p-4 lg:p-8 min-h-[calc(100vh-80px)]"}>
                    {children}
                </main>
            </div>
        </div>
    );
}

