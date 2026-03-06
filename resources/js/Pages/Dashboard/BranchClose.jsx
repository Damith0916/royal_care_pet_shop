import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    ShieldOff,
    ArrowLeft,
    ClipboardList,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Download,
    Users,
    PawPrint,
    Activity,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../Components/ConfirmationModal';

export default function BranchClose({ summary }) {
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleClose = () => {
        router.post(route('branch-close.store'));
    };

    const handleDownload = () => {
        const rows = [
            ["Branch Close Summary", summary.date],
            ["", ""],
            ["Metric", "Value"],
            ["Total Revenue", summary.revenue],
            ["Active Invoices", summary.open_invoices_count],
            ["New Cases Created", summary.new_cases_count],
            ["New Owners Registered", summary.new_owners_count],
            ["New Pets Registered", summary.new_pets_count],
            ["", ""],
            ["Invoice Registry", ""],
            ["Invoice #", "Owner", "Pet", "Net Total", "Paid Amount", "Status"]
        ];

        summary.invoices.forEach(inv => {
            rows.push([
                inv.number,
                inv.owner,
                inv.pet,
                inv.total,
                inv.paid,
                inv.status
            ]);
        });

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Branch_Close_${summary.date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout>
            <Head title="Branch Close" />

            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold">Back to Dashboard</span>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Branch Closure</h1>
                    <p className="text-slate-500 mt-1">Review your daily summary before archiving the current session.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 mb-3">
                            <DollarSign size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                        <h3 className="text-xl font-black text-slate-900 leading-none">LKR {parseFloat(summary.revenue).toLocaleString()}</h3>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 mb-3">
                            <Activity size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Cases</p>
                        <h3 className="text-xl font-black text-slate-900 leading-none">{summary.new_cases_count}</h3>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100 mb-3">
                            <Users size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Clients</p>
                        <h3 className="text-xl font-black text-slate-900 leading-none">{summary.new_owners_count}</h3>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 mb-3">
                            <PawPrint size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Patients</p>
                        <h3 className="text-xl font-black text-slate-900 leading-none">{summary.new_pets_count}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-100">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Session Invoice Registry</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{summary.open_invoices_count} unclosed transactions</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary-blue hover:border-primary-blue/30 transition-all shadow-sm active:scale-95"
                        >
                            <Download size={14} />
                            Download Intelligence Report
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-4">Invoice #</th>
                                    <th className="px-8 py-4">Owner / Patient</th>
                                    <th className="px-8 py-4">Net Total</th>
                                    <th className="px-8 py-4">Received</th>
                                    <th className="px-8 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {summary.invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-black text-blue-600">#{inv.number}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-bold text-slate-900">{inv.owner}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.pet}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-slate-900 text-xs">
                                            LKR {parseFloat(inv.total).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-emerald-600 text-xs">
                                            LKR {parseFloat(inv.paid).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {summary.invoices.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-10 text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No active session data found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                    <div className="flex gap-4">
                        <div className="shrink-0">
                            <AlertCircle className="text-amber-600" size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-900 mb-1">Important Notice</h4>
                            <p className="text-sm text-amber-700 leading-relaxed font-medium">
                                Closing the branch will finalize all current transactions. These records will move to reports history and will no longer appear in the default Billing list. Ensure all payments for the day are recorded correctly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
                            <ShieldOff className="text-white" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Finalize & Close Session</h2>
                        <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">Confirm closure for {summary.date}</p>

                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                        >
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            Confirm Closure
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleClose}
                title="Secure Branch Closure"
                message="Are you sure you want to close this session? This will finalize and archive all active invoices. You will be logged out automatically."
                confirmText="Archive & Logout"
                type="danger"
            />
        </AppLayout>
    );
}
