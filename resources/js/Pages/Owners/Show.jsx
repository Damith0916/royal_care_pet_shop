import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    User, Phone, Mail, MapPin, Calendar, Clock, PawPrint,
    CreditCard, ArrowLeft, Plus, ChevronRight, Edit3,
    Activity, Receipt, Wallet, Bell, ShieldCheck, Heart
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        gray: 'bg-slate-50 text-slate-500 border-slate-100',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${colors[color]}`}>
            {children}
        </span>
    );
};

const TabButton = ({ active, label, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 uppercase tracking-widest relative ${active
            ? 'text-primary-blue border-primary-blue bg-blue-50/10'
            : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50'
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

export default function OwnerShow({ owner }) {
    const [activeTab, setActiveTab] = useState('pets');

    const stats = [
        { label: 'Total Pets', value: owner.pets?.length || 0, icon: PawPrint, color: 'text-orange-500', bg: 'bg-orange-50/50' },
        { label: 'Total Visits', value: owner.appointments?.length || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50/50' },
        { label: 'Outstanding Balance', value: 'LKR 0.00', icon: Wallet, color: 'text-green-500', bg: 'bg-green-50/50' },
    ];

    return (
        <AppLayout>
            <Head title={`${owner.first_name}'s Profile`} />

            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-8">
                <div className="p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-xl bg-slate-50 border border-border-gray shadow-sm flex items-center justify-center text-primary-blue font-bold text-4xl shrink-0 uppercase tracking-tighter">
                                {owner.first_name.charAt(0)}
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase tracking-tight">{owner.first_name} {owner.last_name}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-primary-blue" />
                                        {owner.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-primary-blue" />
                                        {owner.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary-blue" />
                                        {owner.address || 'No address recorded'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-3 text-slate-400 hover:text-primary-blue hover:bg-slate-50 border border-border-gray rounded-xl transition-all shadow-sm" title="Edit Profile">
                                <Edit3 size={20} />
                            </button>
                            <Link
                                href={route('pets.create', { owner_id: owner.id })}
                                className="flex items-center gap-2 px-6 py-3.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_8px_16px_rgba(16,98,255,0.2)] hover:-translate-y-0.5"
                            >
                                <Plus size={18} /> Register New Pet
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-8 border-t border-border-gray bg-slate-50/30 flex items-center overflow-x-auto">
                    <TabButton active={activeTab === 'pets'} label="Registered Pets" onClick={() => setActiveTab('pets')} icon={PawPrint} />
                    <TabButton active={activeTab === 'appointments'} label="Visit History" onClick={() => setActiveTab('appointments')} icon={Calendar} />
                    <TabButton active={activeTab === 'invoices'} label="Billing Overview" onClick={() => setActiveTab('invoices')} icon={Receipt} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-xl p-8 border border-border-gray shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Owner Summary</h3>
                        <div className="space-y-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-5 group">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 border border-current/10 group-hover:scale-110 transition-all shadow-sm`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                        <p className="text-xl font-bold text-slate-900 leading-none tracking-tight">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-8 text-white overflow-hidden relative group border border-slate-800 shadow-xl">
                        <div className="absolute -top-4 -right-4 opacity-5 text-primary-blue group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                            <Bell size={120} />
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Safety & Alerts</h3>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-8">
                            Stay updated with health check reminders and vaccination schedules.
                        </p>
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/5 shadow-inner">
                            Manage Notifications
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'pets' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {owner.pets?.map(pet => (
                                        <Link
                                            key={pet.id}
                                            href={route('pets.show', pet.id)}
                                            className="group bg-white p-8 rounded-xl border border-border-gray hover:border-primary-blue/30 hover:shadow-lg transition-all relative overflow-hidden flex flex-col"
                                        >
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="w-14 h-14 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 group-hover:bg-primary-blue group-hover:text-white transition-all shadow-sm">
                                                    <PawPrint size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-blue transition-colors leading-none tracking-tight uppercase">{pet.name}</h3>
                                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge color="blue">{pet.species?.name || 'Pet'}</Badge>
                                                        <Badge color="gray">{pet.breed?.name || 'Mixed'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                                <div className="bg-slate-50/50 border border-border-gray rounded-xl p-4 transition-colors group-hover:bg-white">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender</p>
                                                    <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{pet.gender}</p>
                                                </div>
                                                <div className="bg-slate-50/50 border border-border-gray rounded-xl p-4 transition-colors group-hover:bg-white">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Record Status</p>
                                                    <p className="text-sm font-bold text-green-600 uppercase tracking-tight">Active</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href={route('pets.create', { owner_id: owner.id })} className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-primary-blue group transition-all text-slate-400 hover:text-primary-blue shadow-sm">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-primary-blue transition-all border border-transparent group-hover:border-primary-blue/20">
                                            <Plus size={28} />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-widest">Register New Patient</span>
                                    </Link>
                                </div>
                            )}

                            {activeTab === 'appointments' && (
                                <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-border-gray bg-slate-50/30 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-tight">
                                            <Calendar size={18} className="text-primary-blue" /> Appointment History
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-border-gray">
                                                <tr>
                                                    <th className="px-8 py-5">Date & Time</th>
                                                    <th className="px-8 py-5">Patient</th>
                                                    <th className="px-8 py-5">Service Type</th>
                                                    <th className="px-8 py-5 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {owner.appointments?.map(app => (
                                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 text-sm uppercase tracking-tight">{format(parseISO(app.datetime), 'MMM dd, yyyy')}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(parseISO(app.datetime), 'hh:mm a')}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <Link href={route('pets.show', app.pet?.id || 1)} className="font-bold text-primary-blue hover:text-primary-dark text-sm flex items-center gap-3 transition-colors uppercase tracking-tight">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-all shadow-sm">
                                                                    <PawPrint size={14} />
                                                                </div>
                                                                {app.pet?.name || 'Unknown Patient'}
                                                            </Link>
                                                        </td>
                                                        <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Medical Visit</td>
                                                        <td className="px-8 py-6 text-right">
                                                            <Badge color={app.status === 'Completed' ? 'green' : 'blue'}>
                                                                {app.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {!owner.appointments?.length && (
                                            <div className="py-20 text-center">
                                                <Calendar size={40} className="mx-auto text-slate-100 mb-4" />
                                                <p className="text-slate-400 font-bold italic text-sm">No appointment records found for this owner.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'invoices' && (
                                <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-border-gray bg-slate-50/30 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-tight">
                                            <Receipt size={18} className="text-primary-blue" /> Billing Records
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-border-gray">
                                                <tr>
                                                    <th className="px-8 py-5">Invoice Code</th>
                                                    <th className="px-8 py-5">Generated Date</th>
                                                    <th className="px-8 py-5">Total Amount</th>
                                                    <th className="px-8 py-5">Payment Status</th>
                                                    <th className="px-8 py-5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {owner.invoices?.map(inv => (
                                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <span className="font-bold text-primary-blue text-sm uppercase tracking-tight">#{inv.invoice_number}</span>
                                                        </td>
                                                        <td className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-tight">
                                                            {format(parseISO(inv.invoice_date), 'MMM dd, yyyy')}
                                                        </td>
                                                        <td className="px-8 py-6 font-bold text-slate-900 text-sm tracking-tight">
                                                            LKR {Number(inv.net_amount).toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <Badge color={inv.status === 'Paid' ? 'green' : 'orange'}>
                                                                {inv.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <Link href={route('billing.show', inv.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all inline-block shadow-sm">
                                                                <ChevronRight size={18} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {!owner.invoices?.length && (
                                            <div className="py-20 text-center">
                                                <Receipt size={40} className="mx-auto text-slate-100 mb-4" />
                                                <p className="text-slate-400 font-bold italic text-sm">No billing history found for this owner.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
