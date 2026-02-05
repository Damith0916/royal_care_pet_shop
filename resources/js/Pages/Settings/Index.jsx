import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Settings,
    Home,
    Shield,
    Users,
    CreditCard,
    Bell,
    Save,
    Loader2,
    Building2,
    Globe,
    Mail,
    Phone,
    PawPrint,
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    Search,
    Clock,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold text-sm transition-all duration-300 w-full text-left relative group ${active
            ? 'bg-primary-blue text-white shadow-[0_12px_24px_rgba(16,98,255,0.25)]'
            : 'text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-md'
            }`}
    >
        <Icon size={20} className={active ? 'text-white' : 'text-slate-300 group-hover:text-primary-blue transition-colors'} />
        <span className="uppercase tracking-widest text-[11px]">{label}</span>
        {active && (
            <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/40"></div>
        )}
    </button>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="p-10 border-b border-border-gray bg-slate-50/20">
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">{subtitle}</p>
    </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 leading-none">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />}
            <input
                {...props}
                className={`w-full bg-slate-50 border border-border-gray ${Icon ? 'pl-12' : 'px-5'} pr-5 py-4 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue/30 outline-none transition-all placeholder:text-slate-300`}
            />
        </div>
    </div>
);

export default function SettingsIndex({ clinic, species, roles }) {
    const [activeTab, setActiveTab] = useState('Clinic Intelligence');
    const [expandedSpecies, setExpandedSpecies] = useState(null);
    const [newSpeciesName, setNewSpeciesName] = useState('');
    const [newBreedName, setNewBreedName] = useState('');
    const [addingBreedTo, setAddingBreedTo] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: clinic?.name || '',
        address: clinic?.address || '',
        phone: clinic?.phone || '',
        email: clinic?.email || '',
        default_currency: clinic?.default_currency || 'LKR',
    });

    const handleClinicUpdate = (e) => {
        e.preventDefault();
        post(route('settings.clinic.update'));
    };

    const handleAddSpecies = (e) => {
        e.preventDefault();
        router.post(route('settings.species.store'), { name: newSpeciesName }, {
            onSuccess: () => setNewSpeciesName('')
        });
    };

    const handleDeleteSpecies = (id) => {
        if (confirm('Critical Action: Purge species and all associated breed records?')) {
            router.delete(route('settings.species.destroy', id));
        }
    };

    const handleAddBreed = (e) => {
        e.preventDefault();
        router.post(route('settings.breeds.store'), {
            name: newBreedName,
            species_id: addingBreedTo
        }, {
            onSuccess: () => {
                setNewBreedName('');
                setAddingBreedTo(null);
            }
        });
    };

    const handleDeleteBreed = (id) => {
        if (confirm('Delete this breed record?')) {
            router.delete(route('settings.breeds.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Core System Configuration" />

            <div className="mb-12">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Infrastructure Intelligence</h1>
                <p className="text-slate-500 text-sm font-medium">Fine-tune clinic operations, taxonomic records, and security deployments.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 pb-24">
                {/* Tactical Navigation Sidebar */}
                <div className="lg:w-85 flex flex-col gap-3 p-2 bg-slate-50 rounded-2xl border border-border-gray h-fit sticky top-24">
                    {[
                        { id: 'Clinic Intelligence', icon: Building2 },
                        { id: 'Taxonomic Index', icon: PawPrint },
                        { id: 'Faculty Permissions', icon: Shield },
                    ].map(tab => (
                        <TabButton
                            key={tab.id}
                            label={tab.id}
                            active={activeTab === tab.id}
                            icon={tab.icon}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                    <div className="mt-6 pt-6 border-t border-slate-200/50 px-4 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocol Version 4.8.2-A</p>
                    </div>
                </div>

                {/* Computational Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Clinic Intelligence' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <SectionHeader
                                    title="Clinic Operation Protocol"
                                    subtitle="Define environmental variables for financial and record-keeping operations."
                                />

                                <form onSubmit={handleClinicUpdate} className="p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <InputField
                                            label="Operational Designation (Clinic Name)"
                                            icon={Building2}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter registered designation"
                                        />
                                        <InputField
                                            label="Communication Channel (Email)"
                                            icon={Mail}
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="admin@smartpetcare.io"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <InputField
                                            label="Point of Contact (Phone)"
                                            icon={Phone}
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+94 XX XXX XXXX"
                                        />
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 leading-none">Temporal Adjustment (Timezone)</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <select className="w-full bg-slate-50 border border-border-gray pl-12 pr-10 py-4 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue/30 outline-none appearance-none cursor-pointer">
                                                    <option>UTC+5:30 (Asia/Colombo)</option>
                                                    <option>UTC+0:00 (GMT)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 leading-none">Geographic Coordinates (Address)</label>
                                        <textarea
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full bg-slate-50 border border-border-gray px-5 py-5 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue/30 outline-none h-32 resize-none transition-all placeholder:text-slate-300"
                                            placeholder="Enter full physical operation address..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-border-gray">
                                        <InputField
                                            label="Currency Vector (LKR/USD)"
                                            icon={CreditCard}
                                            value={data.default_currency}
                                            onChange={e => setData('default_currency', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-3 px-12 py-5 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {processing ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                            Update Operation Parameters
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'Taxonomic Index' && (
                            <motion.div
                                key="species"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <SectionHeader
                                    title="Taxonomic Record Repository"
                                    subtitle="Maintain patient biological classifications and breed intelligence data."
                                />

                                <div className="p-10">
                                    <form onSubmit={handleAddSpecies} className="flex flex-col sm:flex-row gap-4 mb-10 p-6 bg-slate-50 rounded-2xl border border-border-gray border-dashed">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Initialize new biological species..."
                                                value={newSpeciesName}
                                                onChange={e => setNewSpeciesName(e.target.value)}
                                                className="w-full bg-white border border-border-gray pl-12 pr-4 py-4 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue/30 outline-none"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="px-8 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2">
                                            <Plus size={16} /> Register Species
                                        </button>
                                    </form>

                                    <div className="grid grid-cols-1 gap-4">
                                        {species.map(specie => (
                                            <div key={specie.id} className="border border-border-gray rounded-2xl overflow-hidden group/item">
                                                <div
                                                    className={`p-6 flex items-center justify-between cursor-pointer transition-all ${expandedSpecies === specie.id ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}`}
                                                    onClick={() => setExpandedSpecies(expandedSpecies === specie.id ? null : specie.id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl bg-white border border-border-gray text-slate-400 transition-transform ${expandedSpecies === specie.id ? 'rotate-90 text-primary-blue' : ''}`}>
                                                            <ChevronRight size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-900 uppercase tracking-tight text-lg">{specie.name}</span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-bold bg-white border border-border-gray text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                                                    {specie.breeds.length} Varieties
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSpecies(specie.id); }}
                                                        className="p-3 text-slate-300 hover:text-danger hover:bg-red-50 rounded-xl transition-all"
                                                        title="Purge Species"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {expandedSpecies === specie.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="bg-white border-t border-border-gray overflow-hidden"
                                                        >
                                                            <div className="p-8">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Confirmed Breed Varieties</p>
                                                                <div className="flex flex-wrap gap-3 mb-8">
                                                                    {specie.breeds.map(breed => (
                                                                        <div key={breed.id} className="flex items-center gap-3 bg-slate-50 border border-border-gray pl-4 pr-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:border-primary-blue/30 hover:bg-white transition-all group/chip">
                                                                            <span className="uppercase tracking-tight">{breed.name}</span>
                                                                            <button
                                                                                onClick={() => handleDeleteBreed(breed.id)}
                                                                                className="p-1 text-slate-300 hover:text-danger rounded-md transition-colors"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {specie.breeds.length === 0 && (
                                                                        <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest py-4">No verified breeds in repository.</p>
                                                                    )}
                                                                </div>

                                                                <div className="pt-6 border-t border-slate-100">
                                                                    {addingBreedTo === specie.id ? (
                                                                        <form onSubmit={handleAddBreed} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                                                                            <input
                                                                                type="text"
                                                                                autoFocus
                                                                                placeholder="Specific variety name..."
                                                                                value={newBreedName}
                                                                                onChange={e => setNewBreedName(e.target.value)}
                                                                                className="flex-1 bg-slate-50 border border-border-gray py-4 px-5 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-blue/5 outline-none"
                                                                                required
                                                                            />
                                                                            <div className="flex gap-2">
                                                                                <button type="submit" className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">Commit</button>
                                                                                <button type="button" onClick={() => setAddingBreedTo(null)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                                                                            </div>
                                                                        </form>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setAddingBreedTo(specie.id)}
                                                                            className="flex items-center gap-3 px-6 py-3.5 bg-slate-50 text-primary-blue font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-blue hover:text-white transition-all border border-slate-100 shadow-sm"
                                                                        >
                                                                            <Plus size={16} />
                                                                            Register New Variety
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Faculty Permissions' && (
                            <motion.div
                                key="roles"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <div className="p-10 border-b border-border-gray bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Access Control Protocol</h3>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Configure operational clearance levels and module permissions.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const name = prompt('Designate New Role (Identifier):');
                                            if (name) router.post(route('settings.roles.store'), { name });
                                        }}
                                        className="flex items-center gap-3 px-8 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                    >
                                        <Plus size={18} />
                                        Initialize Role
                                    </button>
                                </div>
                                <div className="p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {roles.map(role => (
                                            <div key={role.id} className="border border-border-gray p-8 rounded-2xl bg-white hover:border-primary-blue/30 hover:shadow-2xl transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                                    <Shield size={100} className="text-primary-blue" />
                                                </div>
                                                <div className="flex items-start justify-between mb-8 relative z-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary-blue group-hover:text-white flex items-center justify-center border border-border-gray shadow-inner transition-all">
                                                            <Shield size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-xl uppercase tracking-tight leading-none mb-2">{role.name}</h4>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role.users_count || 0} Faculty Deployments</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                                                        <button
                                                            onClick={() => {
                                                                const name = prompt('Modify Role Designation:', role.name);
                                                                if (name && name !== role.name) router.put(route('settings.roles.update', role.id), { name });
                                                            }}
                                                            className="p-3 text-slate-400 hover:text-primary-blue bg-slate-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                                            title="Modify Label"
                                                        >
                                                            <Settings size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Emergency Action: Purge role clearance for "${role.name}"?`)) router.delete(route('settings.roles.destroy', role.id));
                                                            }}
                                                            className="p-3 text-slate-400 hover:text-danger bg-slate-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                                            title="Purge Role"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50 relative z-10">
                                                    {role.permissions && role.permissions.length > 0 ? (
                                                        role.permissions.map(perm => (
                                                            <span key={perm.id} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:bg-primary-blue/5 group-hover:border-primary-blue/20 transition-colors">
                                                                {perm.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-slate-300 italic font-medium text-xs py-2">
                                                            <Clock size={14} /> Full Administrative Inheritance
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
