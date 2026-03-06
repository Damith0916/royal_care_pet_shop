import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Settings,
    Shield,
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
    Activity,
    CreditCard,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${active
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
            : 'text-slate-400 hover:text-slate-600'
            }`}
    >
        <Icon size={14} className={active ? 'text-slate-700' : 'text-slate-400'} />
        <span>{label}</span>
    </button>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-slate-500 tracking-tight">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />}
            <input
                {...props}
                className={`w-full bg-slate-50 border border-slate-200 ${Icon ? 'pl-9' : 'px-4'} pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue/20 outline-none transition-all text-slate-900`}
            />
        </div>
    </div>
);

export default function SettingsIndex({ clinic, species, roles }) {
    const [activeTab, setActiveTab] = useState('Clinic');
    const [expandedSpecies, setExpandedSpecies] = useState(null);
    const [newSpeciesName, setNewSpeciesName] = useState('');
    const [newBreedName, setNewBreedName] = useState('');
    const [addingBreedTo, setAddingBreedTo] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: clinic?.name || '',
        tagline: clinic?.tagline || '',
        address: clinic?.address || '',
        phone: clinic?.phone || '',
        email: clinic?.email || '',
        doctor_name: clinic?.doctor_name || '',
        tax_rate: clinic?.tax_rate || 0,
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
        if (confirm('Delete this species and all associated breeds?')) {
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
        if (confirm('Delete this breed?')) {
            router.delete(route('settings.breeds.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm mt-0.5">Manage clinic configuration, species, and roles.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-6 bg-slate-100/60 p-1 rounded-xl border border-slate-200 w-fit">
                {[
                    { id: 'Clinic', label: 'Clinic Settings', icon: Building2 },
                    { id: 'Species', label: 'Species & Breeds', icon: PawPrint },
                    { id: 'Roles', label: 'Roles & Permissions', icon: Shield },
                ].map(tab => (
                    <TabButton
                        key={tab.id}
                        label={tab.label}
                        active={activeTab === tab.id}
                        icon={tab.icon}
                        onClick={() => setActiveTab(tab.id)}
                    />
                ))}
            </div>

            <div className="pb-10">
                {/* Content Area */}
                <div className="min-w-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Clinic' && (
                            <motion.div
                                key="clinic"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <SectionHeader
                                    title="Clinic Settings"
                                    subtitle="Configure clinic details, contact information, and billing preferences."
                                />

                                <form onSubmit={handleClinicUpdate} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Clinic Name"
                                            icon={Building2}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter clinic name"
                                        />
                                        <InputField
                                            label="Tagline"
                                            icon={Activity}
                                            value={data.tagline}
                                            onChange={e => setData('tagline', e.target.value)}
                                            placeholder="e.g. Excellence in Veterinary Care"
                                        />
                                        <InputField
                                            label="Doctor Name"
                                            icon={User}
                                            value={data.doctor_name}
                                            onChange={e => setData('doctor_name', e.target.value)}
                                            placeholder="e.g. Dr. John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Phone"
                                            icon={Phone}
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+94 XX XXX XXXX"
                                        />
                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-semibold text-slate-500 tracking-tight">Timezone</label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <select className="w-full bg-slate-50 border border-slate-200 pl-9 pr-8 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none text-slate-900">
                                                    <option>UTC+5:30 (Asia/Colombo)</option>
                                                    <option>UTC+0:00 (GMT)</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-500 tracking-tight">Address</label>
                                        <textarea
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none h-24 resize-none transition-all text-slate-900"
                                            placeholder="Full clinic address..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                        <InputField
                                            label="Currency"
                                            icon={CreditCard}
                                            value={data.default_currency}
                                            onChange={e => setData('default_currency', e.target.value)}
                                        />
                                        <InputField
                                            label="Email"
                                            icon={Mail}
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="admin@clinic.com"
                                        />
                                        <InputField
                                            label="Tax Rate (%)"
                                            icon={Shield}
                                            type="number"
                                            step="0.01"
                                            value={data.tax_rate}
                                            onChange={e => setData('tax_rate', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl font-semibold text-sm shadow-lg transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {processing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'Species' && (
                            <motion.div
                                key="species"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <SectionHeader
                                    title="Species & Breeds"
                                    subtitle="Manage biological classifications and breed records."
                                />

                                <div className="p-6">
                                    <form onSubmit={handleAddSpecies} className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-slate-50/40 rounded-xl border border-slate-200 border-dashed">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input
                                                type="text"
                                                placeholder="Add new species..."
                                                value={newSpeciesName}
                                                onChange={e => setNewSpeciesName(e.target.value)}
                                                className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none text-slate-900"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="px-5 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2">
                                            <Plus size={15} /> Add Species
                                        </button>
                                    </form>

                                    <div className="grid grid-cols-1 gap-3">
                                        {species.map(specie => (
                                            <div key={specie.id} className="border border-border-gray rounded-xl overflow-hidden">
                                                <div
                                                    className={`p-4 flex items-center justify-between cursor-pointer transition-all ${expandedSpecies === specie.id ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}`}
                                                    onClick={() => setExpandedSpecies(expandedSpecies === specie.id ? null : specie.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-lg bg-white border border-border-gray text-slate-400 transition-transform ${expandedSpecies === specie.id ? 'rotate-90 text-primary-blue' : ''}`}>
                                                            <ChevronRight size={15} />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-900 text-sm">{specie.name}</span>
                                                            <div className="text-xs text-slate-400 mt-0.5">{specie.breeds.length} breeds</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSpecies(specie.id); }}
                                                        className="p-2 text-slate-300 hover:text-danger hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={15} />
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
                                                            <div className="p-4">
                                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Breeds</p>
                                                                <div className="flex flex-wrap gap-2 mb-4">
                                                                    {specie.breeds.map(breed => (
                                                                        <div key={breed.id} className="flex items-center gap-2 bg-slate-50 border border-border-gray pl-3 pr-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:border-primary-blue/30 hover:bg-white transition-all">
                                                                            <span>{breed.name}</span>
                                                                            <button
                                                                                onClick={() => handleDeleteBreed(breed.id)}
                                                                                className="p-0.5 text-slate-300 hover:text-danger rounded transition-colors"
                                                                            >
                                                                                <Trash2 size={11} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {specie.breeds.length === 0 && (
                                                                        <p className="text-xs text-slate-400 py-2">No breeds added yet.</p>
                                                                    )}
                                                                </div>

                                                                <div className="pt-3 border-t border-slate-100">
                                                                    {addingBreedTo === specie.id ? (
                                                                        <form onSubmit={handleAddBreed} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                                                                            <input
                                                                                type="text"
                                                                                autoFocus
                                                                                placeholder="Breed name..."
                                                                                value={newBreedName}
                                                                                onChange={e => setNewBreedName(e.target.value)}
                                                                                className="flex-1 bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                                                                required
                                                                            />
                                                                            <div className="flex gap-2">
                                                                                <button type="submit" className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-black transition-all">Add</button>
                                                                                <button type="button" onClick={() => setAddingBreedTo(null)} className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-semibold text-xs hover:bg-slate-200 transition-all">Cancel</button>
                                                                            </div>
                                                                        </form>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setAddingBreedTo(specie.id)}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-primary-blue font-semibold text-xs rounded-xl hover:bg-primary-blue hover:text-white transition-all border border-slate-100"
                                                                        >
                                                                            <Plus size={13} />
                                                                            Add Breed
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

                        {activeTab === 'Roles' && (
                            <motion.div
                                key="roles"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden"
                            >
                                <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Roles & Permissions</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Configure access levels and module permissions for staff.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const name = prompt('Enter new role name:');
                                            if (name) router.post(route('settings.roles.store'), { name });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-md transition-all"
                                    >
                                        <Shield size={15} />
                                        Add Role
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {roles.map(role => (
                                            <div key={role.id} className="card-interactive p-5 rounded-xl bg-white group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-blue group-hover:text-white flex items-center justify-center border border-slate-100 transition-all">
                                                            <Shield size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-sm leading-none mb-1">{role.name}</h4>
                                                            <span className="text-xs text-slate-400">{role.users_count || 0} members</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => {
                                                                const name = prompt('Edit role name:', role.name);
                                                                if (name && name !== role.name) router.put(route('settings.roles.update', role.id), { name });
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-primary-blue bg-white border border-slate-200 rounded-lg transition-all"
                                                        >
                                                            <Settings size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Delete role "${role.name}"?`)) router.delete(route('settings.roles.destroy', role.id));
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-danger bg-white border border-slate-200 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                                                    {role.permissions && role.permissions.length > 0 ? (
                                                        role.permissions.map(perm => (
                                                            <span key={perm.id} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-medium text-slate-500">
                                                                {perm.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs py-1">
                                                            <Clock size={12} /> Full administrative access
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
