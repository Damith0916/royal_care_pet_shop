import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Search,
    User,
    PawPrint,
    ChevronRight,
    History,
    Stethoscope,
    Activity,
    FileText,
    Dna,
    Plus,
    Minus,
    X,
    Trash2,
    Calendar,
    DollarSign,
    CheckCircle2,
    Printer,
    ClipboardList,
    AlertCircle,
    Thermometer,
    Weight,
    Layers,
    ShoppingCart,
    Edit2,
    UserPlus,
    PlusCircle,
    Shield,
    ShieldCheck,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    ReceiptText,
    Terminal,
    ClipboardCheck,
    Syringe,
    Zap,
    Pill,
    Beaker,
    Dog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { format, differenceInYears, differenceInMonths, differenceInDays, addMonths, addYears } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'In Progress': 'bg-blue-50 text-primary-blue border-blue-100',
        'Pending': 'bg-slate-50 text-slate-700 border-slate-100',
        'Cancelled': 'bg-red-50 text-danger border-red-100'
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-tight border shadow-sm ${colors[status] || colors.Pending}`}>
            {status}
        </span>
    );
};

const TimelineRecord = ({ record, isLast, onView, petDob }) => {
    // Exact Age Calculation at the time of record
    const calculateAgeAtRecord = (dob, recordDate) => {
        if (!dob || !recordDate) return 'N/A';
        const birth = new Date(dob);
        const dateOfRecord = new Date(recordDate);
        if (birth > dateOfRecord) return 'Unborn';

        const years = differenceInYears(dateOfRecord, birth);
        const months = differenceInMonths(dateOfRecord, birth) % 12;
        const days = differenceInDays(dateOfRecord, addMonths(addYears(birth, years), months));

        return (
            <div className="flex flex-row gap-1 items-center leading-tight whitespace-nowrap">
                {years > 0 && <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800">{years}Y</span>}
                {months > 0 && <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800">{months}M</span>}
                {days > 0 && <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800">{days}D</span>}
                {years === 0 && months === 0 && days === 0 && <span className="text-[10px] font-black text-slate-800">Newborn</span>}
            </div>
        );
    };

    const isToday = new Date(record.date_of_record).toLocaleDateString() === new Date().toLocaleDateString();

    const medications = record.medications || [];
    const vaccinations = record.vaccinations || [];

    const clinicActions = [
        ...vaccinations.map(v => `${v.vaccine_type} (1 qty)`),
        ...medications.filter(m => m.dosage?.startsWith('Administered')).map(m =>
            `${m.drug_name} (${m.dosage?.match(/\(([^)]+)\)/)?.[1] || '1 qty'})`
        )
    ];

    const scripts = medications.filter(m => !m.dosage?.startsWith('Administered')).map(m =>
        `${m.drug_name} (${m.dosage || '1 dose'})`
    );

    const formatArray = (arr) => arr && arr.length > 0 ? arr.join(', ') : '-';

    return (
        <tr className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 group cursor-pointer" onClick={onView}>
            <td className="p-1 px-2 text-[10px] text-slate-700 align-top">
                <div className="font-bold tabular-nums leading-tight">
                    <span className="block text-[8px] text-slate-400">{format(new Date(record.date_of_record), 'yyyy')}</span>
                    <span className="block">{format(new Date(record.date_of_record), 'MM/dd')}</span>
                </div>
                {isToday && <span className="text-[7px] font-black bg-blue-500 text-white px-1 py-0 rounded uppercase tracking-tighter mt-1 inline-block">TODAY</span>}
            </td>
            <td className="p-1 px-2 text-xs text-slate-600 align-top">{calculateAgeAtRecord(petDob, record.date_of_record)}</td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top font-black tabular-nums">{record.weight_kg ? record.weight_kg : '-'}</td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[80px]"><div>{formatArray(record.complane)}</div></td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[100px]"><div>{formatArray(record.patient_history)}</div></td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[100px]"><div>{formatArray(record.clinical_signs)}</div></td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[100px]"><div>{formatArray(record.lab_findings)}</div></td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[80px]"><div>{formatArray(record.differential_diagnosis)}</div></td>
            <td className="p-1 px-2 align-top min-w-[80px]">
                {record.diagnosis ? (
                    <div className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-tighter">
                        {record.diagnosis}
                    </div>
                ) : '-'}
            </td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[120px]">
                <div className="flex flex-col gap-1">
                    {clinicActions.length > 0 ? clinicActions.map((act, idx) => (
                        <div key={idx} className="leading-tight border-b border-slate-50 last:border-0 pb-0.5 last:pb-0 font-medium">{act}</div>
                    )) : '-'}
                </div>
            </td>
            <td className="p-1 px-2 text-[10px] text-slate-600 align-top min-w-[120px]">
                <div className="flex flex-col gap-1">
                    {scripts.length > 0 ? scripts.map((scr, idx) => (
                        <div key={idx} className="leading-tight border-b border-slate-50 last:border-0 pb-0.5 last:pb-0 font-black text-slate-900">{scr}</div>
                    )) : '-'}
                </div>
            </td>
            <td className="p-1 px-2 text-[10px] text-slate-500 align-top min-w-[100px] italic leading-tight">
                {record.rx_note || '-'}
            </td>
            <td className="p-1 px-2 text-center align-top whitespace-nowrap space-x-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/new-case/${record.id}/prescription-print`, '_blank');
                    }}
                    className="p-1 bg-violet-100 text-violet-600 rounded hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                    title="Print Prescription"
                >
                    <Printer size={10} />
                </button>
            </td>
        </tr>
    );
};

const StepIndicator = ({ steps, activeStep, onStepClick }) => (
    <div className="flex items-center justify-between w-full mb-6 relative px-2">
        {/* Minimalist Progress Track */}
        <div className="absolute top-1.5 left-0 w-full h-[1px] bg-slate-100 z-0">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(activeStep) / (steps.length - 1) * 100}%` }}
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
            />
        </div>

        {steps.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;

            return (
                <div key={idx} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => onStepClick(idx)}>
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={{
                                backgroundColor: isActive ? '#2563eb' : isCompleted ? '#eff6ff' : '#f8fafc',
                                color: isActive ? '#fff' : isCompleted ? '#2563eb' : '#64748b',
                                borderColor: isActive ? '#2563eb' : isCompleted ? '#bfdbfe' : '#e2e8f0'
                            }}
                            className={`px-3 py-1 rounded-lg border text-[10px] font-bold tracking-tight transition-all duration-300 shadow-sm mb-2 ${isActive ? 'shadow-[0_4px_12px_rgba(37,99,235,0.2)]' : 'group-hover:border-slate-300'}`}
                        >
                            {step.label}
                        </motion.div>

                        <motion.div
                            animate={{
                                scale: isActive ? 1.2 : 1,
                                backgroundColor: isActive ? '#2563eb' : isCompleted ? '#2563eb' : '#fff',
                                borderColor: isActive ? '#2563eb' : isCompleted ? '#2563eb' : '#cbd5e1'
                            }}
                            className={`w-2 h-2 rounded-full border-2 z-10 transition-all ${isActive || isCompleted ? 'shadow-[0_0_10px_rgba(37,99,235,0.4)]' : ''}`}
                        />
                    </div>
                </div>
            );
        })}
    </div>
);

export default function Index({ initialDiagnoses, products, clinic }) {
    const [step, setStep] = useState(0);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [history, setHistory] = useState([]);
    const [ownerSearch, setOwnerSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Exact Age Calculation
    const calculateExactAge = (dob) => {
        if (!dob) return 'N/A';
        const birth = new Date(dob);
        const now = new Date();
        if (birth > now) return 'Unborn';

        const years = differenceInYears(now, birth);
        const months = differenceInMonths(now, birth) % 12;

        const birthDateInCurrentMonth = new Date(now.getFullYear(), now.getMonth(), birth.getDate());
        let days;
        if (now >= birthDateInCurrentMonth) {
            days = differenceInDays(now, birthDateInCurrentMonth);
        } else {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, birth.getDate());
            days = differenceInDays(now, lastMonth);
        }

        return (
            <div className="flex flex-col items-center leading-none text-center bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm min-w-[50px]">
                {years > 0 && <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">{years}Y</span>}
                {months > 0 && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{months}M</span>}
                {days >= 0 && (years === 0 || days > 0) && <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">{days}D</span>}
            </div>
        );
    };

    const steps = [
        { id: 'weight', label: 'Weight', icon: Weight },
        { id: 'complane', label: 'Complaints', icon: AlertCircle },
        { id: 'history', label: 'Patient History', icon: History },
        { id: 'signs', label: 'Clinical Signs', icon: Activity },
        { id: 'lab', label: 'Lab Findings', icon: FileText },
        { id: 'dd', label: 'Differential Diagnosis', icon: Dna },
        { id: 'diagnosis', label: 'Final Diagnosis', icon: ClipboardList },
        { id: 'injection', label: 'Injections / Clinical', icon: Syringe },
        { id: 'prescription', label: 'Prescription', icon: Pill },
    ];

    const { data, setData, post, processing, errors } = useForm({
        pet_id: '',
        complane: [],
        patient_history: [],
        clinical_signs: [],
        lab_findings: [],
        differential_diagnosis: [],
        final_diagnoses: [],
        diagnosis: '',
        final_note: '',
        treatment_plan: '',
        weight_kg: '',
        items: [],
        prescribed_drugs: [],
        rx_note: '',
        service_charge: 1000,
    });

    const [diagnoses, setDiagnoses] = useState(initialDiagnoses);
    const [productSearch, setProductSearch] = useState('');
    const [retailSearch, setRetailSearch] = useState('');
    const [activeTreatmentTab, setActiveTreatmentTab] = useState('clinic');
    const [activeSubTab, setActiveSubTab] = useState('procedures');
    const [matrixExpanded, setMatrixExpanded] = useState(false);
    const [ddSearch, setDdSearch] = useState('');
    const [diagSearch, setDiagSearch] = useState('');
    const [selectedCaseForView, setSelectedCaseForView] = useState(null);
    const [currentRemarkIndex, setCurrentRemarkIndex] = useState(0);
    const [isSliderPaused, setIsSliderPaused] = useState(false);
    const [isAddingRemark, setIsAddingRemark] = useState(false);
    const [editingRemarkIndex, setEditingRemarkIndex] = useState(null);
    const [remarkInput, setRemarkInput] = useState('');
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingQty, setPendingQty] = useState('1');
    const [ddHighlight, setDdHighlight] = useState(-1);
    const [injSearch, setInjSearch] = useState('');
    const [injHighlight, setInjHighlight] = useState(-1);
    const [rxSearch, setRxSearch] = useState('');
    const [rxHighlight, setRxHighlight] = useState(-1);
    const [rxPendingItem, setRxPendingItem] = useState(null);
    const [rxQty, setRxQty] = useState('');
    const [rxFreq, setRxFreq] = useState('');
    const [rxDuration, setRxDuration] = useState('');
    const [rxStage, setRxStage] = useState('name');
    const [serviceChargeInput, setServiceChargeInput] = useState('1000');
    const [editingListItem, setEditingListItem] = useState(null);
    const [editingListValue, setEditingListValue] = useState('');
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finishModalStage, setFinishModalStage] = useState('note'); // 'note' | 'service'
    const [savedRecord, setSavedRecord] = useState(null);
    const [lowStockPopup, setLowStockPopup] = useState(null);

    useEffect(() => {
        if (!pendingItem && !rxPendingItem && !showFinishModal && selectedPet) {
            const timeout = setTimeout(() => {
                const input = document.getElementById(`step-input-${step}`);
                if (input) input.focus();
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [step, pendingItem, rxPendingItem, showFinishModal, selectedPet]);

    useEffect(() => { setDdHighlight(-1); }, [diagSearch]);
    useEffect(() => { setInjHighlight(-1); }, [injSearch]);
    useEffect(() => { setRxHighlight(-1); }, [rxSearch]);

    const combinedRemarksArr = [
        ...(selectedPet?.special_characteristics?.split("\n").filter(r => r.trim()) || []),
        ...data.items.map(i => `${i.name} (${i.quantity} Qty)`),
        ...data.prescribed_drugs.map(d => `Script: ${d.name} (${d.quantity} ${d.frequency})`)
    ];

    useEffect(() => {
        if (combinedRemarksArr.length <= 1 || isSliderPaused) {
            setCurrentRemarkIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentRemarkIndex(prev => (prev + 1) % combinedRemarksArr.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [combinedRemarksArr.length, isSliderPaused]);


    // Registration Modals State
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [showPetModal, setShowPetModal] = useState(false);
    const [newOwnerData, setNewOwnerData] = useState({ first_name: '', last_name: '', phone: '', email: '', address: '' });
    const [newPetData, setNewPetData] = useState({ name: '', species_id: '', breed_id: '', dob: '', gender: 'Unknown', color: '' });
    const [species, setSpecies] = useState([]);
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        if (showPetModal) {
            axios.get(route('api.species')).then(res => setSpecies(res.data));
        }
    }, [showPetModal]);

    useEffect(() => {
        if (newPetData.species_id) {
            axios.get(route('api.breeds', newPetData.species_id)).then(res => setBreeds(res.data));
        }
    }, [newPetData.species_id]);

    const handleOwnerRegistration = async () => {
        try {
            const res = await axios.post(route('new-case.owner.store'), newOwnerData);
            setOwners([res.data]);
            setSelectedOwner(res.data);
            setShowOwnerModal(false);
        } catch (e) { console.error(e); }
    };

    const handlePetRegistration = async () => {
        try {
            const res = await axios.post(route('new-case.pet.store'), { ...newPetData, owner_id: selectedOwner.id });
            setPets(prev => [...prev, res.data]);
            handlePetSelect(res.data);
            setShowPetModal(false);
        } catch (e) { console.error(e); }
    };

    const searchOwners = useCallback(async (val) => {
        if (val.length < 1) return;
        setIsSearching(true);
        try {
            const res = await axios.get(route('new-case.owners'), { params: { search: val } });
            setOwners(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (ownerSearch) searchOwners(ownerSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [ownerSearch, searchOwners]);

    const handleOwnerSelect = async (owner) => {
        setSelectedOwner(owner);
        const res = await axios.get(route('new-case.pets', owner.id));
        setPets(res.data);
    };

    const handlePetSelect = async (pet) => {
        setSelectedPet(pet);
        setData('pet_id', pet.id);
        const res = await axios.get(route('new-case.history', pet.id));
        setHistory(res.data);
    };

    const addListItem = (key, value) => {
        if (!value) return;
        setData(key, [...data[key], value]);
    };

    const removeListItem = (key, index) => {
        setData(key, data[key].filter((_, i) => i !== index));
    };

    const handlePreviewPrint = (type) => {
        const url = type === 'bill' ? route('new-case.bill-preview') : route('new-case.prescription-preview');
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = '_blank';

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = token;
            form.appendChild(csrfInput);
        }

        const itemsTotal = data.items.reduce((acc, cr) => acc + (parseFloat(cr.price || 0) * (parseFloat(cr.quantity) || 0)), 0);
        const scriptTotal = data.prescribed_drugs.reduce((acc, cr) => acc + (parseFloat(cr.price || 0) * (parseFloat(cr.quantity) || 1)), 0);

        // For Bill: Only include Step 7 items + Service Charge. For Prescription: Just metadata.
        const calcTotal = type === 'bill' ? (itemsTotal + parseFloat(data.service_charge || 0)) : 0;

        // Explicitly send important bits for printing
        const fields = {
            pet_id: selectedPet?.id,
            items: JSON.stringify(data.items),
            prescribed_drugs: JSON.stringify(data.prescribed_drugs),
            rx_note: data.rx_note,
            service_charge: data.service_charge,
            total_amount: calcTotal
        };

        Object.keys(fields).forEach(key => {
            if (fields[key] !== undefined) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            }
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const handleSubmit = async () => {
        const drugText = data.prescribed_drugs.map(d => `${d.name} (${d.quantity} ${d.frequency} ${d.duration})`).join('\n');
        const combinedDiagnosis = data.final_diagnoses.length > 0 ? data.final_diagnoses.join(', ') : data.diagnosis;
        const finalTreatmentPlan = data.treatment_plan + (drugText ? '\n\nPRESCRIPTION:\n' + drugText : '');

        try {
            const response = await axios.post(route('new-case.store'), {
                ...data,
                diagnosis: combinedDiagnosis,
                treatment_plan: finalTreatmentPlan,
                observations: data.rx_note || '',
                record_id: savedRecord?.id,
                invoice_id: savedRecord?.invoice?.id
            }, {
                headers: { 'Accept': 'application/json' }
            });

            if (response.data.success) {
                const resData = { id: response.data.record_id, invoice: { id: response.data.invoice_id }, low_stock_alerts: response.data.low_stock_alerts };
                setSavedRecord(resData);
                router.reload({ only: ['history'] });
                return resData;
            }
            return null;
        } catch (error) {
            console.error('Error saving case:', error);
            alert('An error occurred while saving the case.');
            return null;
        }
    };

    const handleRegisterDiagnosis = async (name) => {
        if (!name?.trim()) return null;
        try {
            const res = await axios.post(route('diagnoses.store'), { name: name.trim() });
            setDiagnoses(prev => [...prev, res.data]);
            return res.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    if (!selectedPet) {
        return (
            <AppLayout title="New Case">
                <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-50/30">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {/* Bolder Medical Shading - Structured System Blue */}
                        <div className="absolute top-0 right-[-10%] w-[50%] h-full bg-[#1062FF]/5 -skew-x-12 transform-gpu"></div>
                        <div className="absolute bottom-0 left-[-5%] w-[30%] h-[70%] bg-[#1062FF]/[0.03] skew-x-12 transform-gpu"></div>

                        {/* High-Fidelity Glass Layer - Minimalist */}
                        <div className="absolute inset-0 bg-white/5 border-l border-white/10 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="w-full max-w-4xl relative z-10 max-h-[85vh] flex flex-col">
                        <div className="text-center mb-5">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm mb-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-slate-600">New Case</span>
                            </motion.div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Select Patient</h1>
                            <p className="text-xs text-slate-500">Search for an owner to find their pets</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col min-h-0">
                            <AnimatePresence mode="wait">
                                {!selectedOwner ? (
                                    <motion.div
                                        key="owner-search"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="p-6 flex-1 flex flex-col min-h-0"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="relative flex-1 group">
                                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Search caretaker..."
                                                    className="w-full pl-12 pr-10 py-4 bg-white/50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300/30 transition-all outline-none placeholder:text-slate-700 italic"
                                                    value={ownerSearch}
                                                    onChange={(e) => setOwnerSearch(e.target.value)}
                                                />
                                                {isSearching && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setShowOwnerModal(true)}
                                                className="h-[52px] px-5 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95"
                                            >
                                                <UserPlus size={16} /> New Owner
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                            {owners.length > 0 ? owners.map(owner => (
                                                <motion.button
                                                    layout
                                                    whileHover={{ y: -2, scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    key={owner.id}
                                                    onClick={() => handleOwnerSelect(owner)}
                                                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-50 rounded-xl hover:bg-slate-900 transition-all group shadow-sm hover:shadow-xl hover:shadow-slate-900/10"
                                                >
                                                    <div className="flex items-center gap-3 text-left">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-white/10 group-hover:text-white transition-all">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 group-hover:text-white text-[11px] uppercase tracking-tight italic transition-colors leading-none mb-1">{owner.first_name} {owner.last_name}</h3>
                                                            <p className="text-[8px] font-black text-slate-600 group-hover:text-slate-600 uppercase tracking-widest transition-colors">{owner.phone || 'No Contact'}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-white transition-all" />
                                                </motion.button>
                                            )) : ownerSearch && !isSearching && (
                                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                                                    <p className="text-slate-600 font-bold uppercase tracking-[0.2em] text-[9px] italic">No Match Results</p>
                                                </div>
                                            )}
                                            {!ownerSearch && (
                                                <div className="col-span-full flex flex-col items-center justify-center py-12 opacity-40">
                                                    <Search size={22} className="text-slate-400 mb-2" />
                                                    <p className="text-xs font-medium text-slate-500">Search by name or phone number</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pet-selection"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10 border border-slate-800">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 leading-none mb-1">{selectedOwner.first_name} {selectedOwner.last_name}</h3>
                                                    <p className="text-xs font-medium text-slate-500">Owner</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOwner(null)}
                                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                            >
                                                <ChevronLeft size={14} /> Change owner
                                            </button>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col min-h-0 overflow-hidden">
                                            <div className="flex items-center gap-3 mb-4">
                                                <p className="text-xs font-semibold text-slate-500">Pets</p>
                                                <div className="h-px flex-1 bg-slate-100"></div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                {pets.map(pet => (
                                                    <motion.button
                                                        whileHover={{ y: -3, scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        key={pet.id}
                                                        onClick={() => handlePetSelect(pet)}
                                                        className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all flex flex-col items-center text-center group relative overflow-hidden"
                                                    >
                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner mb-4 relative z-10 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                                            <PawPrint size={22} />
                                                        </div>
                                                        <div className="relative z-10">
                                                            <h3 className="font-bold text-slate-900 text-sm mb-0.5 transition-colors group-hover:text-blue-600 leading-none">{pet.name}</h3>
                                                            <p className="text-xs font-medium text-slate-500 leading-tight">{pet.breed?.name || pet.species?.name}</p>
                                                        </div>
                                                    </motion.button>
                                                ))}

                                                <motion.button
                                                    whileHover={{ y: -3, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setShowPetModal(true)}
                                                    className="bg-slate-50/50 p-5 border border-dashed border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-white transition-all flex flex-col items-center justify-center text-center group"
                                                >
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-all shadow-sm border border-slate-50 mb-3">
                                                        <Plus size={16} strokeWidth={3} />
                                                    </div>
                                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-600 transition-colors italic">New Patient</p>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-4 flex items-center justify-center px-4">
                            <p className="text-xs font-medium text-slate-400">Smart Pet Care — Clinical Management</p>
                        </div>
                    </div>
                </div>

                {/* Registration Modals */}
                <AnimatePresence>
                    {showOwnerModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/60">
                                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                            <UserPlus size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register Owner</h3>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-70">Initialize client matrix</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowOwnerModal(false)} className="p-2.5 text-slate-700 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95"><X size={20} /></button>
                                </div>
                                <div className="p-8 space-y-5" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const focusableElements = Array.from(
                                            e.currentTarget.querySelectorAll('input, textarea, button')
                                        ).filter(el => !el.disabled && el.tabIndex !== -1);
                                        const index = focusableElements.indexOf(e.target);
                                        if (index > -1 && index < focusableElements.length - 1) {
                                            e.preventDefault();
                                            focusableElements[index + 1].focus();
                                        } else if (index === focusableElements.length - 1) {
                                            e.preventDefault();
                                            focusableElements[index].click();
                                        }
                                    }
                                }}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <input autoFocus placeholder="First Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newOwnerData.first_name} onChange={e => setNewOwnerData({ ...newOwnerData, first_name: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <input placeholder="Last Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newOwnerData.last_name} onChange={e => setNewOwnerData({ ...newOwnerData, last_name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Contact Channel</label>
                                        <input placeholder="Phone Number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newOwnerData.phone} onChange={e => setNewOwnerData({ ...newOwnerData, phone: e.target.value })} />
                                    </div>
                                    <input placeholder="Email Address (Optional)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newOwnerData.email} onChange={e => setNewOwnerData({ ...newOwnerData, email: e.target.value })} />
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Physical Location</label>
                                        <textarea placeholder="Full Physical Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all min-h-[100px] resize-none" value={newOwnerData.address} onChange={e => setNewOwnerData({ ...newOwnerData, address: e.target.value })} />
                                    </div>
                                    <button onClick={handleOwnerRegistration} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-[10px]">Commit Profile</button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {showPetModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                            <PlusCircle size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register Patient</h3>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-70">Initialize clinical entity tracking</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowPetModal(false)} className="p-2.5 text-slate-700 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95"><X size={20} /></button>
                                </div>
                                <div className="p-8 space-y-5" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const focusableElements = Array.from(
                                            e.currentTarget.querySelectorAll('input, select, textarea, button')
                                        ).filter(el => !el.disabled && el.tabIndex !== -1);
                                        const index = focusableElements.indexOf(e.target);
                                        if (index > -1 && index < focusableElements.length - 1) {
                                            if (e.target.tagName !== 'SELECT') {
                                                e.preventDefault();
                                                focusableElements[index + 1].focus();
                                            }
                                        } else if (index === focusableElements.length - 1) {
                                            e.preventDefault();
                                            focusableElements[index].click();
                                        }
                                    }
                                }}>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Identity</label>
                                        <input autoFocus placeholder="Pet Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newPetData.name} onChange={e => setNewPetData({ ...newPetData, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Species</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-300 transition-all appearance-none cursor-pointer" value={newPetData.species_id} onChange={e => setNewPetData({ ...newPetData, species_id: e.target.value })}>
                                                <option value="">Select Species</option>
                                                {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Breed</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-300 transition-all appearance-none cursor-pointer" value={newPetData.breed_id} onChange={e => setNewPetData({ ...newPetData, breed_id: e.target.value })}>
                                                <option value="">Select Breed</option>
                                                {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Birthday</label>
                                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-blue-300 transition-all" value={newPetData.dob} onChange={e => setNewPetData({ ...newPetData, dob: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Gender</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-300 transition-all appearance-none cursor-pointer" value={newPetData.gender} onChange={e => setNewPetData({ ...newPetData, gender: e.target.value })}>
                                                <option value="Unknown">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Phenotypic Markers</label>
                                        <input placeholder="Color / Markings / Distinguishing ID" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-300 outline-none transition-all" value={newPetData.color} onChange={e => setNewPetData({ ...newPetData, color: e.target.value })} />
                                    </div>
                                    <button onClick={handlePetRegistration} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-[10px]">Commit Patient</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            title={`Case: ${selectedPet.name}`}
            mainClassName="p-1 lg:p-2 min-h-[calc(100vh-80px)]"
            header={
                <div className="flex items-center justify-between w-full h-full pr-4">
                    {/* Left: Pet & Owner Identity (Stacked) */}
                    <div className="flex items-center gap-4 border-r border-slate-100 pr-4 h-full ml-2 py-1">
                        <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))} className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg flex-shrink-0 group transition-transform hover:scale-105 cursor-pointer outline-none">
                            <PawPrint size={28} className="stroke-[2.5]" />
                        </button>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none italic">
                                    {selectedPet.name}
                                </h1>
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold rounded-md border border-emerald-200 leading-none">Active</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 leading-none">
                                {selectedPet.species?.name} • {selectedPet.breed?.name} • {selectedPet.gender}
                            </p>
                        </div>
                        <div className="ml-2">
                            {calculateExactAge(selectedPet.dob)}
                        </div>
                    </div>

                    {/* Middle/Right: Consolidated Patient Remarks Slider */}
                    <div className="flex-1 px-8 flex items-center justify-between h-full bg-white border-l border-slate-50 transition-colors relative">
                        <div className="flex items-center gap-6 w-full">
                            <div className="relative group/input shrink-0">
                                <div className="mb-1">
                                    <span className="text-[11px] font-bold flex items-center gap-2 text-slate-900">
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-orange-500"></div>
                                        Pet remarks
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => setMatrixExpanded(!matrixExpanded)}
                                        className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${matrixExpanded ? 'bg-orange-500 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-500'}`}
                                    >
                                        <History size={16} />
                                        <span className="text-[10px] font-bold px-1">Remarks</span>
                                        {matrixExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </motion.button>
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    backgroundColor: ['#2563eb', '#1e40af', '#2563eb'],
                                    boxShadow: [
                                        '0 0 15px rgba(37, 99, 235, 0.4)',
                                        '0 0 40px rgba(37, 99, 235, 0.7)',
                                        '0 0 15px rgba(37, 99, 235, 0.4)'
                                    ]
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="flex items-center gap-3 flex-1 min-w-0 max-w-[600px] relative h-13 rounded-xl px-4 overflow-hidden group/slider transition-all bg-[#2563eb] border-[4px] border-white"
                                onMouseEnter={() => setIsSliderPaused(true)}
                                onMouseLeave={() => setIsSliderPaused(false)}
                            >
                                {/* Decorative Paw Print Background Pattern */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex justify-around items-center">
                                    <PawPrint size={32} className="rotate-12 text-white" />
                                    <PawPrint size={24} className="-rotate-12 text-white mt-8" />
                                    <PawPrint size={40} className="rotate-45 text-white -mt-4" />
                                    <PawPrint size={28} className="-rotate-[30deg] text-white" />
                                    <PawPrint size={36} className="rotate-12 text-white mt-4" />
                                </div>

                                <div className="relative z-10 w-full flex items-center gap-3">
                                    {combinedRemarksArr.length > 0 ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setCurrentRemarkIndex(prev => (prev - 1 + combinedRemarksArr.length) % combinedRemarksArr.length);
                                                }}
                                                className="opacity-0 group-hover/slider:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-white shrink-0"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>

                                            <div className="flex-1 min-w-0 overflow-hidden h-full flex items-center justify-center">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={currentRemarkIndex}
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        className="w-full text-center py-1"
                                                    >
                                                        <p className="text-[11px] font-bold text-white tracking-tight leading-tight break-words px-2 max-h-[48px] overflow-hidden line-clamp-2">
                                                            {combinedRemarksArr[currentRemarkIndex]}
                                                        </p>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setCurrentRemarkIndex(prev => (prev + 1) % combinedRemarksArr.length);
                                                }}
                                                className="opacity-0 group-hover/slider:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-white"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full flex items-center justify-between px-2">
                                            <ChevronLeft size={18} className="text-white opacity-80" />
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="text-[11px] font-bold italic text-white"
                                            >
                                                Marks are empty
                                            </motion.span>
                                            <ChevronRight size={18} className="text-white opacity-80" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {matrixExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-[85px] right-8 w-[450px] bg-white rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.2)] border border-slate-100 z-[100] p-0 overflow-hidden"
                                >
                                    <div className="px-6 py-5 bg-orange-500 text-white flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <History size={16} />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-widest leading-none mb-1">Remarks Repository</h3>
                                                <p className="text-[8px] font-bold text-orange-100 uppercase tracking-widest">Clinical Observation Logic</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setMatrixExpanded(false)} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"><X size={14} /></button>
                                    </div>
                                    <div className="p-4 bg-slate-50/50">
                                        <div className="mb-4">
                                            {isAddingRemark ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-white border-2 border-orange-200 rounded-2xl shadow-sm"
                                                >
                                                    <textarea
                                                        autoFocus
                                                        value={remarkInput}
                                                        onChange={(e) => setRemarkInput(e.target.value)}
                                                        placeholder="Type professional clinical observation..."
                                                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 focus:ring-2 focus:ring-orange-500/20 outline-none h-24 resize-none mb-3"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                if (remarkInput.trim()) {
                                                                    try {
                                                                        const res = await axios.post(route('new-case.pet.remarks', selectedPet.id), { remark: remarkInput.trim() });
                                                                        if (res.data.success) {
                                                                            setSelectedPet({ ...selectedPet, special_characteristics: res.data.special_characteristics });
                                                                            setRemarkInput('');
                                                                            setIsAddingRemark(false);
                                                                        }
                                                                    } catch (err) { console.error(err); }
                                                                }
                                                            }}
                                                            className="flex-1 py-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
                                                        >
                                                            Commit to Node
                                                        </button>
                                                        <button
                                                            onClick={() => { setIsAddingRemark(false); setRemarkInput(''); }}
                                                            className="px-4 py-2 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsAddingRemark(true)}
                                                    className="w-full py-3 bg-white border-2 border-dashed border-orange-200 rounded-2xl text-orange-500 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2 group/add"
                                                >
                                                    <PlusCircle size={14} className="group-hover/add:scale-110 transition-transform" /> Add New Clinical Remark
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                                            {(selectedPet.special_characteristics || "").split("\n").filter(r => r.trim()).map((remark, idx) => (
                                                <div key={idx} className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl group/detail relative hover:bg-orange-50/50 transition-all shadow-sm">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest opacity-60">Entry #{idx + 1}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover/detail:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingRemarkIndex(idx);
                                                                    setRemarkInput(remark);
                                                                }}
                                                                className="w-6 h-6 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                                                            >
                                                                <Edit2 size={10} />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Delete this remark?')) {
                                                                        try {
                                                                            const res = await axios.delete(route('new-case.pet.remarks.destroy', selectedPet.id), { data: { index: idx } });
                                                                            if (res.data.success) { setSelectedPet({ ...selectedPet, special_characteristics: res.data.special_characteristics }); }
                                                                        } catch (err) { console.error('Delete failed', err); }
                                                                    }
                                                                }}
                                                                className="w-6 h-6 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={10} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {editingRemarkIndex === idx ? (
                                                        <div className="mt-2 space-y-2">
                                                            <textarea
                                                                autoFocus
                                                                value={remarkInput}
                                                                onChange={(e) => setRemarkInput(e.target.value)}
                                                                className="w-full bg-slate-50 border border-orange-200 rounded-xl text-xs font-bold p-2 focus:ring-2 focus:ring-orange-500/20 outline-none h-20 resize-none"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={async () => {
                                                                        if (remarkInput.trim()) {
                                                                            try {
                                                                                const res = await axios.put(route('new-case.pet.remarks.update', selectedPet.id), { index: idx, remark: remarkInput.trim() });
                                                                                if (res.data.success) {
                                                                                    setSelectedPet({ ...selectedPet, special_characteristics: res.data.special_characteristics });
                                                                                    setEditingRemarkIndex(null);
                                                                                    setRemarkInput('');
                                                                                }
                                                                            } catch (err) { console.error(err); }
                                                                        }
                                                                    }}
                                                                    className="flex-1 py-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg"
                                                                >
                                                                    Update
                                                                </button>
                                                                <button onClick={() => { setEditingRemarkIndex(null); setRemarkInput(''); }} className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-lg">Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-relaxed break-words">
                                                            {remark}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Far Right: Actions */}
                    <div className="flex items-center gap-3 border-l border-slate-100 pl-6 h-full">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {!savedRecord && (data.rx_note || data.service_charge) && (
                                    <div className="flex items-center gap-1 mr-2 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                        <button
                                            onClick={() => { setFinishModalStage('note'); setShowFinishModal(true); }}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-all"
                                            title="Edit Prescription Note"
                                        >
                                            <FileText size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setFinishModalStage('service'); setShowFinishModal(true); }}
                                            className="p-2 text-slate-400 hover:text-emerald-600 transition-all"
                                            title="Edit Service Charge"
                                        >
                                            <DollarSign size={16} />
                                        </button>
                                    </div>
                                )}
                                {data.prescribed_drugs.length > 0 && (
                                    <button
                                        onClick={() => handlePreviewPrint('prescription')}
                                        className="w-10 h-10 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all flex items-center justify-center active:scale-95"
                                        title="Print Prescription"
                                    >
                                        <Printer size={18} />
                                    </button>
                                )}
                                {(data.items.length > 0 || data.prescribed_drugs.length > 0) && (
                                    <button
                                        onClick={() => handlePreviewPrint('bill')}
                                        className="w-10 h-10 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center active:scale-95"
                                        title="Print Bill"
                                    >
                                        <ReceiptText size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={async () => {
                                        if (savedRecord) {
                                            if (savedRecord.low_stock_alerts && savedRecord.low_stock_alerts.length > 0) {
                                                setLowStockPopup(savedRecord.low_stock_alerts);
                                            } else {
                                                window.location.href = route('new-case.index');
                                            }
                                        } else {
                                            const sRec = await handleSubmit();
                                            if (sRec) {
                                                if (sRec.low_stock_alerts && sRec.low_stock_alerts.length > 0) {
                                                    setLowStockPopup(sRec.low_stock_alerts);
                                                } else {
                                                    window.location.href = route('new-case.index');
                                                }
                                            }
                                        }
                                    }}
                                    className="ml-2 px-6 py-2.5 bg-slate-900 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <CheckCircle2 size={16} />
                                    {savedRecord ? 'New Case' : 'Done'}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="relative overflow-hidden min-h-screen bg-white">
                {/* Bolder Shading for Active Case */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-[-15%] w-[45%] h-full bg-[#1062FF]/[0.08] -skew-x-[15deg] transform-gpu"></div>
                    <div className="absolute bottom-0 left-[-10%] w-[25%] h-full bg-[#1062FF]/[0.02] skew-x-[15deg] transform-gpu"></div>
                </div>

                <div className="w-full relative z-10">
                    <div className="flex flex-col lg:flex-row gap-0 items-start overflow-hidden">
                        {/* Visual Archive Segment: High-Density Timeline */}
                        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] min-w-0 border-r border-slate-200 bg-white">
                            <div className="bg-white border-r border-slate-100 flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="p-1 px-3 border-b border-slate-100 bg-slate-50/10 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 bg-primary-blue text-white rounded flex items-center justify-center shadow-md shadow-primary-blue/20">
                                            <History size={12} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Archive</h3>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                                        {history.length} Event(s)
                                    </span>
                                </div>

                                <div className="overflow-auto custom-scrollbar flex-1 bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                            <tr className="text-[9px] uppercase font-black text-slate-500 shadow-[0_1px_0_rgba(226,232,240,1)] bg-slate-50/80 backdrop-blur-sm">
                                                <th className="p-1 px-2 text-left whitespace-nowrap bg-blue-50/50">Date</th>
                                                <th className="p-1 px-2 text-left whitespace-nowrap bg-blue-50/50">Age</th>
                                                <th className="p-1 px-2 text-left bg-blue-50/50">Weight</th>
                                                <th className="p-1 px-2 text-left border-l border-slate-100 min-w-[100px]">Complain</th>
                                                <th className="p-1 px-2 text-left min-w-[100px]">History</th>
                                                <th className="p-1 px-2 text-left min-w-[120px]">Clinical Sign</th>
                                                <th className="p-1 px-2 text-left min-w-[100px]">Labs</th>
                                                <th className="p-1 px-2 text-left min-w-[100px]">D.Diag</th>
                                                <th className="p-1 px-2 text-left min-w-[100px]">Final</th>
                                                <th className="p-1 px-2 text-left min-w-[120px]">Inj/Clinic</th>
                                                <th className="p-1 px-2 text-left min-w-[140px]">Prescription</th>
                                                <th className="p-1 px-2 text-left min-w-[100px]">Note</th>
                                                <th className="p-1 px-2 text-center bg-slate-100/50">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600">
                                            {/* Historical Data (Oldest First) */}
                                            {[...history].sort((a, b) => new Date(a.date_of_record) - new Date(b.date_of_record)).map((record, i) => (
                                                <TimelineRecord
                                                    key={record.id}
                                                    record={record}
                                                    isLast={false}
                                                    onView={() => setSelectedCaseForView(record)}
                                                    petDob={selectedPet?.dob}
                                                />
                                            ))}

                                            {/* ACTIVE CASE DRAFT ROW - INTERACTIVE */}
                                            <tr className="bg-blue-50/50 border-t-2 border-blue-200 group/draft">
                                                <td className="p-1 px-2 text-[10px] text-blue-700 align-top">
                                                    <div className="font-bold tabular-nums leading-tight">
                                                        <span className="block text-[8px] text-blue-400">{format(new Date(), 'yyyy')}</span>
                                                        <span className="block">{format(new Date(), 'MM/dd')}</span>
                                                    </div>
                                                    <span className="text-[7px] font-black bg-blue-600 text-white px-1 py-0 rounded uppercase tracking-tighter mt-1 inline-block">ACTIVE</span>
                                                </td>
                                                <td className="p-1 px-2 text-xs text-slate-400 align-top">-</td>

                                                {/* Weight */}
                                                <td className={`p-0 align-top transition-all ${step === 0 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(0)}>
                                                    <input id="step-input-0" type="number" value={data.weight_kg} onChange={e => setData('weight_kg', e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setStep(1); } }}
                                                        placeholder="Wt" className="w-full h-full p-2 bg-transparent text-[11px] font-black text-slate-800 outline-none border-none placeholder:text-slate-300" />
                                                </td>

                                                {/* Complaints */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 1 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(1)}>
                                                    <div className="p-1 space-y-1">
                                                        <div className="flex flex-wrap gap-1">{data.complane.map((c, i) => <span key={i} className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('complane', i)} /></span>)}</div>
                                                        <input id="step-input-1" value={step === 1 ? remarkInput : ''} onChange={e => step === 1 && setRemarkInput(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (remarkInput.trim()) { setData('complane', [...data.complane, remarkInput.trim()]); setRemarkInput(''); }
                                                                    else { setStep(2); }
                                                                }
                                                            }}
                                                            placeholder="+ Complaint" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />
                                                    </div>
                                                </td>

                                                {/* History */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 2 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(2)}>
                                                    <div className="p-1 space-y-1">
                                                        <div className="flex flex-wrap gap-1">{data.patient_history.map((c, i) => <span key={i} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('patient_history', i)} /></span>)}</div>
                                                        <input id="step-input-2" value={step === 2 ? remarkInput : ''} onChange={e => step === 2 && setRemarkInput(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (remarkInput.trim()) { setData('patient_history', [...data.patient_history, remarkInput.trim()]); setRemarkInput(''); }
                                                                    else { setStep(3); }
                                                                }
                                                            }}
                                                            placeholder="+ History" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />
                                                    </div>
                                                </td>

                                                {/* Signs */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 3 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(3)}>
                                                    <div className="p-1 space-y-1">
                                                        <div className="flex flex-wrap gap-1">{data.clinical_signs.map((c, i) => <span key={i} className="bg-orange-50 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('clinical_signs', i)} /></span>)}</div>
                                                        <input id="step-input-3" value={step === 3 ? remarkInput : ''} onChange={e => step === 3 && setRemarkInput(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (remarkInput.trim()) { setData('clinical_signs', [...data.clinical_signs, remarkInput.trim()]); setRemarkInput(''); }
                                                                    else { setStep(4); }
                                                                }
                                                            }}
                                                            placeholder="+ Signs" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />
                                                    </div>
                                                </td>

                                                {/* Labs */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 4 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(4)}>
                                                    <div className="p-1 space-y-1">
                                                        <div className="flex flex-wrap gap-1">{data.lab_findings.map((c, i) => <span key={i} className="bg-purple-50 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('lab_findings', i)} /></span>)}</div>
                                                        <input id="step-input-4" value={step === 4 ? remarkInput : ''} onChange={e => step === 4 && setRemarkInput(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (remarkInput.trim()) { setData('lab_findings', [...data.lab_findings, remarkInput.trim()]); setRemarkInput(''); }
                                                                    else { setStep(5); }
                                                                }
                                                            }}
                                                            placeholder="+ Labs" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />
                                                    </div>
                                                </td>

                                                {/* DD */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 5 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(5)}>
                                                    <div className="p-1 space-y-1 relative">
                                                        <div className="flex flex-wrap gap-1">{data.differential_diagnosis.map((c, i) => <span key={i} className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('differential_diagnosis', i)} /></span>)}</div>
                                                        <input id="step-input-5" value={step === 5 ? diagSearch : ''} onChange={e => step === 5 && setDiagSearch(e.target.value)}
                                                            onKeyDown={e => {
                                                                const filtered = diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()));
                                                                if (e.key === 'ArrowDown') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setDdHighlight(prev => prev < 0 ? 0 : (prev + 1) % filtered.length);
                                                                } else if (e.key === 'ArrowUp') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setDdHighlight(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
                                                                } else if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (ddHighlight >= 0 && filtered[ddHighlight]) {
                                                                        setData('differential_diagnosis', [filtered[ddHighlight].name, ...data.differential_diagnosis]);
                                                                        setDiagSearch('');
                                                                        setDdHighlight(-1);
                                                                    } else if (!diagSearch.trim()) {
                                                                        setStep(6);
                                                                    } else {
                                                                        setData('differential_diagnosis', [diagSearch.trim(), ...data.differential_diagnosis]);
                                                                        setDiagSearch('');
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="+ DD" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />

                                                        {step === 5 && (
                                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-100 rounded-lg z-[100] max-h-[150px] overflow-auto">
                                                                {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase())).map((d, i) => (
                                                                    <div key={i} onClick={() => { setData('differential_diagnosis', [d.name, ...data.differential_diagnosis]); setDiagSearch(''); }}
                                                                        className={`p-1.5 px-3 text-[10px] font-bold hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${ddHighlight === i ? 'bg-blue-50 text-blue-600' : ''}`}>{d.name}</div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Final Diag */}
                                                <td className={`p-0 align-top transition-all min-w-[120px] ${step === 6 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(6)}>
                                                    <div className="p-1 space-y-1 relative">
                                                        <div className="flex flex-wrap gap-1">{data.final_diagnoses.map((c, i) => <span key={i} className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{c} <X size={8} className="cursor-pointer" onClick={() => removeListItem('final_diagnoses', i)} /></span>)}</div>
                                                        <input id="step-input-6" value={step === 6 ? diagSearch : ''} onChange={e => step === 6 && setDiagSearch(e.target.value)}
                                                            onKeyDown={e => {
                                                                const filtered = diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()));
                                                                if (e.key === 'ArrowDown') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setDdHighlight(prev => prev < 0 ? 0 : (prev + 1) % filtered.length);
                                                                } else if (e.key === 'ArrowUp') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setDdHighlight(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
                                                                } else if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (ddHighlight >= 0 && filtered[ddHighlight]) {
                                                                        setData('final_diagnoses', [filtered[ddHighlight].name, ...data.final_diagnoses]);
                                                                        setDiagSearch('');
                                                                        setDdHighlight(-1);
                                                                    } else if (!diagSearch.trim()) {
                                                                        setStep(7);
                                                                    } else {
                                                                        setData('final_diagnoses', [diagSearch.trim(), ...data.final_diagnoses]);
                                                                        setDiagSearch('');
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="+ Diagnosis" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />

                                                        {step === 6 && (
                                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-100 rounded-lg z-[100] max-h-[150px] overflow-auto">
                                                                {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase())).map((d, i) => (
                                                                    <div key={i} onClick={() => { setData('final_diagnoses', [d.name, ...data.final_diagnoses]); setDiagSearch(''); }}
                                                                        className={`p-1.5 px-3 text-[10px] font-bold hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${ddHighlight === i ? 'bg-blue-50 text-blue-600' : ''}`}>{d.name}</div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Injections */}
                                                <td className={`p-0 align-top transition-all min-w-[140px] ${step === 7 ? 'bg-white ring-2 ring-blue-500/20' : ''}`} onClick={() => setStep(7)}>
                                                    <div className="p-1 space-y-1 relative">
                                                        <div className="flex flex-wrap gap-1">{data.items.map((it, i) => <span key={i} className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{it.name} <X size={8} className="cursor-pointer" onClick={() => removeListItem('items', i)} /></span>)}</div>
                                                        <input id="step-input-7" value={step === 7 ? injSearch : ''} onChange={e => step === 7 && setInjSearch(e.target.value)}
                                                            onKeyDown={e => {
                                                                const filtered = products.filter(p => {
                                                                    const cat = p.category?.name?.toLowerCase() || '';
                                                                    return (cat.includes('injection') || cat.includes('retail') || !p.category) && p.name.toLowerCase().includes(injSearch.toLowerCase());
                                                                });
                                                                if (e.key === 'ArrowDown') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setInjHighlight(prev => prev < 0 ? 0 : (prev + 1) % filtered.length);
                                                                } else if (e.key === 'ArrowUp') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setInjHighlight(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
                                                                } else if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (injHighlight >= 0 && filtered[injHighlight]) {
                                                                        setPendingItem(filtered[injHighlight]); setPendingQty('1'); setInjSearch(''); setInjHighlight(-1);
                                                                    } else if (!injSearch.trim()) {
                                                                        setStep(8);
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="+ Injection" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />

                                                        {step === 7 && !pendingItem && (
                                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-100 rounded-lg z-[100] max-h-[150px] overflow-auto">
                                                                {products.filter(p => {
                                                                    const cat = p.category?.name?.toLowerCase() || '';
                                                                    return (cat.includes('injection') || cat.includes('retail') || !p.category) && p.name.toLowerCase().includes(injSearch.toLowerCase());
                                                                }).map((p, i) => (
                                                                    <div key={i} onClick={() => { setPendingItem(p); setPendingQty('1'); setInjSearch(''); }}
                                                                        className={`p-1.5 px-3 text-[10px] font-bold hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${injHighlight === i ? 'bg-blue-50 text-blue-600' : ''}`}>{p.name}</div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {step === 7 && pendingItem && (
                                                            <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-blue-200">
                                                                <span className="text-[9px] font-bold truncate max-w-[60px]">{pendingItem.name}</span>
                                                                <input id="inj-qty-input" autoFocus type="number" value={pendingQty} onChange={e => setPendingQty(e.target.value)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter' && pendingQty) {
                                                                            setData('items', [...data.items, { product_id: pendingItem.id, name: pendingItem.name, quantity: pendingQty, price: pendingItem.unit_price, type: pendingItem.category?.name || 'Injection' }]);
                                                                            setPendingItem(null); setPendingQty('');
                                                                        }
                                                                    }}
                                                                    className="w-10 border border-slate-200 rounded text-[10px] p-0.5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Rx */}
                                                <td className={`p-0 align-top transition-all min-w-[200px] ${step === 8 ? 'bg-white ring-2 ring-blue-500/20 shadow-inner' : ''}`} onClick={() => setStep(8)}>
                                                    <div className="p-1 space-y-1 relative">
                                                        <div className="flex flex-wrap gap-1">{data.prescribed_drugs.map((p, i) => <span key={i} className="bg-violet-50 text-violet-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">{p.name} ({p.quantity}) <X size={8} className="cursor-pointer" onClick={() => removeListItem('prescribed_drugs', i)} /></span>)}</div>
                                                        <input id="step-input-8" value={step === 8 ? rxSearch : ''} onChange={e => step === 8 && setRxSearch(e.target.value)}
                                                            onKeyDown={e => {
                                                                const filtered = products.filter(p => p.category?.name === 'Prescription' && p.name.toLowerCase().includes(rxSearch.toLowerCase()));
                                                                if (e.key === 'ArrowDown') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setRxHighlight(prev => prev < 0 ? 0 : (prev + 1) % filtered.length);
                                                                } else if (e.key === 'ArrowUp') {
                                                                    e.preventDefault();
                                                                    if (filtered.length > 0) setRxHighlight(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
                                                                } else if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (rxHighlight >= 0 && filtered[rxHighlight]) {
                                                                        setRxPendingItem(filtered[rxHighlight]); setRxSearch(''); setRxHighlight(-1);
                                                                    } else if (!rxSearch.trim()) {
                                                                        setShowFinishModal(true);
                                                                        setFinishModalStage('note');
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="+ Prescription" className="w-full text-[10px] font-bold bg-transparent outline-none border-none p-1 placeholder:text-slate-300" />

                                                        {step === 8 && !rxPendingItem && (
                                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-100 rounded-lg z-[100] max-h-[150px] overflow-auto">
                                                                {products.filter(p => p.category?.name === 'Prescription' && p.name.toLowerCase().includes(rxSearch.toLowerCase())).map((p, i) => (
                                                                    <div key={i} onClick={() => { setRxPendingItem(p); setRxSearch(''); setStep(8); }}
                                                                        className={`p-1.5 px-3 text-[10px] font-bold hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${rxHighlight === i ? 'bg-blue-50 text-blue-600' : ''}`}>{p.name}</div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {step === 8 && rxPendingItem && (
                                                            <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-xl z-[101] absolute top-full left-0 w-[240px] space-y-2">
                                                                <div className="text-[9px] font-black text-violet-600 truncate">{rxPendingItem.name}</div>
                                                                <div className="grid grid-cols-1 gap-1">
                                                                    <input id="rx-qty-inline" autoFocus placeholder="Quantity (e.g. 200mg)" value={rxQty} onChange={e => setRxQty(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') document.getElementById('rx-freq-inline')?.focus(); }} className="w-full text-[10px] border p-1 rounded font-bold" />
                                                                    <input id="rx-freq-inline" placeholder="Frequency (e.g. 3 Times)" value={rxFreq} onChange={e => setRxFreq(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') document.getElementById('rx-dur-inline')?.focus(); }} className="w-full text-[10px] border p-1 rounded font-bold" />
                                                                    <input id="rx-dur-inline" placeholder="Duration (e.g. 5 Days)" value={rxDuration} onChange={e => setRxDuration(e.target.value)}
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter') {
                                                                                setData('prescribed_drugs', [...data.prescribed_drugs, {
                                                                                    product_id: rxPendingItem.id,
                                                                                    name: rxPendingItem.name,
                                                                                    quantity: rxQty,
                                                                                    frequency: rxFreq,
                                                                                    duration: rxDuration,
                                                                                    price: rxPendingItem.unit_price || 0
                                                                                }]);
                                                                                setRxPendingItem(null); setRxQty(''); setRxFreq(''); setRxDuration('');
                                                                            }
                                                                        }} className="w-full text-[10px] border p-1 rounded font-bold" />
                                                                </div>
                                                                <p className="text-[7px] text-slate-400 font-black uppercase text-center mt-1">Enter to add · Esc to cancel</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-1 px-2 text-center bg-slate-50">
                                                    <Zap size={10} className="text-slate-300" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Floating Suggestions for Table Entry */}
            <AnimatePresence>
                {(step === 5 || step === 6 || step === 7 || step === 8) && (!pendingItem && !rxPendingItem) && ((step === 5 || step === 6 ? diagSearch : step === 7 ? injSearch : rxSearch)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-[200]"
                    >
                        <div className="p-3 border-b border-slate-50 bg-slate-50/50 backdrop-blur-md flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 flex items-center gap-2">
                                <Search size={12} />
                                {step === 5 ? 'Differential Diagnosis' : step === 6 ? 'Final Diagnosis' : step === 7 ? 'Injection Search' : 'Prescription Search'}
                            </span>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-1">
                            {(() => {
                                let filtered = [];
                                if (step === 5 || step === 6) {
                                    filtered = diagnoses.filter(d => diagSearch && d.name.toLowerCase().includes(diagSearch.toLowerCase())).slice(0, 10);
                                } else if (step === 7) {
                                    filtered = products.filter(p => {
                                        const cat = p.category?.name?.toLowerCase() || '';
                                        return injSearch && (cat.includes('injection') || cat.includes('retail') || !p.category) && p.name.toLowerCase().includes(injSearch.toLowerCase());
                                    }).slice(0, 10);
                                } else if (step === 8) {
                                    filtered = products.filter(p => rxSearch && p.category?.name === 'Prescription' && p.name.toLowerCase().includes(rxSearch.toLowerCase())).slice(0, 10);
                                }

                                if (filtered.length === 0 && (diagSearch || injSearch || rxSearch)) {
                                    return <div className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">No match found...</div>;
                                }

                                return filtered.map((item, i) => (
                                    <div key={item.id || i}
                                        className="px-4 py-2.5 text-[11px] font-bold text-slate-800 hover:bg-blue-600 hover:text-white cursor-pointer border-b border-slate-50 transition-all rounded-xl"
                                        onClick={() => {
                                            if (step === 5 || step === 6) {
                                                const key = step === 5 ? 'differential_diagnosis' : 'final_diagnoses';
                                                setData(key, [item.name, ...data[key]]);
                                                setDiagSearch('');
                                            } else if (step === 7) {
                                                setPendingItem(item); setPendingQty('1'); setInjSearch('');
                                            } else if (step === 8) {
                                                setRxPendingItem(item); setRxSearch('');
                                            }
                                        }}>
                                        {item.name}
                                        {item.unit_price && <span className="ml-2 opacity-60 text-[9px]">LKR {item.unit_price}</span>}
                                    </div>
                                ));
                            })()}
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            <AnimatePresence>
                {showFinishModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
                            {finishModalStage === 'note' && (
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 leading-none mb-1">Prescription Note</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add final clinical remarks for receipt</p>
                                        </div>
                                    </div>
                                    <textarea
                                        autoFocus
                                        placeholder="Type prescription notes here..."
                                        className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                                        value={data.rx_note}
                                        onChange={e => setData('rx_note', e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setFinishModalStage('service'); } }}
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowFinishModal(false)} className="px-6 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Cancel</button>
                                        <button onClick={() => setFinishModalStage('service')} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all">Next Step</button>
                                    </div>
                                </div>
                            )}
                            {finishModalStage === 'service' && (
                                <div className="p-10 space-y-8">
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
                                            <DollarSign size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Service Charge</h3>
                                            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">
                                                Inventory Total: LKR {data.items.reduce((acc, cr) => acc + (cr.price * cr.quantity), 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">LKR</span>
                                        <input
                                            autoFocus
                                            type="number"
                                            className="w-full bg-slate-50 border-4 border-slate-100 rounded-[28px] p-8 pl-20 text-4xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 transition-all outline-none text-center shadow-inner"
                                            value={data.service_charge}
                                            onChange={e => setData('service_charge', e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setShowFinishModal(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setFinishModalStage('note')} className="px-6 py-6 bg-slate-100 text-slate-500 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Back</button>
                                        <button
                                            onClick={() => setShowFinishModal(false)}
                                            className="flex-1 py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
                                        >
                                            Confirm Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {lowStockPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/60 p-8 space-y-6 text-center">
                            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
                                <AlertCircle size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Low Stock Alert</h3>
                                <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">The following items dropped below minimum levels:</p>
                            </div>
                            <div className="space-y-3 overflow-y-auto max-h-48 custom-scrollbar text-left rounded-xl p-2 bg-slate-50 border border-slate-100">
                                {lowStockPopup.map((alert, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100 shadow-sm">
                                        <div className="font-bold text-slate-900 text-xs">{alert.name}</div>
                                        <div className="text-[10px]">
                                            <span className="text-danger font-black">{alert.current_stock} QTY</span>
                                            <span className="text-slate-400 mx-1">/</span>
                                            <span className="text-slate-500 font-bold">{alert.min_stock} MIN</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { setLowStockPopup(null); window.location.href = route('new-case.index'); }}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[20px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-xs"
                            >
                                Acknowledge & Proceed
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showOwnerModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/60">
                            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                        <UserPlus size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register Owner</h3>
                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-70">Initialize client matrix</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowOwnerModal(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-all active:scale-95"><X size={20} /></button>
                            </div>
                            <div className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="First Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" value={newOwnerData.first_name} onChange={e => setNewOwnerData({ ...newOwnerData, first_name: e.target.value })} />
                                    <input placeholder="Last Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" value={newOwnerData.last_name} onChange={e => setNewOwnerData({ ...newOwnerData, last_name: e.target.value })} />
                                </div>
                                <input placeholder="Phone Number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" value={newOwnerData.phone} onChange={e => setNewOwnerData({ ...newOwnerData, phone: e.target.value })} />
                                <textarea placeholder="Physical Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none min-h-[100px] resize-none" value={newOwnerData.address} onChange={e => setNewOwnerData({ ...newOwnerData, address: e.target.value })} />
                                <button onClick={handleOwnerRegistration} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-[10px]">Commit Profile</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {
                    showPetModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                            <PlusCircle size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register Patient</h3>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-70">Initialize clinical entity tracking</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowPetModal(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-all active:scale-95"><X size={20} /></button>
                                </div>
                                <div className="p-8 space-y-5">
                                    <input placeholder="Pet Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" value={newPetData.name} onChange={e => setNewPetData({ ...newPetData, name: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none cursor-pointer" value={newPetData.species_id} onChange={e => setNewPetData({ ...newPetData, species_id: e.target.value })}>
                                            <option value="">Select Species</option>
                                            {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none cursor-pointer" value={newPetData.breed_id} onChange={e => setNewPetData({ ...newPetData, breed_id: e.target.value })}>
                                            <option value="">Select Breed</option>
                                            {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={handlePetRegistration} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-[10px]">Commit Patient</button>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >

            <AnimatePresence>
                {selectedCaseForView && (
                    <CaseDetailsModal
                        record={selectedCaseForView}
                        onClose={() => setSelectedCaseForView(null)}
                    />
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                    `
            }} />
        </AppLayout >
    );
}

const CaseDetailsModal = ({ record, onClose }) => {
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
                                <span className="text-[10px] font-bold text-slate-600 italic">{format(new Date(record.date_of_record), 'MMMM dd, yyyy')}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                <span className="text-[10px] font-bold text-blue-500">Case ID: #{record.id}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                        <X size={20} />
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
                        {/* Client Complaints */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                    <AlertCircle size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Client complaints</h3>
                            </div>
                            <p className="text-[11px] font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                {record.complane?.length > 0 ? record.complane.join(', ') : 'No complaints provided.'}
                            </p>
                        </section>

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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section className="space-y-4 md:col-span-2">
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
