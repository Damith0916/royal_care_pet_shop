import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function PrintPrescription({ record, clinic }) {
    useEffect(() => {
        setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 500);
        }, 500);
    }, []);

    const date = new Date(record.date_of_record).toLocaleDateString();

    return (
        <div className="bg-white min-h-screen font-serif text-slate-900 p-12 max-w-[21cm] mx-auto print:p-0 print:max-w-none">
            <Head title={`Prescription - ${record.pet.name}`} />

            {/* Header: Center Clinic Details */}
            <div className="text-center space-y-1 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{clinic.name}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{clinic.tagline}</p>
                <div className="text-[10px] text-slate-600 font-bold space-x-3 mt-2 flex items-center justify-center">
                    <span className="border border-slate-200 px-2 py-0.5 rounded-md">{clinic.address}</span>
                    <span className="border border-slate-900 text-slate-900 px-2 py-0.5 rounded-md tracking-wider">TP: {clinic.phone}</span>
                </div>
            </div>

            <div className="h-[2px] bg-slate-900 mb-6 rounded-full"></div>

            {/* Owner and Pet Details: Left & Right */}
            <div className="grid grid-cols-2 gap-8 mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-1.5">
                    <h3 className="text-[9px] font-black uppercase text-slate-300 tracking-[0.1em] mb-1">Owner Detail</h3>
                    <div className="space-y-0.5">
                        <p className="text-sm font-black text-slate-800">{record.pet.owner.first_name} {record.pet.owner.last_name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{record.pet.owner.address || 'Address Not Provided'}</p>
                        <p className="text-[11px] font-bold text-slate-700">{record.pet.owner.phone}</p>
                    </div>
                </div>
                <div className="space-y-1.5 text-right">
                    <h3 className="text-[9px] font-black uppercase text-slate-300 tracking-[0.1em] mb-1">Patient Detail</h3>
                    <div className="space-y-0.5">
                        <p className="text-sm font-black text-slate-800">{record.pet.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{record.pet.species?.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tabular-nums">Ref: {date}</p>
                    </div>
                </div>
            </div>

            {/* Medicine Section */}
            <div className="mb-8">
                <div className="flex items-end gap-4 border-b border-slate-900 pb-2 mb-4">
                    <div className="text-4xl font-serif italic text-slate-900 leading-none select-none">Rx</div>
                    <div className="flex-1 pb-0.5">
                        <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.1em]">Medical Prescription</h3>
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-[9px] uppercase font-black text-slate-400 border-b border-slate-100">
                            <th className="py-2 w-1/2 tracking-widest pl-2">Medicine / Drug</th>
                            <th className="py-2 text-center tracking-widest">Dose</th>
                            <th className="py-2 text-center tracking-widest">Frequency</th>
                            <th className="py-2 text-right tracking-widest pr-2">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {record.medications && record.medications.filter(m => !m.dosage?.startsWith('Administered')).length > 0 ? (
                            record.medications.filter(m => !m.dosage?.startsWith('Administered')).map((med, idx) => (
                                <tr key={idx} className="transition-colors border-b border-slate-50 last:border-0">
                                    <td className="py-4 font-black text-slate-900 pl-2">
                                        <div className="text-sm leading-none">{med.drug_name}</div>
                                    </td>
                                    <td className="py-4 text-center text-xs font-bold text-slate-600">{med.dosage}</td>
                                    <td className="py-4 text-center text-xs font-bold text-slate-600">{med.frequency}</td>
                                    <td className="py-4 text-right text-xs font-black text-slate-900 pr-2">{med.duration_days}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="py-12 text-center text-slate-300 italic text-xs font-medium">No medications prescribed.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Special Notes Section: Clean Outlined Box */}
            {record.rx_note && (
                <div className="mb-12 p-5 bg-slate-50/50 border border-slate-100 rounded-xl relative">
                    <h3 className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2 text-slate-400">
                        <span className="w-4 h-[1px] bg-slate-400"></span>
                        Special Directives
                    </h3>
                    <p className="text-xs leading-relaxed font-medium italic text-slate-700">
                        "{record.rx_note}"
                    </p>
                </div>
            )}

            {/* Footer: Doctor and Signature Space */}
            <div className="mt-auto pt-12">
                <div className="flex justify-end">
                    <div className="w-56 text-center">
                        <div className="border-b border-slate-400 mb-2 h-10"></div>
                        <p className="text-xs font-black text-slate-800 uppercase">
                            {clinic.doctor_name || record.vet?.name || 'Veterinary Surgeon'}
                        </p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Authorized Signature</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-family: 'Times New Roman', serif; }
                    .max-w-[21cm] { border: none !important; box-shadow: none !important; p: 0 !important; }
                }
            `}</style>
        </div>
    );
}
