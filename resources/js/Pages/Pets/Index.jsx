import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    PawPrint,
    User,
    ChevronRight,
    XCircle,
    X as XIcon,
    Edit3,
    Calendar,
    Activity
} from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';

const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
        gray: 'bg-slate-50 text-slate-500 border-slate-100',
        red: 'bg-red-50 text-danger border-red-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[color]}`}>
            {children}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            ></motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 relative z-10"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1 h-5 bg-primary-blue rounded-full"></div>
                        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:text-danger rounded-lg transition-all text-slate-400 border border-transparent hover:border-danger/10">
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default function PetsIndex({ pets, owners, species, breeds }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

    const { data, setData, post, processing, errors, reset } = useForm({
        owner_id: '',
        species_id: '',
        breed_id: '',
        name: '',
        dob: '',
        gender: 'Unknown',
        color: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('pets.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Pets Directory" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Patients</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage registered pets and their medical history.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} />
                    Register Pet
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        placeholder="Search by pet name or owner..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all text-slate-900"
                    />
                </div>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPets.map(pet => (
                    <div
                        key={pet.id}
                        className="group card-interactive bg-white flex flex-col overflow-hidden"
                    >
                        <Link href={route('pets.show', pet.id)} className="block flex-1 p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-all">
                                        <PawPrint size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-blue transition-colors leading-none mb-1.5">{pet.name}</h3>
                                        <div className="flex gap-1.5">
                                            <Badge color="blue">{pet.species?.name || 'Unknown'}</Badge>
                                            <Badge color="gray">{pet.breed?.name || 'Mixed'}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Badge color={pet.is_active ? 'green' : 'gray'}>
                                    {pet.is_active ? 'Active' : 'Archived'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">
                                <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 group-hover:bg-white transition-colors">
                                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                        <User size={11} className="text-primary-blue" />
                                        <span className="text-xs font-semibold text-slate-400">Owner</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 leading-none truncate">{pet.owner.first_name} {pet.owner.last_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <Calendar size={11} className="text-primary-blue" />
                                            <span className="text-xs font-semibold text-slate-400">Last Visit</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 leading-none">Oct 12, 2023</p>
                                    </div>
                                    <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                            <Activity size={11} className="text-primary-blue" />
                                            <span className="text-xs font-semibold text-slate-400">Health</span>
                                        </div>
                                        <p className="text-xs font-semibold text-emerald-600 leading-none">Stable</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="px-5 pb-4 flex items-center gap-2">
                            <Link
                                href={route('pets.edit', pet.id)}
                                className="p-2.5 text-slate-400 hover:text-primary-blue hover:bg-slate-50 border border-slate-100 hover:border-primary-blue/20 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit3 size={15} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setConfirmDelete({ open: true, id: pet.id, name: pet.name });
                                }}
                                className="p-2.5 text-slate-400 hover:text-danger hover:bg-red-50 border border-slate-100 hover:border-danger/20 rounded-lg transition-all"
                                title="Delete"
                            >
                                <XCircle size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPets.length === 0 && (
                <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                        <Activity size={28} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">No Patients Found</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">No patient records match your search. Try registering a new patient.</p>
                </div>
            )}

            {/* Registration Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Pet">
                <form
                    onSubmit={submit}
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
                                form.requestSubmit();
                            }
                        }
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pet Name</label>
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Buddy"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Owner</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.owner_id}
                                onChange={e => setData('owner_id', e.target.value)}
                            >
                                <option value="">Select Owner</option>
                                {owners && owners.map(owner => (
                                    <option key={owner.id} value={owner.id}>{owner.first_name} {owner.last_name}</option>
                                ))}
                            </select>
                            {errors.owner_id && <p className="text-danger text-xs mt-1">{errors.owner_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Species</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.species_id}
                                onChange={e => setData('species_id', e.target.value)}
                            >
                                <option value="">Select Species</option>
                                {species && species.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Breed</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.breed_id}
                                onChange={e => setData('breed_id', e.target.value)}
                            >
                                <option value="">Select Breed (Optional)</option>
                                {breeds && breeds.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gender</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.gender}
                                onChange={e => setData('gender', e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date of Birth</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.dob}
                                onChange={e => setData('dob', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {processing ? 'Registering...' : 'Register Pet'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ ...confirmDelete, open: false })}
                onConfirm={() => router.delete(route('pets.destroy', confirmDelete.id))}
                title="Remove Patient Record"
                message={`Are you sure you want to remove ${confirmDelete.name} from the medical registry? This will permanently delete all clinical history, lab reports, and vaccination records for this patient.`}
                confirmText="Permanently Delete Record"
                type="danger"
            />
        </AppLayout>
    );
}
