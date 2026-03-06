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
import ConfirmationModal from '../../Components/ConfirmationModal';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border-gray">
                <div className="px-6 py-4 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function OwnersIndex({ owners }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

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

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Pet Owners</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage clinic clients and their registered pets.</p>
                </div>

                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} />
                    Add Owner
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all text-slate-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOwners.map(owner => (
                    <div
                        key={owner.id}
                        className="card-interactive bg-white overflow-hidden flex flex-col group"
                    >
                        {/* Card Header */}
                        <div className="bg-slate-50/60 p-4 border-b border-slate-100 flex items-center justify-between group-hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-primary-blue flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-all">
                                    {owner.first_name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-slate-900 leading-none truncate">{owner.first_name} {owner.last_name}</h3>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Active
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs font-semibold text-primary-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                                <PawPrint size={10} /> {owner.pets_count} Pets
                            </div>
                        </div>

                        <div className="p-4 space-y-2.5 flex-1 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <Phone size={12} className="text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-700 font-medium">{owner.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <Mail size={12} className="text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-700 truncate font-medium">{owner.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <MapPin size={12} className="text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-700 truncate font-medium">{owner.address || 'No address provided'}</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-5 gap-2">
                            <Link
                                href={route('owners.show', owner.id)}
                                className="col-span-4 py-2.5 bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 text-slate-900 hover:text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm group/btn active:scale-95"
                            >
                                View Profile
                                <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </Link>
                            <button
                                onClick={() => setConfirmDelete({ open: true, id: owner.id, name: `${owner.first_name} ${owner.last_name}` })}
                                className="col-span-1 p-2 text-slate-400 hover:text-danger hover:bg-white border border-transparent hover:border-danger/10 rounded-xl transition-all flex items-center justify-center"
                                title="Delete Owner"
                            >
                                <XCircle size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredOwners.length === 0 && (
                <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                        <User size={28} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">No Owners Found</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">No owners match your search criteria.</p>
                </div>
            )}

            <Modal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                title="Register Pet Owner"
            >
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const focusableElements = Array.from(
                                form.querySelectorAll('input, select, textarea, button[type="submit"]')
                            ).filter(el => !el.disabled && el.tabIndex !== -1);

                            const index = focusableElements.indexOf(e.target);
                            if (index > -1 && index < focusableElements.length - 1) {
                                focusableElements[index + 1].focus();
                            } else if (index === focusableElements.length - 1) {
                                // If it's the submit button, let it submit
                                form.requestSubmit();
                            }
                        }
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">First Name</label>
                            <input
                                autoFocus
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="John"
                                required
                            />
                            {errors.first_name && <p className="text-xs text-danger mt-1">{errors.first_name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Name</label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Doe"
                                required
                            />
                            {errors.last_name && <p className="text-xs text-danger mt-1">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="+94 77 123 4567"
                                required
                            />
                            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="john@example.com"
                                required
                            />
                            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
                        <textarea
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none h-20 resize-none"
                            placeholder="Full residential address..."
                        />
                    </div>

                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50 flex items-center gap-2 ml-auto"
                        >
                            {processing ? <Loader2 className="animate-spin" size={16} /> : null}
                            {processing ? 'Registering...' : 'Register Owner'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ ...confirmDelete, open: false })}
                onConfirm={() => router.delete(route('owners.destroy', confirmDelete.id))}
                title="Permanently Remove Client"
                message={`Are you sure you want to remove ${confirmDelete.name} and all their registered pets? This will permanently delete all medical history and invoices for this client.`}
                confirmText="Delete Client Data"
                type="danger"
            />
        </AppLayout>
    );
}
