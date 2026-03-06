import React, { useState, useRef } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    FileText, Download, Printer, ArrowLeft, CreditCard,
    CheckCircle2, Calendar, User, ChevronRight, Search,
    Clock, X, Plus, Banknote, ShieldCheck, Mail, Phone, MapPin, PawPrint
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ThermalReceipt from '../../Components/Billing/ThermalReceipt';

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

export default function BillingShow({ invoice, clinic }) {
    const thermalRef = useRef();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        amount: invoice.net_amount - invoice.payments.reduce((s, p) => s + parseFloat(p.amount_paid), 0),
        payment_method: 'Cash',
    });

    const handleThermalPrint = () => {
        if (invoice.status !== 'Paid') {
            alert('Cannot print receipt until invoice is fully PAID.');
            return;
        }
        const printContent = thermalRef.current;
        const windowUrl = 'about:blank';
        const uniqueName = new Date().getTime();
        const printWindow = window.open(windowUrl, uniqueName, 'left=50,top=50,width=400,height=600');

        printWindow.document.write('<html><head><title>Thermal Receipt</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('billing.payment', invoice.id), {
            onSuccess: () => {
                setShowPaymentModal(false);
                reset();
            },
        });
    };

    const remainingBalance = parseFloat(invoice.net_amount) - invoice.payments.reduce((s, p) => s + parseFloat(p.amount_paid), 0);

    return (
        <AppLayout>
            <Head title={`Invoice #${invoice.invoice_number}`} />

            <div className="max-w-5xl mx-auto">
                {/* Navigation & Actions */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <Link
                        href={route('billing.index')}
                        className="flex items-center gap-2 group px-4 py-2.5 bg-white border border-border-gray rounded-xl text-sm font-bold text-slate-500 hover:text-primary-blue shadow-sm transition-all"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Billing History
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleThermalPrint}
                            disabled={invoice.status !== 'Paid'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${invoice.status === 'Paid'
                                ? 'bg-slate-900 text-white hover:-translate-y-0.5'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <Printer size={16} />
                            {invoice.status === 'Paid' ? 'Print Thermal Bill' : 'Payment Required to Print'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Invoice Document */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden p-10 md:p-12 relative">
                            {/* Watermark/Accent */}
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none text-primary-blue">
                                <ShieldCheck size={240} />
                            </div>

                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between gap-10 pb-12 border-b border-border-gray relative z-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-lg font-black tracking-widest text-primary-blue uppercase leading-none block">SmartPet</span>
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase leading-none mt-1">Care Clinic</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Invoice</h1>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-primary-blue uppercase tracking-tight">#{invoice.invoice_number}</span>
                                            <StatusBadge status={invoice.status} />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-left md:text-right space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                                        <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">{format(parseISO(invoice.invoice_date), 'MMMM dd, yyyy')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Ref</p>
                                        <p className="text-xs font-bold text-slate-500 font-mono">#{invoice.id.toString().padStart(6, '0')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Parties */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-border-gray">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed To</p>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{invoice.owner.first_name} {invoice.owner.last_name}</h4>
                                        <div className="space-y-2 text-sm font-medium text-slate-500">
                                            <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {invoice.owner.address || 'Address not recorded'}</p>
                                            <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {invoice.owner.phone}</p>
                                            <p className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {invoice.owner.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Context</p>
                                    {invoice.medical_record?.pet ? (
                                        <Link href={route('pets.show', invoice.medical_record.pet.id)} className="flex items-center gap-4 group bg-slate-50 p-4 rounded-xl border border-border-gray hover:border-primary-blue/30 transition-all shadow-sm">
                                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center font-bold transition-all group-hover:scale-110">
                                                <PawPrint size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-primary-blue transition-colors uppercase tracking-tight leading-none mb-1">{invoice.medical_record.pet.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invoice.medical_record.pet.species?.name || 'Patient'}</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-border-gray text-center">
                                            <p className="text-sm font-bold text-slate-400 italic">Clinical context not available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="py-12 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-border-gray">
                                            <th className="pb-6">Description</th>
                                            <th className="pb-6 text-center">Qty</th>
                                            <th className="pb-6 text-right">Unit Price</th>
                                            <th className="pb-6 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {invoice.items.map((item, idx) => (
                                            <tr key={idx} className="group text-slate-900">
                                                <td className="py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 text-base uppercase tracking-tight">{item.item_name}</span>
                                                        <span className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mt-1 opacity-70">{item.item_type} • ID: #{item.item_id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center">
                                                    <span className="px-3 py-1 bg-slate-50 border border-border-gray rounded text-xs font-bold text-slate-600">{item.quantity}</span>
                                                </td>
                                                <td className="py-6 text-right font-medium text-slate-500">LKR {parseFloat(item.unit_price_at_sale).toLocaleString()}</td>
                                                <td className="py-6 text-right font-bold text-slate-900">LKR {parseFloat(item.line_total).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Section */}
                            <div className="flex flex-col md:flex-row justify-between gap-12 pt-12 border-t border-border-gray">
                                <div className="flex-1 max-w-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Terms & Conditions</p>
                                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                                        This invoice was generated by the SmartPetCare management system.
                                        Please ensure all payments are made in a timely manner.
                                        For any inquiries, please contact our support team.
                                    </p>
                                </div>
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">LKR {parseFloat(invoice.total_amount).toLocaleString()}</span>
                                    </div>
                                    {parseFloat(invoice.service_charge) > 0 && (
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Service Charge</span>
                                            <span className="text-slate-900">+LKR {parseFloat(invoice.service_charge).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {parseFloat(invoice.discount_amount) > 0 && (
                                        <div className="flex justify-between text-[10px] font-bold text-danger uppercase tracking-widest">
                                            <span>Adjustments</span>
                                            <span>-LKR {parseFloat(invoice.discount_amount).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="pb-6 border-b border-border-gray flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Taxes</span>
                                        <span className="text-slate-900">LKR {parseFloat(invoice.tax_amount).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-6 flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-1.5">Total Amount Due</span>
                                        <span className="text-3xl font-bold text-slate-900 tracking-tight">LKR {parseFloat(invoice.net_amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Context */}
                    <div className="space-y-8">
                        {/* Transaction History */}
                        <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden group border border-slate-800">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700 text-primary-blue">
                                <CreditCard size={120} />
                            </div>
                            <h3 className="text-lg font-bold mb-8 relative z-10 flex items-center gap-3 uppercase tracking-tight">
                                <Banknote className="text-primary-blue" size={20} />
                                Payment Records
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {invoice.payments.map((p, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm group/item hover:bg-white/10 transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-success/20 text-success flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base tracking-tight leading-none mb-1.5 active:scale-95">LKR {parseFloat(p.amount_paid).toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{format(parseISO(p.payment_date), 'MMM dd')} • {p.payment_method}</p>
                                        </div>
                                    </div>
                                ))}
                                {invoice.payments.length === 0 && (
                                    <div className="py-10 text-center text-white/20 italic font-bold text-sm">No payments recorded yet</div>
                                )}
                            </div>
                            {invoice.status !== 'Paid' && (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full mt-8 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                >
                                    Record New Payment
                                </button>
                            )}
                        </div>

                        {/* Payment Modal */}
                        <AnimatePresence>
                            {showPaymentModal && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/60"
                                    >
                                        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                                    <Banknote size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Record Payment</h3>
                                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-70">Remaining: LKR {remainingBalance.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setShowPaymentModal(false)} className="p-2.5 text-slate-700 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95"><X size={20} /></button>
                                        </div>
                                        <form onSubmit={submitPayment} className="p-8 space-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Payment Amount (LKR)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-primary-blue/5 focus:bg-white focus:border-primary-blue/30 outline-none transition-all"
                                                    value={data.amount}
                                                    onChange={e => setData('amount', e.target.value)}
                                                />
                                                {errors.amount && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.amount}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Payment Method</label>
                                                <select
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-primary-blue/5 focus:bg-white focus:border-primary-blue/30 outline-none transition-all appearance-none"
                                                    value={data.payment_method}
                                                    onChange={e => setData('payment_method', e.target.value)}
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Card">Credit/Debit Card</option>
                                                    <option value="Transfer">Bank Transfer</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full py-5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-[10px] disabled:opacity-50"
                                            >
                                                {processing ? 'Processing...' : 'Confirm Payment'}
                                            </button>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Audit Info */}
                        <div className="bg-white rounded-xl p-8 border border-border-gray shadow-sm text-center">
                            <ShieldCheck size={48} className="mx-auto text-blue-50 mb-6" />
                            <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-tight">Verified Terminal</h4>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                                This transaction is encrypted and recorded in the clinic's secure financial ledger.
                            </p>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-border-gray">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Certified By</p>
                                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Clinic Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Thermal Receipt for Printing */}
            <div style={{ display: 'none' }}>
                <div ref={thermalRef}>
                    <ThermalReceipt invoice={invoice} clinic={clinic} />
                </div>
            </div>

            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                }
                `}
            </style>
        </AppLayout>
    );
}
