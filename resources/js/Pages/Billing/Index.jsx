import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Plus, Filter, FileText, ChevronRight,
    ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2,
    Activity, Receipt, MoreHorizontal, Download
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Paid': 'bg-green-50 text-green-700 border-green-100',
        'Pending': 'bg-red-50 text-red-700 border-red-100',
        'Partial': 'bg-orange-50 text-orange-700 border-orange-100',
        'Overdue': 'bg-purple-50 text-purple-700 border-purple-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${colors[status]}`}>
            {status}
        </span>
    );
};

export default function BillingIndex({ invoices, owners }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInvoices = (invoices || []).filter(inv => {
        const invoiceNum = inv?.invoice_number || '';
        const ownerName = inv?.owner ? `${inv.owner.first_name} ${inv.owner.last_name}` : '';
        const lowerSearch = (searchTerm || '').toLowerCase();

        return invoiceNum.toLowerCase().includes(lowerSearch) ||
            ownerName.toLowerCase().includes(lowerSearch);
    });

    const stats = [
        { label: 'Total Revenue Today', value: 'LKR ' + (invoices || []).reduce((sum, inv) => sum + parseFloat(inv?.net_amount || 0), 0).toLocaleString(), icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
        {
            label: 'Total Outstanding', value: 'LKR ' + (invoices || []).reduce((sum, inv) => {
                const net = parseFloat(inv?.net_amount || 0);
                const paid = inv?.payments?.reduce((s, p) => s + parseFloat(p?.amount_paid || 0), 0) || 0;
                return sum + (net - paid);
            }, 0).toLocaleString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50'
        },
        { label: 'Active Invoices', value: (invoices || []).length, icon: Receipt, color: 'text-primary-blue', bg: 'bg-blue-50' },
    ];

    return (
        <AppLayout>
            <Head title="Billing & Invoicing" />

            {/* Header Hub */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Billing & Invoicing</h1>
                    <p className="text-sm font-medium text-slate-500">Manage clinical invoices and owner payments.</p>
                </div>
                <Link
                    href={route('billing.create')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    New Invoice
                </Link>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-border-gray shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center border border-current/10 transition-all group-hover:scale-110`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{stat.value}</h3>
                        <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>View details</span>
                            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoices List Card */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-border-gray bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search invoice or owner..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-border-gray pl-11 pr-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border-gray rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={14} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border-gray rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5 border-b border-border-gray">Invoice</th>
                                <th className="px-8 py-5 border-b border-border-gray">Owner & Patient</th>
                                <th className="px-8 py-5 border-b border-border-gray">Issue Date</th>
                                <th className="px-8 py-5 border-b border-border-gray">Total Amount</th>
                                <th className="px-8 py-5 border-b border-border-gray">Status</th>
                                <th className="px-8 py-5 border-b border-border-gray text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group text-slate-900">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary-blue uppercase tracking-tight">#{inv.invoice_number}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {inv.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-slate-900 uppercase tracking-tight mb-1">{inv.owner.first_name} {inv.owner.last_name}</p>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Activity size={12} className="text-primary-blue" />
                                                {inv.appointment?.pet?.name || 'Manual Billing'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                                            {format(parseISO(inv.invoice_date), 'MMM dd, yyyy')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">LKR {parseFloat(inv.net_amount).toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Paid: LKR {inv.payments?.reduce((s, p) => s + parseFloat(p.amount_paid), 0).toLocaleString() || '0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={route('billing.show', inv.id)}
                                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all inline-block shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredInvoices.length === 0 && (
                        <div className="py-20 text-center">
                            <FileText size={40} className="mx-auto text-slate-100 mb-4" />
                            <p className="text-slate-400 font-bold italic text-sm">No invoices found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
