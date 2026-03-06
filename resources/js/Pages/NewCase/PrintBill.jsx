import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function PrintBill({ invoice, clinic }) {
    useEffect(() => {
        setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 500);
        }, 500);
    }, []);

    const date = new Date(invoice.invoice_date).toLocaleString();

    // Group items: Injections/Vaccines vs Others based on category
    // Group items: Injections/Vaccines (summarized) vs All Others (individual)
    const injectionVaccineItems = invoice.items?.filter(item => {
        const cat = item.product?.category?.name?.toLowerCase() || item.category?.toLowerCase() || item.item_type?.toLowerCase() || '';
        return ['injections', 'vaccines', 'vaccine', 'injection'].includes(cat);
    }) || [];

    // Everything else (Foods, retail items, etc) listed individually
    const otherItems = invoice.items?.filter(item => {
        const cat = item.product?.category?.name?.toLowerCase() || item.category?.toLowerCase() || item.item_type?.toLowerCase() || '';
        return !['injections', 'vaccines', 'vaccine', 'injection'].includes(cat);
    }) || [];

    const injVacTotal = injectionVaccineItems.reduce((acc, item) => acc + parseFloat(item.line_total), 0);
    const injVacQty = injectionVaccineItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0);

    return (
        <div className="bg-white min-h-screen text-black font-mono p-4 max-w-[80mm] mx-auto print:p-0 print:m-0">
            <Head title={`Bill - ${invoice.invoice_number}`} />

            {/* Header */}
            <div className="text-center space-y-0.5 mb-4">
                <h1 className="text-lg font-black uppercase leading-tight">{clinic.name}</h1>
                <p className="text-[10px] uppercase font-bold">{clinic.address}</p>
                <p className="text-[10px] font-bold">Tel: {clinic.phone}</p>
                <div className="border-b border-black border-dashed my-2"></div>
                <div className="flex justify-between text-[10px] font-bold">
                    <span>Date: {date.split(',')[0]}</span>
                    <span>Time: {date.split(',')[1]}</span>
                </div>
                <div className="border-b border-black border-dashed my-2"></div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-[11px]">
                {injVacTotal > 0 && (
                    <div className="flex justify-between font-bold">
                        <span className="uppercase pr-2">Clinic Injections</span>
                        <span className="shrink-0">{injVacTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                )}

                {/* Service Charge */}
                {parseFloat(invoice.service_charge) > 0 && (
                    <div className="flex justify-between font-bold">
                        <span className="uppercase">Service Fee</span>
                        <span>{parseFloat(invoice.service_charge).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                )}

            </div>

            <div className="border-b border-black border-dashed my-3"></div>

            {/* Totals */}
            <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                    <span>Total Amount</span>
                    <span>LKR {parseFloat(invoice.net_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {parseFloat(invoice.discount_amount) > 0 && (
                    <div className="flex justify-between text-[10px] font-bold italic">
                        <span>Discount Given</span>
                        <span>- {parseFloat(invoice.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                )}
            </div>

            <div className="border-b border-black border-dashed mt-4 mb-2"></div>

            {/* Footer */}
            <div className="text-center space-y-1 mt-4">
                <p className="text-[11px] font-black uppercase tracking-widest">Thank you, Come Again</p>
                <p className="text-[9px] font-bold opacity-70">Software by Smart Pet Care</p>
                <div className="pt-4 opacity-10">.</div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; width: 80mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; margin: 0; padding: 4mm; }
                    * { font-family: 'Courier New', Courier, monospace; }
                }
            `}</style>
        </div>
    );
}
