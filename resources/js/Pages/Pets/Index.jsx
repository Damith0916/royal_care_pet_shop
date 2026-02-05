import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    PawPrint,
    User,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    XCircle,
    X as XIcon,
    Edit3,
    Calendar,
    Activity
} from 'lucide-react';

const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
        gray: 'bg-slate-50 text-slate-500 border-slate-100',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${colors[color]}`}>
            {children}
        </span>
    );
};

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

export default function PetsIndex({ pets, owners, species, breeds }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            {/* Header Hub */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Pets Directory</h1>
                    <p className="text-sm font-medium text-slate-500">Manage and view all registered patients in the clinic.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Register New Patient
                </button>
            </div>

            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by patient name, owner, or unique ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-border-gray pl-12 pr-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all text-slate-800"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-border-gray text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                    <Filter size={18} />
                    Classification Filter
                </button>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPets.map(pet => (
                    <div
                        key={pet.id}
                        className="group bg-white rounded-xl border border-border-gray p-8 shadow-sm hover:shadow-xl hover:border-primary-blue/30 transition-all duration-300 relative overflow-hidden flex flex-col"
                    >
                        <Link href={route('pets.show', pet.id)} className="block flex-1">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 group-hover:bg-primary-blue group-hover:text-white transition-all shadow-sm">
                                        <PawPrint size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-blue transition-colors leading-none mb-2 uppercase tracking-tight">{pet.name}</h3>
                                        <div className="flex gap-2">
                                            <Badge color="blue">{pet.species?.name || 'Pet'}</Badge>
                                            <Badge color="gray">{pet.breed?.name || 'Mixed'}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Badge color={pet.is_active ? 'green' : 'gray'}>
                                    {pet.is_active ? 'Active' : 'Archived'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                <div className="bg-slate-50/50 border border-border-gray rounded-xl p-4 group-hover:bg-white transition-colors">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                                        <User size={12} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Guardianship</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 leading-none truncate uppercase">{pet.owner.first_name} {pet.owner.last_name}</p>
                                </div>
                                <div className="bg-slate-50/50 border border-border-gray rounded-xl p-4 group-hover:bg-white transition-colors">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                                        <Calendar size={12} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Last Clinical Visit</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 leading-none uppercase">Oct 12, 2023</p>
                                </div>
                            </div>
                        </Link>

                        <div className="mt-8 flex items-center gap-3 pt-6 border-t border-slate-50">
                            <Link
                                href={route('appointments.index', { new: true, pet_id: pet.id })}
                                className="flex-1 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                            >
                                <Plus size={14} />
                                Schedule Visit
                            </Link>
                            <Link
                                href={route('pets.edit', pet.id)}
                                className="p-3 text-slate-400 hover:text-primary-blue hover:bg-slate-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                title="Edit Profile"
                            >
                                <Edit3 size={18} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (confirm('Are you sure you want to permanently delete this patient record?')) {
                                        router.delete(route('pets.destroy', pet.id));
                                    }
                                }}
                                className="p-3 text-slate-400 hover:text-danger hover:bg-red-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                title="Delete Record"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPets.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 border border-slate-100 shadow-inner">
                        <Activity size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">No Patients Registered</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">There are no patient records matching your current criteria. You can start by registering a new patient.</p>
                </div>
            )}

            {/* Registration Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Patient Intelligence">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Patient Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Buddy"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Assign Guardian (Owner)</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.owner_id}
                                onChange={e => setData('owner_id', e.target.value)}
                            >
                                <option value="">Select Owner</option>
                                {owners && owners.map(owner => (
                                    <option key={owner.id} value={owner.id}>{owner.first_name} {owner.last_name}</option>
                                ))}
                            </select>
                            {errors.owner_id && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.owner_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Scientific Species</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.species_id}
                                onChange={e => setData('species_id', e.target.value)}
                            >
                                <option value="">Select Species</option>
                                {species && species.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Primary Breed</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.breed_id}
                                onChange={e => setData('breed_id', e.target.value)}
                            >
                                <option value="">Select Breed (Optional)</option>
                                {breeds && breeds.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Assigned Gender</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.gender}
                                onChange={e => setData('gender', e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Birth Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.dob}
                                onChange={e => setData('dob', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {processing ? 'Processing Registration...' : 'Commit Patient Registration'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
