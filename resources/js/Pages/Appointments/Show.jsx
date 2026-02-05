import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    User,
    Activity,
    ArrowLeft,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Stethoscope,
    Phone,
    Mail,
    ChevronRight,
    Search,
    Receipt,
    AlertCircle,
    PawPrint
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }) => {
    const colors = {
        'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
        'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
        'Completed': 'bg-green-50 text-green-600 border-green-100',
        'Canceled': 'bg-red-50 text-red-600 border-red-100',
    };
    return (
        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${colors[status]}`}>
            {status}
        </span>
    );
};

const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-xl p-8 border border-border-gray shadow-sm ${className}`}>
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 shadow-sm">
                <Icon size={18} />
            </div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        </div>
        {children}
    </div>
);

export default function AppointmentShow({ appointment }) {
    const updateStatus = (status) => {
        if (confirm(`Are you sure you want to change the status to ${status}?`)) {
            router.patch(route('appointments.update', appointment.id), { status });
        }
    };

    const formatDate = (dateStr, fmt = 'MMM dd, yyyy') => {
        try { return format(parseISO(dateStr), fmt); } catch (e) { return dateStr; }
    };

    return (
        <AppLayout>
            <Head title={`Appointment Session - #${appointment.id}`} />

            <div className="max-w-6xl mx-auto pb-12">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <Link
                        href={route('appointments.index')}
                        className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary-blue transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white border border-border-gray flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="uppercase tracking-widest text-[10px]">Back to Schedule</span>
                    </Link>

                    <div className="flex flex-wrap gap-3">
                        {appointment.status !== 'Completed' && (
                            <button
                                onClick={() => updateStatus('Completed')}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_8px_16px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-0.5"
                            >
                                <CheckCircle2 size={16} /> Mark Completed
                            </button>
                        )}
                        <Link
                            href={route('billing.create', { appointment_id: appointment.id, pet_id: appointment.pet_id, owner_id: appointment.owner_id })}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                        >
                            <Receipt size={16} /> Generate Invoice
                        </Link>
                    </div>
                </div>

                {/* Main Hero Header */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-10 md:px-12 md:py-16 text-white mb-10 shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl bg-primary-blue rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 p-24 opacity-5 blur-2xl bg-slate-100 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center relative shadow-2xl border-4 border-white/10 overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-primary-blue opacity-5"></div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">{formatDate(appointment.datetime, 'MMMM')}</span>
                                <span className="text-3xl md:text-5xl font-black text-slate-900">{formatDate(appointment.datetime, 'dd')}</span>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                    <StatusBadge status={appointment.status} />
                                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Tracking ID: #{appointment.id}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-none mb-4 uppercase">Clinical Appointment</h1>
                                <p className="text-base md:text-lg font-medium text-blue-200/80 flex items-center justify-center md:justify-start gap-3">
                                    <Clock size={20} className="text-primary-blue" />
                                    {formatDate(appointment.datetime, 'hh:mm a')} • Scheduled with <span className="text-white font-bold">Dr. {appointment.vet.last_name}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 w-full xl:w-auto">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Patient Intelligence</p>
                            <Link href={route('pets.show', appointment.pet_id)} className="flex items-center gap-5 group">
                                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white group-hover:bg-primary-blue transition-all group-hover:shadow-lg border border-white/10">
                                    <PawPrint size={28} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold group-hover:text-primary-blue transition-colors uppercase tracking-widest">{appointment.pet.name}</h4>
                                    <p className="text-sm font-bold text-white/50 uppercase tracking-tight">{appointment.pet.species.name} • {appointment.pet.breed?.name || 'Mixed'}</p>
                                </div>
                                <ChevronRight className="ml-2 text-white/20 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Detail Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <InfoCard title="Reason & Clinical Notes" icon={Stethoscope}>
                            <div className="mb-10">
                                <p className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tight">{appointment.reason || 'General Medical Consultation'}</p>
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                        "{appointment.notes || 'No specific clinical notes recorded for this visit session.'}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Services Provided</p>
                                    <span className="px-2 py-0.5 bg-blue-50 text-primary-blue text-[9px] font-bold rounded uppercase tracking-tighter border border-blue-100">{appointment.services.length} items</span>
                                </div>
                                {appointment.services.map(service => (
                                    <div key={service.id} className="flex items-center justify-between p-5 bg-white border border-border-gray rounded-xl hover:border-primary-blue/30 hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 text-primary-blue flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 uppercase tracking-tight text-sm">{service.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Medical Service</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-slate-900">LKR {parseFloat(service.cost || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {appointment.services.length === 0 && (
                                    <div className="p-12 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                                        <AlertCircle size={24} className="mx-auto text-slate-200 mb-2" />
                                        <p className="text-slate-400 font-bold italic text-sm">No specified clinical services assigned</p>
                                    </div>
                                )}
                            </div>
                        </InfoCard>

                        <InfoCard title="Guardian Information" icon={User}>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-xl bg-primary-blue text-white flex items-center justify-center font-bold text-2xl shadow-lg border border-white/10 shrink-0">
                                        {appointment.owner.first_name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-lg font-bold text-slate-900 leading-none mb-2 uppercase tracking-tight truncate">{appointment.owner.first_name} {appointment.owner.last_name}</h4>
                                        <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest leading-none">Primary Guardian</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <a href={`tel:${appointment.owner.phone}`} className="flex items-center justify-between p-4 bg-white border border-border-gray rounded-xl hover:bg-slate-50 transition-all group shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-blue group-hover:bg-white transition-all shadow-inner">
                                                <Phone size={14} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm">{appointment.owner.phone}</span>
                                        </div>
                                        <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                                    </a>
                                    <a href={`mailto:${appointment.owner.email}`} className="flex items-center justify-between p-4 bg-white border border-border-gray rounded-xl hover:bg-slate-50 transition-all group shadow-sm">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-blue group-hover:bg-white transition-all shadow-inner">
                                                <Mail size={14} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm truncate">{appointment.owner.email}</span>
                                        </div>
                                        <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                                    </a>
                                </div>
                            </div>
                        </InfoCard>
                    </div>

                    <div className="space-y-8">
                        <InfoCard title="Assigned Specialist" icon={User}>
                            <div className="flex items-center gap-5 mb-8">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${appointment.vet.first_name}+${appointment.vet.last_name}&background=1062FF&color=fff&bold=true`}
                                    className="w-20 h-20 rounded-2xl shadow-xl border-4 border-slate-50"
                                    alt="Veterinarian"
                                />
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 leading-none mb-2 uppercase tracking-tight">Dr. {appointment.vet.last_name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Lead Clinical Specialist</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-slate-100">
                                Update Specialist
                            </button>
                        </InfoCard>

                        <div className="bg-primary-blue rounded-xl p-8 text-white shadow-2xl relative overflow-hidden group border border-blue-400/20">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                <Activity size={100} />
                            </div>
                            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8 relative z-10">Administrative Control</h3>
                            <div className="space-y-4 relative z-10">
                                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl flex items-center justify-between transition-all group/btn shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-blue-200" />
                                        <span className="font-bold text-xs uppercase tracking-widest">Reschedule Session</span>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                </button>
                                <button
                                    onClick={() => updateStatus('Canceled')}
                                    className="w-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/20 p-4 rounded-xl flex items-center justify-between transition-all group/btn shadow-sm"
                                >
                                    <div className="flex items-center gap-3 text-red-100">
                                        <XCircle size={18} />
                                        <span className="font-bold text-xs uppercase tracking-widest">Abort Session</span>
                                    </div>
                                    <ChevronRight size={16} className="text-red-300 group-hover/btn:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-8 border border-border-gray shadow-sm flex items-center justify-center flex-col gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                                <Search size={32} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Reference History</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
