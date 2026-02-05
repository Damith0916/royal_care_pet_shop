import React, { useState, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Calendar as CalendarIcon,
    Search,
    Filter,
    Stethoscope,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Check,
    X as XIcon
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
    'Completed': 'bg-green-50 text-green-600 border-green-100',
    'Canceled': 'bg-red-50 text-red-600 border-red-100',
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

export default function AppointmentsIndex({ appointments, pets, vets, services }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');

    const { data, setData, post, processing, reset, errors } = useForm({
        pet_id: '',
        vet_id: '',
        datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        status: 'Pending',
        notes: '',
        service_ids: [],
    });

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentDate]);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getAppointmentsForDay = (day) => {
        return appointments.filter(app => isSameDay(parseISO(app.datetime), day));
    };

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const updateStatus = (id, status) => {
        router.patch(route('appointments.update', id), { status });
        if (selectedAppointment && selectedAppointment.id === id) {
            setSelectedAppointment({ ...selectedAppointment, status });
        }
    };

    return (
        <AppLayout>
            <Head title="Appointments Calendar" />

            {/* Header Hub */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Appointments</h1>
                    <p className="text-sm font-medium text-slate-500">Manage pet visits and clinical schedules.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-white p-1.5 rounded-xl border border-border-gray shadow-sm">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-primary-blue"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="px-6 py-1.5 text-xs font-bold text-slate-900 min-w-[140px] text-center uppercase tracking-widest leading-none">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-primary-blue"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden flex flex-col h-[800px]">
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-border-gray bg-slate-50/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center border-r border-border-gray last:border-r-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 overflow-y-auto divide-x divide-y divide-slate-100 border-t border-border-gray">
                    {calendarDays.map((day, idx) => {
                        const dayApps = getAppointmentsForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={idx}
                                className={`min-h-[120px] p-3 transition-colors hover:bg-slate-50/30 group cursor-pointer ${!isCurrentMonth ? 'bg-slate-50/10' : ''}`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${isToday
                                        ? 'bg-primary-blue text-white shadow-md shadow-blue-200'
                                        : isCurrentMonth ? 'text-slate-900 group-hover:text-primary-blue' : 'text-slate-200'
                                        }`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-1.5 overflow-hidden">
                                    {dayApps.map(app => (
                                        <div
                                            key={app.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAppointment(app);
                                            }}
                                            className={`px-3 py-2 rounded-lg border text-[9px] font-bold truncate leading-none flex items-center gap-2 hover:shadow-md transition-all uppercase tracking-tight ${STATUS_COLORS[app.status]}`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0"></span>
                                            <span className="truncate">{format(parseISO(app.datetime), 'HH:mm')} • {app.pet.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Schedule Appointment"
            >
                <form onSubmit={handleAddSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Select Patient</label>
                            <select
                                value={data.pet_id}
                                onChange={e => setData('pet_id', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                required
                            >
                                <option value="">Select Pet</option>
                                {pets.map(pet => (
                                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.owner.first_name})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Assigned Veterinarian</label>
                            <select
                                value={data.vet_id}
                                onChange={e => setData('vet_id', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                required
                            >
                                <option value="">Select Vet</option>
                                {vets.map(vet => (
                                    <option key={vet.id} value={vet.id}>Dr. {vet.first_name} {vet.last_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Appointment Date & Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="datetime-local"
                                    value={data.datetime}
                                    onChange={e => setData('datetime', e.target.value)}
                                    className="w-full bg-slate-50 border border-border-gray pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Initial Status</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Additional Clinical Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none h-24 resize-none"
                            placeholder="Reason for visit, symptoms, or pre-visit instructions..."
                        />
                    </div>

                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {processing ? 'Processing Schedule...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Appointment Preview Modal */}
            <Modal
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                title="Appointment Intelligence"
            >
                {selectedAppointment && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-xl border border-border-gray shadow-sm">
                            <div className="w-16 h-16 rounded-xl bg-primary-blue text-white flex items-center justify-center font-bold text-2xl shadow-lg border border-primary-blue/20">
                                {selectedAppointment.pet.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">{selectedAppointment.pet.name}</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary-blue transition-colors">
                                    {selectedAppointment.pet.species?.name} • {selectedAppointment.pet.breed?.name || 'Standard Breed'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Owner Contact</p>
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-none">{selectedAppointment.owner.first_name} {selectedAppointment.owner.last_name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Physician</p>
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-none">Dr. {selectedAppointment.vet.first_name} {selectedAppointment.vet.last_name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Scheduled Date</p>
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-none">{format(parseISO(selectedAppointment.datetime), 'MMMM d, yyyy')}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Scheduled Time</p>
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-none">{format(parseISO(selectedAppointment.datetime), 'h:mm a')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Operational Status</p>
                            <div className="flex flex-wrap gap-2.5">
                                {['Pending', 'Confirmed', 'Completed', 'Canceled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(selectedAppointment.id, status)}
                                        className={`px-4 py-2.5 rounded-lg text-[10px] font-bold border transition-all uppercase tracking-widest ${selectedAppointment.status === status
                                            ? STATUS_COLORS[status] + ' shadow-sm ring-2 ring-current ring-offset-2'
                                            : 'bg-white border-border-gray text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border-gray">
                            <Link
                                href={route('appointments.show', selectedAppointment.id)}
                                className="block w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all text-center active:scale-95"
                            >
                                Open Comprehensive Record
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}
