import React from 'react';
import PortalLayout from '../../Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import {
    PawPrint,
    ArrowLeft,
    Stethoscope,
    Syringe,
    Clock,
    FileText,
    Activity,
    CheckCircle2,
    Pill
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function PetProfile({ owner, pet, clinic }) {
    return (
        <PortalLayout owner={owner} clinic={clinic}>
            <Head title={`${pet.name}'s Medical Timeline`} />

            <div className="mb-8">
                <Link
                    href={`/portal/${owner.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                        <PawPrint size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">{pet.name}</h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{pet.species.name} • {pet.breed?.name || 'Mixed'}</p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                <div className="bg-white px-5 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 shrink-0">
                    <Activity className="text-blue-500" size={18} />
                    <span className="text-sm font-bold text-gray-900">25.5 kg</span>
                </div>
                <div className="bg-white px-5 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 shrink-0">
                    <Syringe className="text-orange-500" size={18} />
                    <span className="text-sm font-bold text-gray-900">Up to date</span>
                </div>
            </div>

            {/* Medical Timeline */}
            <div className="space-y-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" />
                    Medical History
                </h3>

                <div className="relative pl-8 space-y-10">
                    {/* Timeline Line */}
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                    {pet.medical_records.map((record, idx) => (
                        <div key={record.id} className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[35px] top-1 w-7 h-7 bg-white rounded-full border-4 border-blue-600 shadow-sm z-10 flex items-center justify-center">
                                <Stethoscope size={12} className="text-blue-600" />
                            </div>

                            <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm border-l-4 border-l-blue-600">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{format(parseISO(record.date_of_record), 'MMMM dd, yyyy')}</p>
                                        <h4 className="font-bold text-gray-900">{record.diagnosis || 'Clinical Visit'}</h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Dr. {record.vet?.first_name}</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{record.treatment_plan}</p>
                            </div>
                        </div>
                    ))}

                    {pet.medical_records.length === 0 && (
                        <div className="py-10 text-center text-gray-400 flex flex-col items-center gap-3">
                            <FileText size={48} className="opacity-10" />
                            <p className="text-sm font-bold">No history recorded</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Vaccinations */}
            <div className="mt-12 space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Syringe size={14} className="text-orange-500" />
                    Vaccination Card
                </h3>
                <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100">
                    {pet.vaccinations?.map((v, i) => (
                        <div key={i} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <CheckCircle2 size={18} />
                                </div>
                                <span className="text-sm font-bold text-gray-900">{v.vaccine_name || 'Rabies v1'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{format(parseISO(v.vaccination_date), 'MMM yyyy')}</span>
                        </div>
                    )) || (
                            <div className="p-6 text-center text-gray-400 text-xs font-bold">No vaccination data</div>
                        )}
                </div>
            </div>
        </PortalLayout>
    );
}
