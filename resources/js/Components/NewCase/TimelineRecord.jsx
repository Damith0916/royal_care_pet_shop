import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TimelineRecord = ({ record, isLast, onView }) => {
    const [activeTab, setActiveTab] = useState('clinic');
    const isToday = new Date(record.date_of_record).toLocaleDateString() === new Date().toLocaleDateString();

    const medications = record.medications || [];
    const vaccinations = record.vaccinations || [];

    const clinicActions = [
        ...vaccinations.map(v => ({ name: v.vaccine_type, type: 'Vaccine', dosage: '', quantity: '1' })),
        ...medications.filter(m => m.dosage?.startsWith('Administered')).map(m => ({
            name: m.drug_name,
            type: 'Injection',
            dosage: m.dosage.replace('Administered', '').replace('(', '').replace(')', '').trim(),
            quantity: m.quantity || '1'
        }))
    ];
    const scripts = medications.filter(m => !m.dosage?.startsWith('Administered')).map(m => ({
        name: m.drug_name,
        quantity: m.quantity || m.dose || '1',
        frequency: m.frequency || '',
        duration: m.duration || ''
    }));

    return (
        <div className="flex gap-3 group/timeline relative">
            {/* Ultra-Minimalist Connector */}
            {!isLast && (
                <div className="absolute left-[3.5px] top-6 bottom-[-20px] w-[1px] bg-slate-100 group-hover/timeline:bg-blue-200 transition-colors"></div>
            )}

            <div className={`w-2 h-2 rounded-full border border-white shadow-sm flex-shrink-0 relative z-10 mt-2 transition-all duration-500 group-hover/timeline:scale-125 ${isToday ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-300'}`}></div>

            <div className="flex-1 pb-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all duration-500 hover:shadow-lg hover:border-blue-300">
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[11px] font-bold text-slate-800 tracking-tight">{format(new Date(record.date_of_record), 'MMM dd, yyyy')}</p>
                        {isToday && <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded tracking-wider">Live</span>}
                    </div>

                    <div className="space-y-2">
                        {/* Compact Diagnosis */}
                        {record.diagnosis && (
                            <div className="flex items-start gap-2.5">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full mt-0.5"></div>
                                <p className="text-xs font-bold text-slate-900 tracking-tight leading-snug">{record.diagnosis}</p>
                            </div>
                        )}

                        {/* List-style Signs */}
                        {record.clinical_signs?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                                {record.clinical_signs.map((sign, idx) => (
                                    <span key={idx} className="text-[10px] font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover/timeline:bg-white group-hover/timeline:border-blue-100 transition-all">{sign}</span>
                                ))}
                            </div>
                        )}

                        {/* Micro Treatment Matrix */}
                        <div className="pt-2 mt-2 border-t border-slate-50 relative group/matrix">
                            <div className="flex bg-slate-50/50 p-1 rounded-lg border border-slate-100 mb-2 w-fit">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveTab('clinic'); }}
                                    className={`px-3.5 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'clinic' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:text-slate-600'}`}
                                >
                                    Injections
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveTab('scripts'); }}
                                    className={`px-3.5 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'scripts' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:text-slate-600'}`}
                                >
                                    Take-home
                                </button>
                            </div>

                            <div className="min-h-[15px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-1"
                                    >
                                        {activeTab === 'clinic' && (
                                            clinicActions.length > 0 ? clinicActions.map((v, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${v.type === 'Vaccine' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                                                        <span className="text-[11px] font-semibold text-slate-700 tracking-tight truncate max-w-[120px]">{v.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{v.quantity} Qty</span>
                                                </div>
                                            )) : <span className="text-[8px] text-slate-500 font-medium italic opacity-60">No injections</span>
                                        )}
                                        {activeTab === 'scripts' && (
                                            scripts.length > 0 ? scripts.map((m, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                        <span className="text-[11px] font-semibold text-slate-700 tracking-tight truncate max-w-[120px]">{m.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50">{m.quantity} Qty</span>
                                                </div>
                                            )) : <span className="text-[8px] text-slate-500 font-medium italic opacity-60">No scripts</span>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover/timeline:opacity-100 transition-all">
                        <button
                            onClick={(e) => { e.stopPropagation(); onView(); }}
                            className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                        >
                            <ChevronRight size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineRecord;
