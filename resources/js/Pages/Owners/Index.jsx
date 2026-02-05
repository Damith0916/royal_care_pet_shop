import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    User,
    Phone,
    Mail,
    MapPin,
    PawPrint,
    ChevronRight,
    Loader2,
    XCircle,
    X as XIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border-gray">
                <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function OwnersIndex({ owners }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
    });

    const filteredOwners = owners.filter(owner =>
        owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone.includes(searchTerm)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owners.store'), {
            onSuccess: () => {
                setShowRegisterModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Pet Owners" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Pet Owners</h1>
                    <p className="text-sm font-medium text-slate-500">Manage client information and contact details.</p>
                </div>

                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Register New Owner
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, phone or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-border-gray pl-11 pr-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOwners.map(owner => (
                    <div
                        key={owner.id}
                        className="bg-white rounded-2xl border border-border-gray p-0 shadow-sm hover:shadow-2xl hover:border-primary-blue/20 transition-all duration-500 group overflow-hidden flex flex-col"
                    >
                        {/* High-Contrast Header Strip */}
                        <div className="bg-slate-50/50 p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-border-gray text-primary-blue flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-all">
                                    {owner.first_name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none truncate uppercase">{owner.first_name} {owner.last_name}</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Active Guardian
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-[10px] font-black text-primary-blue bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-tighter border border-blue-100 flex items-center gap-1.5">
                                    <PawPrint size={10} /> {owner.pets_count}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 flex-1 bg-white">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group/info">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/info:bg-white transition-colors">
                                        <Phone size={14} className="text-slate-400 group-hover/info:text-primary-blue" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{owner.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 group/info">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/info:bg-white transition-colors">
                                        <Mail size={14} className="text-slate-400 group-hover/info:text-primary-blue" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 truncate">{owner.email}</span>
                                </div>
                                <div className="flex items-center gap-4 group/info">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/info:bg-white transition-colors">
                                        <MapPin size={14} className="text-slate-400 group-hover/info:text-primary-blue" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 truncate">{owner.address || 'No location data'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/30 border-t border-slate-50 grid grid-cols-5 gap-2">
                            <Link
                                href={route('owners.show', owner.id)}
                                className="col-span-4 py-3 bg-white hover:bg-slate-900 border border-border-gray hover:border-slate-900 text-slate-900 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-sm group/btn active:scale-95"
                            >
                                Intelligence Hub
                                <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm('Critical Action: Purge owner profile and all associated data vectors?')) {
                                        router.delete(route('owners.destroy', owner.id));
                                    }
                                }}
                                className="col-span-1 p-3 text-slate-300 hover:text-danger hover:bg-white border border-transparent hover:border-danger/20 rounded-xl transition-all flex items-center justify-center"
                                title="Purge Record"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                title="Register Pet Owner"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="John"
                                required
                            />
                            {errors.first_name && <p className="text-[10px] font-bold text-danger mt-1">{errors.first_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Doe"
                                required
                            />
                            {errors.last_name && <p className="text-[10px] font-bold text-danger mt-1">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="+94 77 123 4567"
                                required
                            />
                            {errors.phone && <p className="text-[10px] font-bold text-danger mt-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="john@example.com"
                                required
                            />
                            {errors.email && <p className="text-[10px] font-bold text-danger mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</label>
                        <textarea
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none h-24 resize-none"
                            placeholder="Full residential address..."
                        />
                    </div>

                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-10 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50 flex items-center gap-2 ml-auto"
                        >
                            {processing ? <Loader2 className="animate-spin" size={18} /> : null}
                            {processing ? 'Registering...' : 'Register Owner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
