import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search, FileText, ChevronRight,
    Receipt, PawPrint, Printer
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';

const StatusBadge = ({ status }) => {
    const colors = {
        'Paid': 'bg-green-50 text-green-700 border-green-100',
        'Pending': 'bg-red-50 text-red-700 border-red-100',
        'Partial': 'bg-orange-50 text-orange-700 border-orange-100',
        'Overdue': 'bg-purple-50 text-purple-700 border-purple-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[status]}`}>
            {status}
        </span>
    );
};

export default function BillingIndex({ invoices, owners }) {
    const [searchTerm, setSearchTerm] = useState('');

    const { clinic } = usePage().props;

    const handlePrint = (inv) => {
        const printWindow = window.open('', '_blank');
        const itemRows = (inv.items || []).map(item => `
        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #eee; font-size: 12px;">
            <div style="flex: 1;">
                <div style="font-weight: bold; text-transform: uppercase;">${item.item_name}</div>
                <div style="font-size: 10px; color: #666;">${item.quantity} units x LKR ${parseFloat(item.unit_price).toLocaleString()}</div>
            </div>
            <div style="font-weight: bold;">LKR ${(item.unit_price * item.quantity).toLocaleString()}</div>
        </div>
        `).join('');

        const total = parseFloat(inv.net_amount);

        printWindow.document.write(`
        <html>
            <head>
                <title>Reprint Bill - ${inv.invoice_number}</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; width: 80mm; padding: 10px; margin: 0; color: #000; }
                    .header { text-align: center; margin-bottom: 15px; }
                    .clinic-name { font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase; }
                    .contact { font-size: 10px; margin: 5px 0; }
                    .divider { border-top: 1px dashed #000; margin: 10px 0; }
                    .summary-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin: 3px 0; }
                    .total { font-size: 16px; margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                    @media print { body { width: 80mm; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="clinic-name">${clinic?.name?.toUpperCase() || 'SMART PETCARE'}</h1>
                    <div class="contact">
                        ${clinic?.address?.toUpperCase() || 'VETERINARY HEALTH HUB'}<br>
                        TEL: ${clinic?.phone || 'N/A'}
                    </div>
                    <div class="divider"></div>
                    <div style="font-size: 12px; font-weight: bold;">DUPLICATE RECEIPT</div>
                    <div style="font-size: 10px;">Original: ${format(parseISO(inv.invoice_date), 'MMM dd, yyyy')}</div>
                    <div style="font-size: 10px;">Reprinted: ${new Date().toLocaleString()}</div>
                </div>

                <div class="divider"></div>
                
                <div style="font-size: 10px; margin-bottom: 10px;">
                    INVOICE: #${inv.invoice_number}<br>
                    OWNER: ${inv.owner.first_name} ${inv.owner.last_name}<br>
                    PATIENT: ${inv.medical_record?.pet?.name || 'Patient'}
                </div>

                <div class="divider"></div>

                ${itemRows}
                
                <div class="summary-row" style="margin-top: 10px;">
                    <span>SERVICE CHARGE</span>
                    <span>LKR ${parseFloat(inv.service_charge || 0).toLocaleString()}</span>
                </div>

                <div class="summary-row total">
                    <span>TOTAL</span>
                    <span>LKR ${total.toLocaleString()}</span>
                </div>

                <div class="divider"></div>
                
                <div class="footer">
                    THANK YOU FOR CHOOSING SMART PETCARE!<br>
                    THIS IS A SYSTEM GENERATED DUPLICATE.
                </div>

                <script>window.print(); setTimeout(() => window.close(), 500);</script>
            </body>
        </html>
        `);
        printWindow.document.close();
    };

    const filteredInvoices = (invoices || []).filter(inv => {
        const invoiceNum = inv?.invoice_number || '';
        const ownerName = inv?.owner ? `${inv.owner.first_name} ${inv.owner.last_name}` : '';
        const lowerSearch = (searchTerm || '').toLowerCase();

        return invoiceNum.toLowerCase().includes(lowerSearch) ||
            ownerName.toLowerCase().includes(lowerSearch);
    });

    return (
        <AppLayout>
            <Head title="Billing & Invoicing" />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Billing & Finance</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage and review clinical invoices and payments.</p>
                </div>
            </div>

            {/* Invoices Table Card */}
            <div className="card-standard overflow-hidden bg-white">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search by invoice number or owner..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 transition-all outline-none text-slate-900"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                            <tr>
                                <th className="px-5 py-3.5">Invoice</th>
                                <th className="px-5 py-3.5">Client & Patient</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Amount</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Reprint</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-blue-50/20 transition-colors group text-slate-900">
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary-blue text-sm">#{inv.invoice_number}</span>
                                            <span className="text-xs text-slate-400 mt-0.5">ID: {inv.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">{inv.owner.first_name} {inv.owner.last_name}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                <PawPrint size={10} className="text-primary-blue" />
                                                {inv.medical_record?.pet?.name || 'Patient'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-medium text-slate-600">
                                            {format(parseISO(inv.invoice_date), 'MMM dd, yyyy')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">LKR {parseFloat(inv.net_amount).toLocaleString()}</span>
                                            <span className="text-xs text-emerald-600 mt-0.5">
                                                Paid: LKR {inv.payments?.reduce((s, p) => s + parseFloat(p.amount_paid), 0).toLocaleString() || '0'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => handlePrint(inv)}
                                            className="p-2 bg-white text-slate-400 hover:text-primary-blue hover:bg-blue-50 border border-slate-200 hover:border-primary-blue/30 rounded-lg transition-all inline-block shadow-sm"
                                        >
                                            <Printer size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredInvoices.length === 0 && (
                        <div className="py-16 text-center">
                            <FileText size={32} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 font-medium text-sm">No invoices found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
