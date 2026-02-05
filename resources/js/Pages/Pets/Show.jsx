import React, { useState, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    PawPrint, User, Calendar as CalendarIcon, Stethoscope, Activity,
    Syringe, FileText, TrendingUp, ChevronRight, Search, Plus,
    Clock, CheckCircle2, CalendarCheck, Pill, Thermometer,
    ArrowRight, X as XIcon, AlertCircle, Phone, Mail, MapPin,
    Download, Trash2, Edit3, MoreHorizontal, ChevronDown, Filter, Receipt
} from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        red: 'bg-red-50 text-red-700 border-red-100',
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
        className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm transition-all duration-300 relative ${active ? 'border-primary-blue text-primary-blue bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
    >
        <Icon size={18} />
        {label}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
            />
        )}
    </button>
);

const SectionCard = ({ title, icon: Icon, children, action }) => (
    <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-6">
        <div className="px-8 py-5 border-b border-border-gray flex items-center justify-between bg-slate-50/30">
            <h3 className="text-[11px] font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                {Icon && <Icon className="text-primary-blue" size={16} />}
                {title}
            </h3>
            {action}
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border-gray">
                <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

const MedicalRecordForm = ({ pet, onSuccess }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        diagnosis: '',
        treatment_plan: '',
        notes: '',
        date_of_record: format(new Date(), 'yyyy-MM-dd'),
        type: 'Consultation'
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('Form data:', data);
        onSuccess();
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none ml-1">Entry Type</label>
                <select
                    className="w-full bg-slate-50 border border-border-gray rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                    value={data.type}
                    onChange={e => setData('type', e.target.value)}
                >
                    <option value="Consultation">Consultation</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="LabResult">Lab Result</option>
                    <option value="Condition">Condition</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none ml-1">Diagnosis / Title</label>
                <input
                    type="text"
                    className="w-full bg-slate-50 border border-border-gray rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                    value={data.diagnosis}
                    onChange={e => setData('diagnosis', e.target.value)}
                    placeholder="Enter diagnosis or record title"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none ml-1">Treatment Plan / Details</label>
                <textarea
                    className="w-full bg-slate-50 border border-border-gray rounded-xl px-4 py-3.5 text-sm font-medium min-h-[120px] focus:ring-2 focus:ring-primary-blue/10 outline-none"
                    value={data.treatment_plan}
                    onChange={e => setData('treatment_plan', e.target.value)}
                    placeholder="Describe the treatment plan or details"
                />
            </div>
            <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all active:scale-[0.98]"
            >
                {processing ? 'Saving...' : 'Commit Record Entry'}
            </button>
        </form>
    );
};

export default function PetShow({ pet }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
        if (!dateString) return 'N/A';
        const date = parseISO(dateString);
        return isValid(date) ? format(date, formatStr) : 'Invalid Date';
    };

    const medicalRecords = useMemo(() => {
        // Unified Clinical Events anchored by Medical Records (Visits)
        const visits = (pet.medical_records || []).map(mr => ({
            id: mr.id,
            type: 'Clinical Visit',
            date: mr.date_of_record,
            title: mr.reason_for_visit || 'Clinical Consultation',
            subtitle: mr.diagnosis || 'Standard Examination',
            details: mr.treatment_plan,
            notes: mr.observations,
            vet: mr.vet,
            medications: mr.medications || [],
            vaccinations: mr.vaccinations || [],
            lab_results: mr.lab_results || [],
            invoice: mr.invoice, // Linked financial intelligence
            isVisit: true
        }));

        const linkedMedIds = visits.flatMap(v => (v.medications || []).map(m => m.id));
        const linkedVacIds = visits.flatMap(v => (v.vaccinations || []).map(v => v.id));
        const linkedLabIds = visits.flatMap(v => (v.lab_results || []).map(l => l.id));

        const orphans = [
            ...(pet.medications || []).filter(m => !linkedMedIds.includes(m.id)).map(m => ({
                id: `med-${m.id}`,
                type: 'Medication',
                date: m.date_prescribed,
                title: m.drug_name,
                subtitle: `Prescription Record`,
                details: `Dosage: ${m.dosage}`,
                vet: m.vet,
                isVisit: false
            })),
            ...(pet.vaccinations || []).filter(v => !linkedVacIds.includes(v.id)).map(v => ({
                id: `vac-${v.id}`,
                type: 'Vaccination',
                date: v.date_given,
                title: v.vaccine_type,
                subtitle: 'Immunization Record',
                details: `Next Due: ${formatDate(v.next_due_date)}`,
                vet: v.vet,
                isVisit: false
            })),
            ...(pet.lab_results || []).filter(l => !linkedLabIds.includes(l.id)).map(l => ({
                id: `lab-${l.id}`,
                type: 'Lab Intelligence',
                date: l.date_resulted || l.date_requested,
                title: l.test_type,
                subtitle: 'Diagnostic Intelligence',
                details: l.result_summary,
                vet: l.vet,
                isVisit: false
            }))
        ];

        return [...visits, ...orphans]
            .filter(r =>
                (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (r.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [pet, searchTerm]);

    const infoBadges = [
        { label: pet.species?.name, color: 'blue' },
        { label: pet.breed?.name || 'Mixed', color: 'gray' },
        { label: pet.gender, color: 'orange' },
        { label: `${new Date().getFullYear() - new Date(pet.dob).getFullYear()} Years`, color: 'green' }
    ];

    return (
        <AppLayout>
            <Head title={`${pet.name}'s Health Intelligence`} />

            {/* Premium Header Hub */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-8">
                <div className="h-32 bg-slate-900 relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1062FF 2px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900/50"></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            <div className="w-40 h-40 rounded-2xl bg-white p-3 border border-border-gray shadow-2xl relative group">
                                <div className="w-full h-full rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center overflow-hidden border border-slate-100 transition-all group-hover:bg-primary-blue group-hover:text-white">
                                    <PawPrint size={72} className="group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-success border-4 border-white rounded-2xl shadow-xl flex items-center justify-center text-white">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                            <div className="pt-4 md:pt-0">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {infoBadges.map((badge, i) => (
                                        <Badge key={i} color={badge.color}>{badge.label}</Badge>
                                    ))}
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Record ID: PAT-{pet.id.toString().padStart(4, '0')}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">{pet.name}</h1>
                                <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                    Guardian: <Link href={route('owners.show', pet.owner.id)} className="text-primary-blue hover:text-primary-dark transition-colors border-b border-primary-blue/30 pb-0.5">{pet.owner.first_name} {pet.owner.last_name}</Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link href={route('pets.edit', pet.id)} className="p-4 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all shadow-sm">
                                <Edit3 size={20} />
                            </Link>
                            <Link href={route('appointments.index', { new: true, pet_id: pet.id })} className="flex items-center gap-2 px-6 py-4 bg-white border border-primary-blue text-primary-blue hover:bg-blue-50 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm">
                                <CalendarIcon size={18} />
                                Schedule Session
                            </Link>
                            <button onClick={() => setIsRecordModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5">
                                <Plus size={18} />
                                Add Intelligence Entry
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="px-8 border-t border-border-gray bg-slate-50/20">
                    <div className="flex items-center">
                        <TabButton icon={Activity} active={activeTab === 'overview'} label="Health Overview" onClick={() => setActiveTab('overview')} />
                        <TabButton icon={Stethoscope} active={activeTab === 'medical'} label="Health Timeline" onClick={() => setActiveTab('medical')} />
                    </div>
                </div>
            </div>

            {/* Dynamic Content Sections */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Demographics & Info */}
                                <SectionCard title="Patient Intelligence" icon={PawPrint}>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Species</p>
                                            <p className="text-lg font-bold text-slate-900 leading-none">{pet.species.name}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Breed</p>
                                            <p className="text-lg font-bold text-slate-900 leading-none truncate">{pet.breed?.name || 'Mixed'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Gender</p>
                                            <p className="text-lg font-bold text-slate-900 leading-none">{pet.gender}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Birth Date</p>
                                            <p className="text-lg font-bold text-slate-900 leading-none">{formatDate(pet.dob)}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Color/Markings</p>
                                            <p className="text-lg font-bold text-slate-900 leading-none truncate">{pet.color || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                                            <div><Badge color={pet.is_active ? 'green' : 'gray'}>{pet.is_active ? 'Active' : 'Archived'}</Badge></div>
                                        </div>
                                    </div>
                                    {pet.notes && (
                                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-border-gray border-dashed">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <AlertCircle size={12} /> Internal Notes
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{pet.notes}"</p>
                                        </div>
                                    )}
                                </SectionCard>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm flex flex-col items-center text-center group hover:border-primary-blue/30 transition-all">
                                        <div className="w-12 h-12 bg-blue-50 text-primary-blue rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                            <TrendingUp size={20} />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                                        <p className="text-xl font-black text-slate-900">12.5 <small className="text-[10px] text-slate-400">KG</small></p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm flex flex-col items-center text-center group hover:border-danger/30 transition-all">
                                        <div className="w-12 h-12 bg-red-50 text-danger rounded-xl flex items-center justify-center mb-4 group-hover:bg-danger group-hover:text-white transition-all">
                                            <AlertCircle size={20} />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Allergies</p>
                                        <p className="text-xl font-black text-slate-900">{(pet.allergies || []).length}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm flex flex-col items-center text-center group hover:border-orange-500/30 transition-all">
                                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <Pill size={20} />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meds</p>
                                        <p className="text-xl font-black text-slate-900">{(pet.medications || []).length}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm flex flex-col items-center text-center group hover:border-success/30 transition-all">
                                        <div className="w-12 h-12 bg-green-50 text-success rounded-xl flex items-center justify-center mb-4 group-hover:bg-success group-hover:text-white transition-all">
                                            <Syringe size={20} />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Boosters</p>
                                        <p className="text-xl font-black text-slate-900">{(pet.vaccinations || []).length}</p>
                                    </div>
                                </div>

                                <SectionCard title="Guardian Logistics" icon={User}>
                                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="w-16 h-16 rounded-xl bg-white border border-border-gray flex items-center justify-center text-primary-blue font-bold text-2xl shadow-sm shrink-0">
                                            {pet.owner.first_name.charAt(0)}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h4 className="text-xl font-bold text-slate-900 mb-0.5 uppercase tracking-tight">{pet.owner.first_name} {pet.owner.last_name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Contact</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <a href={`tel:${pet.owner.phone}`} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-border-gray rounded-xl transition-all group shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                    <Phone size={16} />
                                                </div>
                                                <span className="font-bold text-xs text-slate-700">{pet.owner.phone}</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-200 group-hover:text-primary-blue transition-all" />
                                        </a>
                                        <a href={`mailto:${pet.owner.email}`} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-border-gray rounded-xl transition-all group shadow-sm">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                    <Mail size={16} />
                                                </div>
                                                <span className="font-bold text-xs text-slate-700 truncate">{pet.owner.email}</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-200 group-hover:text-primary-blue transition-all" />
                                        </a>
                                    </div>
                                </SectionCard>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-6 -translate-y-6">
                                        <CalendarCheck size={140} />
                                    </div>
                                    <h3 className="text-[10px] font-bold mb-8 relative z-10 flex items-center gap-3 uppercase tracking-[0.2em] text-white/40">
                                        <CalendarIcon size={16} /> Scheduled Visit
                                    </h3>
                                    {pet.appointments?.filter(a => ['Pending', 'Confirmed'].includes(a.status)).length > 0 ? (
                                        <div className="space-y-6 relative z-10">
                                            {pet.appointments.filter(a => ['Pending', 'Confirmed'].includes(a.status)).slice(0, 1).map(app => (
                                                <div key={app.id}>
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-14 h-14 rounded-xl bg-primary-blue/20 flex flex-col items-center justify-center font-bold border border-primary-blue/30">
                                                            <span className="text-[9px] uppercase opacity-60 mb-0.5">{formatDate(app.datetime, 'MMM')}</span>
                                                            <span className="text-xl text-white">{formatDate(app.datetime, 'dd')}</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold uppercase tracking-tight truncate">{app.reason || 'Consultation'}</p>
                                                            <p className="text-[9px] text-primary-blue font-bold uppercase tracking-[0.2em] mt-1">{formatDate(app.datetime, 'hh:mm a')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white/60">
                                                                <User size={12} />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-white/70 uppercase">DR. {app.vet?.last_name || 'Staff'}</span>
                                                        </div>
                                                        <Badge color="blue">{app.status}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative z-10 py-10 text-center">
                                            <p className="text-white/30 italic font-bold mb-8 text-[10px] uppercase tracking-widest">No pending visits detected</p>
                                            <Link href={route('appointments.index', { new: true, pet_id: pet.id })} className="block w-full py-3.5 bg-primary-blue hover:bg-primary-dark rounded-xl font-bold uppercase text-[10px] tracking-widest text-center transition-all">Initialize Booking</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl p-8 border border-border-gray shadow-sm">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Activity size={14} /> Quick Financials
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Invoices</span>
                                            <span className="text-sm font-black text-slate-900">{(pet.owner?.invoices || []).length}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Last Invoice</span>
                                            <span className="text-[10px] font-bold text-slate-900 uppercase">
                                                {pet.owner?.invoices?.length > 0 ? formatDate(pet.owner.invoices[0].invoice_date) : 'N/A'}
                                            </span>
                                        </div>
                                        <Link href={route('billing.index')} className="block w-full text-center py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-all mt-4 border border-slate-100">
                                            View All Records
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medical' && (
                        <div className="max-w-4xl mx-auto pb-20">
                            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search clinical timeline..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-white border border-border-gray pl-10 pr-4 py-3 rounded-xl text-xs font-bold focus:ring-1 focus:ring-primary-blue transition-all outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-border-gray rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                                        <Filter size={14} /> Filter
                                    </button>
                                    <button onClick={() => setIsRecordModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                                        <Plus size={16} /> New Entry
                                    </button>
                                </div>
                            </div>

                            <div className="relative space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pb-12">
                                {medicalRecords.map((record, i) => (
                                    <motion.div
                                        key={record.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="relative pl-12"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center z-10">
                                            <div className={`w-full h-full rounded-lg flex items-center justify-center ${record.isConsolidated ? 'bg-primary-blue text-white' :
                                                record.type === 'Vaccination' ? 'bg-green-500 text-white' :
                                                    record.type === 'LabResult' ? 'bg-orange-500 text-white' :
                                                        record.type === 'Medication' ? 'bg-purple-500 text-white' : 'bg-slate-500 text-white'
                                                }`}>
                                                {record.type === 'Consultation' && <Stethoscope size={14} />}
                                                {record.type === 'Vaccination' && <Syringe size={14} />}
                                                {record.type === 'LabResult' && <Activity size={14} />}
                                                {record.type === 'Medication' && <Pill size={14} />}
                                                {record.type === 'Appointment' && <CalendarCheck size={14} />}
                                                {record.type === 'Condition' && <AlertCircle size={14} />}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden hover:shadow-xl hover:border-primary-blue/30 transition-all group p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex flex-col md:flex-row md:items-center gap-6 text-left flex-1">
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-[140px] text-center">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{formatDate(record.date, 'MMM d, yyyy')}</p>
                                                        <p className="text-xs font-bold text-primary-blue">{formatDate(record.date, 'hh:mm a')}</p>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{record.title}</h4>
                                                            <Badge color={record.isVisit ? 'blue' : 'gray'}>{record.isVisit ? 'Clinical Visit' : record.type}</Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-primary-blue font-bold text-[8px]">
                                                                    {record.vet?.first_name?.charAt(0) || 'S'}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">DR. {record.vet?.last_name || 'Staff'}</span>
                                                            </div>
                                                            {record.invoice && (
                                                                <div className="flex items-center gap-2 text-emerald-600">
                                                                    <Receipt size={12} />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Total: LKR {parseFloat(record.invoice.net_amount).toLocaleString()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedRecord(record)}
                                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                                >
                                                    View Visit Intelligence <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {medicalRecords.length === 0 && (
                                    <div className="py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-inner border border-slate-100">
                                            <Activity size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Initial Clinical record required.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Global Intelligence Modal */}
            <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="New Intelligence Timeline Entry">
                <MedicalRecordForm pet={pet} onSuccess={() => setIsRecordModalOpen(false)} />
            </Modal>
            {/* Comprehensive Detail View Modal */}
            <Modal
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                title="Comprehensive Visit Intelligence"
            >
                {selectedRecord && (
                    <div className="space-y-10">
                        {/* Visit Summary Header */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary-blue text-white flex items-center justify-center shadow-lg">
                                    <Stethoscope size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{formatDate(selectedRecord.date, 'MMMM d, yyyy')}</p>
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedRecord.title}</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clinic Physician</p>
                                <p className="text-xs font-black text-slate-900 uppercase">DR. {selectedRecord.vet?.last_name || 'Staff'}</p>
                            </div>
                        </div>

                        {/* Medical Summary Section */}
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Activity size={12} className="text-primary-blue" /> Visit Intelligence & Observations
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clinical Diagnosis</p>
                                        <p className="text-sm font-bold text-slate-800 italic">"{selectedRecord.subtitle}"</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Notes</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedRecord.notes || 'No specialized clinical observations recorded.'}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedRecord.details && (
                                <div className="p-5 bg-blue-50/20 rounded-2xl border border-blue-100/30">
                                    <p className="text-[9px] font-bold text-primary-dark uppercase tracking-widest mb-2">Treatment Protocol Plan</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{selectedRecord.details}</p>
                                </div>
                            )}
                        </div>

                        {/* Financial Summary Section */}
                        {selectedRecord.invoice && (
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Receipt size={12} className="text-emerald-500" /> Visit Financial Summary
                                </h5>
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Itemized Services & Products</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">#{selectedRecord.invoice.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className="px-6 py-4 space-y-3">
                                        {selectedRecord.invoice.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <span className="font-bold text-slate-700">{item.item_name}</span>
                                                <span className="text-slate-400 font-bold text-xs">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-50/30 p-6 border-t border-slate-100 grid grid-cols-2 gap-y-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Subtotal</div>
                                        <div className="text-[11px] font-black text-slate-900 text-right">LKR {parseFloat(selectedRecord.invoice.total_amount).toLocaleString()}</div>

                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Service Charge</div>
                                        <div className="text-[11px] font-bold text-slate-700 text-right">+LKR {parseFloat(selectedRecord.invoice.service_charge || 0).toLocaleString()}</div>

                                        <div className="text-[10px] font-bold text-slate-400 uppercase uppercase">Discount Application</div>
                                        <div className="text-[11px] font-bold text-danger text-right">-LKR {parseFloat(selectedRecord.invoice.discount_amount || 0).toLocaleString()}</div>

                                        <div className="col-span-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[11px] font-black text-primary-dark uppercase tracking-widest">Total Amount Payable</span>
                                            <span className="text-xl font-black text-primary-blue">LKR {parseFloat(selectedRecord.invoice.net_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Clinical Support Section (Medications/Labs) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                            <div>
                                <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Medications Administered</h6>
                                {selectedRecord.medications?.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedRecord.medications.map((med, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                    <Pill size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 leading-none mb-1.5 uppercase">{med.drug_name}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">{med.dosage} • {med.frequency}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-300 italic font-bold uppercase tracking-widest py-4">No separate prescriptions</p>
                                )}
                            </div>
                            <div>
                                <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Diagnostic Attachments</h6>
                                {selectedRecord.lab_results?.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedRecord.lab_results.map((lab, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
                                                        <FileText size={14} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{lab.test_type}</span>
                                                </div>
                                                <Download size={14} className="text-slate-400 cursor-pointer hover:text-primary-blue" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-300 italic font-bold uppercase tracking-widest py-4">No diagnostic files</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}
