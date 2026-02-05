import React from 'react';
import PortalLayout from '../../Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    ArrowLeft,
    Download,
    ChevronRight,
    CreditCard,
    ArrowUpRight,
    Calendar
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Paid': 'bg-green-50 text-green-600 border-green-100',
        'Pending': 'bg-red-50 text-red-600 border-red-100',
        'Partial': 'bg-orange-50 text-orange-600 border-orange-100',
        'Overdue': 'bg-purple-50 text-purple-600 border-purple-100',
    };
    return (
        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${colors[status]}`}>
            {status}
        </span>
    );
};

export default function Invoices({ owner, invoices, clinic }) {
    return (
        <PortalLayout owner={owner} clinic={clinic}>
            <Head title="Your Invoices" />

            <div className="mb-8">
                <Link
                    href={`/portal/${owner.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Payments</h1>
            </div>

            <div className="space-y-6 pb-20">
                {invoices.map(invoice => (
                    <div
                        key={invoice.id}
                        className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">#{invoice.invoice_number}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Issued {format(parseISO(invoice.created_at), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <StatusBadge status={invoice.status} />
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <h3 className="text-2xl font-black text-gray-900">${invoice.total_amount}</h3>
                            </div>
                            <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                <Download size={20} />
                            </button>
                        </div>

                        {/* Tiny Detail Bar */}
                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-500">
                            <div className="flex items-center gap-2 uppercase tracking-wider">
                                <Calendar size={12} />
                                Due: {format(parseISO(invoice.due_date), 'MMM dd')}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                                Details <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}

                {invoices.length === 0 && (
                    <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-4">
                        <CreditCard size={56} className="opacity-10" />
                        <h3 className="text-lg font-bold text-gray-900 opacity-50">No Invoices Found</h3>
                        <p className="text-sm font-medium">You don't have any billing records yet.</p>
                    </div>
                )}
            </div>

            {/* Total Summary Sticky Card (Optional) */}
            <div className="fixed bottom-24 inset-x-6">
                <div className="bg-[#1E1E2D] rounded-[28px] p-6 text-white shadow-2xl flex items-center justify-between border border-white/5">
                    <div>
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Pending Balance</p>
                        <h4 className="text-xl font-black tracking-tight">$0.00</h4>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/30">
                        Pay All
                    </button>
                </div>
            </div>
        </PortalLayout>
    );
}
