import React, { useState, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    PawPrint, User, Stethoscope, Activity,
    Syringe, FileText, TrendingUp, ChevronRight, Search, Plus,
    CheckCircle2, Pill,
    ArrowRight, X as XIcon, AlertCircle, Phone, Mail, MapPin,
    Download, Trash2, Edit3, Filter, Receipt,
    ClipboardCheck, ClipboardList, Beaker, History
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
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colors[color]}`}>
            {children}
        </span>
    );
};

const TabButton = ({ active, label, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all duration-200 relative ${active
            ? 'border-primary-blue text-primary-blue'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const SectionCard = ({ title, icon: Icon, children, action }) => (
    <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-5">
        <div className="px-5 py-3.5 border-b border-border-gray flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                {Icon && <Icon className="text-primary-blue" size={15} />}
                {title}
            </h3>
            {action}
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border-gray">
                <div className="px-6 py-4 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
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
        const visits = (pet.medical_records || []).map(mr => ({
            id: mr.id,
            type: 'Clinical Visit',
            date: mr.date_of_record,
            title: 'Consultation',
            subtitle: mr.diagnosis || 'Standard Examination',
            details: mr.treatment_plan,
            notes: mr.observations,
            vet: mr.vet,
            medications: mr.medications || [],
            vaccinations: mr.vaccinations || [],
            lab_results: mr.lab_results || [],
            invoice: mr.invoice,
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
                subtitle: `Prescription`,
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
                type: 'Lab Result',
                date: l.date_resulted || l.date_requested,
                title: l.test_type,
                subtitle: 'Diagnostic Result',
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
        { label: `${new Date().getFullYear() - new Date(pet.dob).getFullYear()} yrs`, color: 'green' }
    ];

    return (
        <AppLayout>
            <Head title={`${pet.name} — Patient Record`} />

            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-5">
                <div className="h-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1062FF 2px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900/50"></div>

                    {/* Pet Name on Background */}
                    <div className="absolute bottom-6 left-32 z-10">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-black text-white tracking-widest uppercase"
                        >
                            {pet.name}
                        </motion.h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">PAT-{pet.id.toString().padStart(4, '0')}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pet.breed?.name || 'Mixed Breed'}</span>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-5">
                    <div className="relative -mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-5">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-xl bg-white p-1.5 border border-border-gray shadow-xl group">
                                <div className="w-full h-full rounded-lg bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                    <PawPrint size={36} />
                                </div>
                            </div>
                            <div className="pt-2 md:pt-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {infoBadges.map((badge, i) => (
                                        <Badge key={i} color={badge.color}>{badge.label}</Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                    Owner: <Link href={route('owners.show', pet.owner.id)} className="text-primary-blue hover:underline font-medium">{pet.owner.first_name} {pet.owner.last_name}</Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pb-1">
                            <Link href={route('pets.edit', pet.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all shadow-sm">
                                <Edit3 size={16} />
                            </Link>
                            <button onClick={() => setIsRecordModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5">
                                <Plus size={16} />
                                Add Record
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 border-t border-border-gray bg-slate-50/20 flex items-center">
                    <TabButton icon={Activity} active={activeTab === 'overview'} label="Overview" onClick={() => setActiveTab('overview')} />
                    <TabButton icon={Stethoscope} active={activeTab === 'medical'} label="Health Timeline" onClick={() => setActiveTab('medical')} />
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10">
                            <div className="lg:col-span-2 space-y-5">
                                {/* Patient Details */}
                                <SectionCard title="Patient Details" icon={PawPrint}>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                        {[
                                            { label: 'Species', value: pet.species.name },
                                            { label: 'Breed', value: pet.breed?.name || 'Mixed' },
                                            { label: 'Gender', value: pet.gender },
                                            { label: 'Date of Birth', value: formatDate(pet.dob) },
                                            { label: 'Color', value: pet.color || 'N/A' },
                                            { label: 'Status', value: null, badge: { text: pet.is_active ? 'Active' : 'Archived', color: pet.is_active ? 'green' : 'gray' } },
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-1">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                                                {item.badge ? (
                                                    <Badge color={item.badge.color}>{item.badge.text}</Badge>
                                                ) : (
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{item.value}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {pet.notes && (
                                        <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-border-gray border-dashed">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                                <AlertCircle size={12} /> Notes
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed">{pet.notes}</p>
                                        </div>
                                    )}
                                </SectionCard>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { icon: TrendingUp, label: 'Weight', value: '12.5 KG', color: 'blue' },
                                        { icon: AlertCircle, label: 'Allergies', value: (pet.allergies || []).length, color: 'red' },
                                        { icon: Pill, label: 'Meds', value: (pet.medications || []).length, color: 'orange' },
                                        { icon: Syringe, label: 'Vaccinations', value: (pet.vaccinations || []).length, color: 'green' },
                                    ].map((stat, i) => {
                                        const colorMap = {
                                            blue: 'bg-blue-50 text-primary-blue',
                                            red: 'bg-red-50 text-danger',
                                            orange: 'bg-orange-50 text-orange-500',
                                            green: 'bg-green-50 text-success',
                                        };
                                        return (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-border-gray shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                                                <div className={`w-9 h-9 ${colorMap[stat.color]} rounded-lg flex items-center justify-center mb-2.5`}>
                                                    <stat.icon size={17} />
                                                </div>
                                                <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Owner Info */}
                                <SectionCard title="Owner Details" icon={User}>
                                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-border-gray flex items-center justify-center text-primary-blue font-bold text-lg shadow-sm shrink-0">
                                            {pet.owner.first_name.charAt(0)}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h4 className="text-base font-bold text-slate-900 mb-0.5">{pet.owner.first_name} {pet.owner.last_name}</h4>
                                            <p className="text-xs text-slate-400">Primary Contact</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <a href={`tel:${pet.owner.phone}`} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-border-gray rounded-xl transition-all group shadow-sm">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                    <Phone size={14} />
                                                </div>
                                                <span className="font-medium text-sm text-slate-700">{pet.owner.phone}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-200 group-hover:text-primary-blue transition-all" />
                                        </a>
                                        <a href={`mailto:${pet.owner.email}`} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-border-gray rounded-xl transition-all group shadow-sm">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="font-medium text-sm text-slate-700 truncate">{pet.owner.email}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-200 group-hover:text-primary-blue transition-all" />
                                        </a>
                                    </div>
                                </SectionCard>
                            </div>

                            {/* Right Sidebar */}
                            <div className="space-y-5">
                                <div className="bg-white rounded-xl p-5 border border-border-gray shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2">
                                        <Activity size={14} />Finance Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                                            <span className="text-xs font-medium text-slate-400">Total Invoices</span>
                                            <span className="text-sm font-bold text-slate-900">{(pet.owner?.invoices || []).length}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-xs font-medium text-slate-400">Last Invoice</span>
                                            <span className="text-xs font-semibold text-slate-900">
                                                {pet.owner?.invoices?.length > 0 ? formatDate(pet.owner.invoices[0].invoice_date) : 'N/A'}
                                            </span>
                                        </div>
                                        <Link href={route('billing.index')} className="block w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-500 transition-all mt-2 border border-slate-100">
                                            View All Records
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medical' && (
                        <div className="max-w-3xl mx-auto pb-16">
                            <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-white border border-border-gray pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                    />
                                </div>
                                <button onClick={() => setIsRecordModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-md">
                                    <Plus size={15} /> New Entry
                                </button>
                            </div>

                            <div className="relative space-y-6 before:absolute before:left-[18px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pb-10">
                                {medicalRecords.map((record, i) => (
                                    <motion.div
                                        key={record.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="relative pl-11"
                                    >
                                        <div className="absolute left-0 top-1 w-9 h-9 rounded-xl bg-white border-2 border-white shadow-md flex items-center justify-center z-10">
                                            <div className={`w-full h-full rounded-lg flex items-center justify-center ${record.type === 'Vaccination' ? 'bg-green-500 text-white' :
                                                record.type === 'Lab Result' ? 'bg-orange-500 text-white' :
                                                    record.type === 'Medication' ? 'bg-purple-500 text-white' : 'bg-primary-blue text-white'
                                                }`}>
                                                {record.type === 'Vaccination' && <Syringe size={13} />}
                                                {record.type === 'Lab Result' && <Activity size={13} />}
                                                {record.type === 'Medication' && <Pill size={13} />}
                                                {(record.type === 'Clinical Visit' || record.type === 'Consultation') && <Stethoscope size={13} />}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden hover:shadow-md hover:border-primary-blue/20 transition-all group">
                                            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                                                    <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 min-w-[120px] text-center">
                                                        <p className="text-xs font-semibold text-slate-500">{formatDate(record.date, 'MMM d, yyyy')}</p>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-bold text-slate-900 truncate">{record.title}</h4>
                                                            <Badge color={record.isVisit ? 'blue' : 'gray'}>{record.isVisit ? 'Visit' : record.type}</Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <span className="text-xs font-medium text-slate-500">
                                                                Dr. {record.vet?.last_name || 'Staff'}
                                                            </span>
                                                            {record.invoice && (
                                                                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                                    <Receipt size={11} />
                                                                    LKR {parseFloat(record.invoice.net_amount).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedRecord(record)}
                                                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all shadow-md whitespace-nowrap"
                                                >
                                                    View Details <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {medicalRecords.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3 border border-slate-100">
                                            <Activity size={24} />
                                        </div>
                                        <p className="text-slate-400 font-medium text-sm">No health records found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Add Record Modal */}
            <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Add Medical Record">
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); setIsRecordModalOpen(false); }}>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Record Type</label>
                        <select className="w-full bg-slate-50 border border-border-gray rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none">
                            <option>Consultation</option>
                            <option>Vaccination</option>
                            <option>Lab Result</option>
                            <option>Condition</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Diagnosis / Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-border-gray rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                            placeholder="Enter diagnosis or record title"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Treatment Plan</label>
                        <textarea
                            className="w-full bg-slate-50 border border-border-gray rounded-xl px-3.5 py-2.5 text-sm font-medium min-h-[100px] focus:ring-2 focus:ring-primary-blue/10 outline-none resize-none"
                            placeholder="Describe the treatment plan..."
                        />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all">
                        Save Record
                    </button>
                </form>
            </Modal>

            {/* Session Intelligence Report Modal */}
            <AnimatePresence>
                {selectedRecord && selectedRecord.isVisit && (
                    <CaseDetailsModal
                        record={pet.medical_records.find(r => r.id === selectedRecord.id)}
                        onClose={() => setSelectedRecord(null)}
                    />
                )}
            </AnimatePresence>

            {/* Visit Detail Modal (Fall-back for non-visit records) */}
            <Modal isOpen={!!selectedRecord && !selectedRecord.isVisit} onClose={() => setSelectedRecord(null)} title="Record Details">
                {selectedRecord && !selectedRecord.isVisit && (
                    <div className="space-y-5">
                        {/* Visit Header */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-blue text-white flex items-center justify-center shadow-md">
                                    <Stethoscope size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400 mb-0.5">{formatDate(selectedRecord.date, 'MMMM d, yyyy')}</p>
                                    <h4 className="text-base font-bold text-slate-900">{selectedRecord.title}</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-0.5">Physician</p>
                                <p className="text-sm font-semibold text-slate-900">Dr. {selectedRecord.vet?.last_name || 'Staff'}</p>
                            </div>
                        </div>

                        {/* Medical Summary */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Diagnosis</p>
                                    <p className="text-sm font-medium text-slate-800">{selectedRecord.subtitle}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Notes</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{selectedRecord.notes || 'No notes recorded.'}</p>
                                </div>
                            </div>

                            {selectedRecord.details && (
                                <div className="p-4 bg-blue-50/20 rounded-xl border border-blue-100/30">
                                    <p className="text-xs font-semibold text-primary-dark uppercase tracking-wide mb-1.5">Treatment Plan</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{selectedRecord.details}</p>
                                </div>
                            )}
                        </div>

                        {/* Invoice */}
                        {selectedRecord.invoice && (
                            <div className="space-y-3">
                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                    <Receipt size={12} className="text-emerald-500" /> Invoice Summary
                                </h5>
                                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                    <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500">Items</span>
                                        <span className="text-xs text-slate-400">#{selectedRecord.invoice.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className="px-5 py-3 space-y-2">
                                        {selectedRecord.invoice.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-700">{item.item_name}</span>
                                                <span className="text-slate-400 text-xs">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-50/30 p-4 border-t border-slate-100 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-semibold text-slate-900">LKR {parseFloat(selectedRecord.invoice.total_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Service Charge</span>
                                            <span className="font-medium text-slate-700">+LKR {parseFloat(selectedRecord.invoice.service_charge || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Discount</span>
                                            <span className="font-medium text-danger">-LKR {parseFloat(selectedRecord.invoice.discount_amount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-900">Total</span>
                                            <span className="text-lg font-bold text-primary-blue">LKR {parseFloat(selectedRecord.invoice.net_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medications & Labs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                            <div>
                                <h6 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Medications</h6>
                                {selectedRecord.medications?.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedRecord.medications.map((med, i) => (
                                            <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                                                    <Pill size={13} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800 mb-0.5">{med.drug_name}</p>
                                                    <p className="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic py-3">No medications administered.</p>
                                )}
                            </div>
                            <div>
                                <h6 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Lab Results</h6>
                                {selectedRecord.lab_results?.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedRecord.lab_results.map((lab, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
                                                        <FileText size={13} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-700">{lab.test_type}</span>
                                                </div>
                                                <Download size={13} className="text-slate-400 cursor-pointer hover:text-primary-blue" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic py-3">No lab results attached.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout >
    );
}

const CaseDetailsModal = ({ record, onClose }) => {
    if (!record) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <ClipboardCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Session intelligence report</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-600 italic">{format(parseISO(record.date_of_record), 'MMMM dd, yyyy')}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                <span className="text-[10px] font-bold text-blue-500">Case ID: #{record.id}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Clinical Signs */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Activity size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Clinical signs</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {record.clinical_signs?.length > 0 ? record.clinical_signs.map((sign, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 rounded-xl uppercase tracking-tight">{sign}</span>
                                )) : <p className="text-[10px] text-slate-700 italic">No clinical signs recorded</p>}
                            </div>
                        </section>

                        {/* Lab Findings */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <Beaker size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Lab findings</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {record.lab_findings?.length > 0 ? record.lab_findings.map((finding, i) => (
                                    <span key={i} className="px-4 py-2 bg-purple-50/30 border border-purple-100 text-[10px] font-bold text-purple-600 rounded-xl uppercase tracking-tight">{finding}</span>
                                )) : <p className="text-[10px] text-slate-700 italic">No lab findings recorded</p>}
                            </div>
                        </section>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                    <History size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">History summary</h3>
                            </div>
                            <p className="text-[11px] font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                {record.patient_history?.length > 0 ? record.patient_history.join(', ') : 'No historical data provided.'}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Stethoscope size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Final diagnosis</h3>
                            </div>
                            <div className="bg-emerald-600 p-4 rounded-xl shadow-lg shadow-emerald-600/20 text-white">
                                <p className="text-xs font-bold tracking-tight">{record.diagnosis || 'Clinical evaluation inconclusive'}</p>
                            </div>
                        </section>
                    </div>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <ClipboardList size={16} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Comprehensive Treatment Plan</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Syringe size={14} className="text-blue-500" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Clinical Interventions</span>
                                </div>
                                <div className="space-y-2">
                                    {(record.medications?.filter(m => m.dosage?.startsWith('Administered')) || []).length > 0 ?
                                        record.medications.filter(m => m.dosage?.startsWith('Administered')).map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-900 uppercase">{m.drug_name}</span>
                                                <span className="text-[9px] font-black text-blue-500 bg-white px-2 py-0.5 rounded border border-blue-50">{m.quantity} Qty</span>
                                            </div>
                                        )) : <p className="text-[10px] text-slate-700 italic">No injections administered</p>}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Pill size={14} className="text-indigo-500" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Take-home Prescription</span>
                                </div>
                                <div className="space-y-2">
                                    {(record.medications?.filter(m => !m.dosage?.startsWith('Administered')) || []).length > 0 ?
                                        record.medications.filter(m => !m.dosage?.startsWith('Administered')).map((m, i) => (
                                            <div key={i} className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-slate-900">{m.drug_name}</span>
                                                    <span className="text-[9px] font-black text-indigo-500 bg-white px-2 py-0.5 rounded border border-indigo-50">{m.quantity} Qty</span>
                                                </div>
                                                <div className="flex gap-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest italic">
                                                    <span>{m.frequency}</span>
                                                    <span>•</span>
                                                    <span>{m.duration}</span>
                                                </div>
                                            </div>
                                        )) : <p className="text-[10px] text-slate-700 italic">No take-home medicines prescribed</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] italic">Precision Veterinary Case Intelligence</p>
                    <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                        Dismiss Record
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
