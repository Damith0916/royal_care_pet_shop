import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import {
    Search, Plus, Trash2, ArrowRight, ArrowLeft,
    Calculator, Receipt, CheckCircle, Package, Activity,
    User, PawPrint, CreditCard, Banknote, ShieldCheck,
    ChevronRight, X, Minus, Info, Printer, Download, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-2xl transition-all text-gray-500 active:scale-90">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default function InvoiceCreate({ pets, products, services, appointments, prefilled = {} }) {
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [amountReceived, setAmountReceived] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        owner_id: '',
        pet_id: '',
        appointment_id: prefilled.appointment_id || '',
        reason_for_visit: '',
        invoice_date: new Date().toISOString().split('T')[0],
        items: [],
        service_charge: 0,
        discount_amount: 0,
        payment_method: 'Cash',
        amount_paid: 0,
    });

    useEffect(() => {
        if (prefilled.owner_id) {
            const owner = pets.find(p => p.owner_id == prefilled.owner_id)?.owner;
            if (owner) {
                setSelectedOwner(owner);
                setData('owner_id', owner.id);
                setStep(2);
            }
        }
        if (prefilled.pet_id) {
            const pet = pets.find(p => p.id == prefilled.pet_id);
            if (pet) {
                setSelectedPet(pet);
                setData('pet_id', pet.id);
                setStep(3);
            }
        }
    }, [prefilled, pets]);

    // Step 1: Owners (unique owners from pets list for now, or fetch all owners if available)
    const allOwners = useMemo(() => {
        const ownerMap = new Map();
        pets.forEach(pet => {
            if (!ownerMap.has(pet.owner.id)) {
                ownerMap.set(pet.owner.id, pet.owner);
            }
        });
        return Array.from(ownerMap.values());
    }, [pets]);

    const filteredOwners = allOwners.filter(owner => {
        const name = `${owner?.first_name || ''} ${owner?.last_name || ''}`;
        const search = (searchTerm || '').toLowerCase();
        return name.toLowerCase().includes(search) || owner?.phone?.includes(searchTerm);
    });

    const filteredPets = selectedOwner
        ? pets.filter(pet => pet.owner_id === selectedOwner.id)
        : [];

    const itemSearchList = [
        ...services.map(s => ({ ...s, type: 'Service', icon: Activity })),
        ...products.map(p => ({ ...p, type: 'Product', icon: Package, unit_price: p.unit_price }))
    ].filter(item => {
        const name = item?.name || '';
        const search = (searchTerm || '').toLowerCase();
        return name.toLowerCase().includes(search);
    });

    const handleSelectOwner = (owner) => {
        setSelectedOwner(owner);
        setData('owner_id', owner.id);
        setSearchTerm('');
        setStep(2);
    };

    const handleSelectPet = (pet) => {
        setSelectedPet(pet);
        setData('pet_id', pet.id);
        const autoLinkAppointment = appointments.find(a => a.pet_id === pet.id);
        if (autoLinkAppointment) {
            setData('appointment_id', autoLinkAppointment.id);
        }
        setStep(3);
    };

    const filteredAppointments = useMemo(() => {
        if (!selectedPet) return [];
        return appointments.filter(a => a.pet_id === selectedPet.id);
    }, [selectedPet, appointments]);

    const addItem = (item) => {
        const existingIdx = selectedItems.findIndex(i => i.id === item.id && i.type === item.type);
        if (existingIdx > -1) {
            const newItems = [...selectedItems];
            newItems[existingIdx].quantity += 1;
            setSelectedItems(newItems);
        } else {
            setSelectedItems([...selectedItems, {
                ...item,
                quantity: 1,
                unit_price: item.type === 'Service' ? parseFloat(item.cost) : parseFloat(item.unit_price)
            }]);
        }
        setSearchTerm('');
    };

    const removeItem = (idx) => {
        const newItems = [...selectedItems];
        newItems.splice(idx, 1);
        setSelectedItems(newItems);
    };

    const updateQty = (idx, delta) => {
        const newItems = [...selectedItems];
        const newQty = newItems[idx].quantity + delta;
        if (newQty > 0) {
            if (newItems[idx].type === 'Product' && newQty > newItems[idx].stock_quantity) return;
            newItems[idx].quantity = newQty;
            setSelectedItems(newItems);
        }
    };

    // Calculations
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const serviceCharge = parseFloat(data.service_charge) || 0;
    const discount = parseFloat(data.discount_amount) || 0;
    const totalAmount = Math.max(0, subtotal + serviceCharge - discount);
    const changeAmount = Math.max(0, (parseFloat(amountReceived) || 0) - totalAmount);

    const handleSubmit = () => {
        setData(d => ({
            ...d,
            items: selectedItems,
            amount_paid: amountReceived || totalAmount // Default to full if empty
        }));
        post(route('billing.store'));
    };

    return (
        <AppLayout>
            <Head title="Billing Terminal" />

            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-[32px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#1062FF]/5 flex items-center justify-center text-[#1062FF]">
                                <Receipt size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-[#1E293B] tracking-tight leading-none mb-1.5 uppercase">Billing Terminal</h1>
                                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-emerald-500" /> Secure Financial Transmission
                                </p>
                            </div>
                        </div>
                        <Link href={route('billing.index')} className="p-3 bg-slate-50 text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 rounded-2xl transition-all active:scale-95 border border-slate-100">
                            <X size={20} />
                        </Link>
                    </div>

                    {/* Progress Bar (Discrete) */}
                    <div className="flex px-8 py-4 bg-slate-50/50 gap-2 border-b border-slate-50">
                        {[
                            { s: 1, t: 'Owner', icon: User },
                            { s: 2, t: 'Patient', icon: PawPrint },
                            { s: 3, t: 'Context', icon: Info },
                            { s: 4, t: 'Items', icon: Package },
                            { s: 5, t: 'Checkout', icon: CreditCard },
                        ].map((stepObj) => (
                            <div key={stepObj.s} className="flex-1 flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${step === stepObj.s ? 'bg-slate-900 border-slate-900 text-white' : step > stepObj.s ? 'bg-white border-slate-200 text-slate-900' : 'bg-white border-slate-100 text-slate-200'}`}>
                                    <stepObj.icon size={12} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${step === stepObj.s ? 'text-slate-900' : 'text-slate-300'}`}>
                                    {stepObj.t}
                                </span>
                                {stepObj.s < 4 && <div className="flex-1 h-px bg-slate-100 mx-2 last:hidden" />}
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto min-h-[400px] flex flex-col p-8 bg-white">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Owner Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Select Owner</h2>
                                        <Link href={route('owners.index')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-1">
                                            <Plus size={12} /> New Owner
                                        </Link>
                                    </div>
                                    <div className="relative mb-6">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            autoFocus
                                            type="text" placeholder="Search owners..."
                                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-slate-900 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                        {filteredOwners.map(owner => (
                                            <button
                                                key={owner.id} onClick={() => handleSelectOwner(owner)}
                                                className="flex items-center gap-3 p-3 bg-white border border-slate-50 hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-all group text-left"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                                                    {owner.first_name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 text-xs truncate">{owner.first_name} {owner.last_name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 truncate">{owner.phone}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Pet Selection */}
                            {step === 2 && (
                                <motion.div
                                    key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setStep(1)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-all"><ArrowLeft size={14} /></button>
                                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Select Patient</h2>
                                        </div>
                                        <button onClick={() => setStep(3)} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Skip</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                        {filteredPets.map(pet => (
                                            <button
                                                key={pet.id} onClick={() => handleSelectPet(pet)}
                                                className="flex items-center gap-3 p-4 bg-white border border-slate-50 hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-all group shadow-sm"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <PawPrint size={16} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-slate-900 text-xs truncate whitespace-nowrap overflow-hidden max-w-[80px]">{pet.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{pet.species?.name || 'Patient'}</p>
                                                </div>
                                            </button>
                                        ))}
                                        <Link href={route('pets.create', { owner_id: selectedOwner.id })} className="flex items-center gap-3 p-4 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400 group">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={16} /></div>
                                            <span className="font-bold text-[10px] tracking-widest uppercase text-left">New Pet</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Visit Context */}
                            {step === 3 && (
                                <motion.div
                                    key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setStep(2)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-all"><ArrowLeft size={14} /></button>
                                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Visit Context</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Link Appointment (Optional)</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {filteredAppointments.map(app => (
                                                    <button
                                                        key={app.id} onClick={() => setData('appointment_id', data.appointment_id === app.id ? '' : app.id)}
                                                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${data.appointment_id === app.id ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.appointment_id === app.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                                <Clock size={14} />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-slate-900 text-xs">Scheduled Visit • {new Date(app.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DR. {app.vet.last_name}</p>
                                                            </div>
                                                        </div>
                                                        {data.appointment_id === app.id && <CheckCircle size={14} className="text-slate-900" />}
                                                    </button>
                                                ))}
                                                {filteredAppointments.length === 0 && (
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center py-4 border border-dashed border-slate-100 rounded-xl">No pending appointments found</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center justify-between">
                                                Reason for Visit
                                                <span className="text-red-500 font-black">*</span>
                                            </label>
                                            <textarea
                                                autoFocus
                                                value={data.reason_for_visit}
                                                onChange={e => setData('reason_for_visit', e.target.value)}
                                                placeholder="Brief summary of visit reason..."
                                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-medium focus:ring-1 focus:ring-slate-900 transition-all outline-none min-h-[100px] resize-none"
                                            />
                                            {errors.reason_for_visit && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">{errors.reason_for_visit}</p>}
                                        </div>

                                        <button
                                            disabled={!data.reason_for_visit}
                                            onClick={() => setStep(4)}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg disabled:opacity-30 transition-all active:scale-95"
                                        >
                                            Continue to Items
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Item Selection */}
                            {step === 4 && (
                                <motion.div
                                    key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setStep(3)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-all"><ArrowLeft size={14} /></button>
                                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Line Items</h2>
                                        </div>
                                    </div>
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            autoFocus
                                            type="text" placeholder="Add services or products..."
                                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-slate-900 transition-all outline-none"
                                        />
                                        {searchTerm && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-2xl overflow-hidden max-h-40 overflow-y-auto custom-scrollbar z-20">
                                                {itemSearchList.map(item => (
                                                    <button
                                                        key={`${item.type}-${item.id}`} onClick={() => addItem(item)}
                                                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 text-left group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                                <item.icon size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[11px] font-bold text-slate-900">LKR {parseFloat(item.unit_price || item.cost).toLocaleString()}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 pr-2 custom-scrollbar">
                                        {selectedItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-50 rounded-xl group hover:border-slate-200 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => removeItem(idx)} className="p-2 text-slate-200 hover:text-red-500 transition-all active:scale-90"><Trash2 size={14} /></button>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-xs truncate max-w-[150px] whitespace-nowrap overflow-hidden">{item.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">LKR {item.unit_price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
                                                        <button onClick={() => updateQty(idx, -1)} className="p-1 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded shadow-sm active:scale-90"><Minus size={10} /></button>
                                                        <span className="w-5 text-center font-bold text-xs text-slate-900">{item.quantity}</span>
                                                        <button onClick={() => updateQty(idx, 1)} className="p-1 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded shadow-sm active:scale-90"><Plus size={10} /></button>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 w-20 text-right">LKR {(item.quantity * item.unit_price).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedItems.length === 0 && (
                                            <div className="py-12 text-center text-slate-200 flex flex-col items-center justify-center">
                                                <Package size={32} className="mb-2 opacity-50" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest">Cart Empty</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer / Summary Area */}
                    <div className="px-8 py-10 bg-[#FAFBFF] border-t border-slate-100 flex flex-col gap-8">
                        <div className="grid grid-cols-2 gap-8 items-start">
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black text-[#64748B] uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-bold text-[#1E293B]">LKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-[#1062FF] uppercase tracking-widest flex items-center gap-2">
                                            <Calculator size={12} /> Service Charge
                                        </label>
                                        <input
                                            type="number"
                                            value={data.service_charge}
                                            onChange={e => setData('service_charge', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-[#374151] focus:ring-2 focus:ring-[#1062FF]/20 focus:border-[#1062FF] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                            <Minus size={12} /> Discount
                                        </label>
                                        <input
                                            type="number"
                                            value={data.discount_amount}
                                            onChange={e => setData('discount_amount', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-4">Patient Intelligence</p>
                                {selectedOwner && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-[#1062FF] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#1062FF]/20">
                                            {selectedOwner.first_name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-[#1E293B] uppercase tracking-tight truncate">{selectedOwner.first_name} {selectedOwner.last_name}</p>
                                            <p className="text-[9px] font-bold text-[#64748B] truncate">{selectedOwner.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedPet && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                                            <PawPrint size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-[#1E293B] uppercase tracking-tight truncate">{selectedPet.name}</p>
                                            <p className="text-[9px] font-bold text-[#64748B] uppercase">{selectedPet.species?.name || 'Patient'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-end justify-between pt-8 border-t border-slate-100 mt-2">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Total Amount Payable</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-[#1062FF] tracking-tighter">LKR {totalAmount.toLocaleString()}</span>
                                    <div className="px-2 py-0.5 bg-[#1062FF]/10 text-[#1062FF] rounded text-[8px] font-black uppercase tracking-widest">Net Final</div>
                                </div>
                            </div>
                            <button
                                disabled={selectedItems.length === 0 || processing}
                                onClick={() => step < 4 ? setStep(step + 1) : setIsCheckoutModalOpen(true)}
                                className="px-10 py-4 bg-[#1062FF] hover:bg-[#0051EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-xl shadow-[#1062FF]/20 disabled:opacity-30 flex items-center gap-3"
                            >
                                {step < 4 ? 'Continue' : 'Finalize Billing'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <Modal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} title="Finalize Payment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                {['Cash', 'Card', 'Online'].map(method => (
                                    <button
                                        key={method} onClick={() => setData('payment_method', method)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${data.payment_method === method ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-50 text-slate-300 hover:border-slate-200'}`}
                                    >
                                        {method === 'Cash' && <Banknote size={16} />}
                                        {method === 'Card' && <CreditCard size={16} />}
                                        {method === 'Online' && <ShieldCheck size={16} />}
                                        <span className="font-bold text-[8px] uppercase tracking-[0.2em]">{method}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Input Received (LKR)</label>
                            <input
                                type="number" value={amountReceived} onChange={e => setAmountReceived(e.target.value)}
                                placeholder={totalAmount.toLocaleString()}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl text-xl font-bold focus:ring-1 focus:ring-slate-900 transition-all outline-none"
                            />
                            <div className="flex gap-2">
                                {[1000, 5000].map(amt => (
                                    <button key={amt} onClick={() => setAmountReceived((parseFloat(amountReceived) || 0) + amt)} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 transition-all">+ {amt}</button>
                                ))}
                                <button onClick={() => setAmountReceived(totalAmount.toFixed(2))} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase transition-all">Exact</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#FAFBFF] rounded-[32px] p-8 flex flex-col border border-[#1062FF]/5">
                        <div className="space-y-5 flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Financial Summary</span>
                                <div className="h-px bg-[#1062FF]/10 flex-1 mx-4" />
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-[#1E293B]">
                                <span className="text-[#64748B]">Net Amount</span>
                                <span>LKR {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-[#1E293B]">
                                <span className="text-[#64748B]">Tendered</span>
                                <span className="text-[#1062FF]">LKR {(parseFloat(amountReceived) || 0).toLocaleString()}</span>
                            </div>
                            <div className="pt-6 mt-6 border-t border-[#1062FF]/10">
                                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-2">Change Return</p>
                                <p className="text-3xl font-black text-[#374151]">LKR {changeAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="w-full mt-6 py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {processing ? '...' : <><Printer size={14} /> Finish & Print</>}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
