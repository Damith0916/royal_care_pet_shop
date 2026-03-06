import React, { forwardRef } from 'react';
import { format, parseISO } from 'date-fns';

const ThermalReceipt = forwardRef(({ invoice, clinic }, ref) => {
    const clinicInfo = clinic || {
        name: 'Smart Pet Care Clinic',
        address: 'Clinic Address',
        phone: 'Clinic Phone',
        email: 'clinic@example.com'
    };

    return (
        <div ref={ref} className="thermal-receipt" style={{ width: '80mm', padding: '5mm', backgroundColor: 'white', color: 'black', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.2' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>{clinicInfo.name}</h2>
                <div style={{ fontSize: '10px', marginTop: '5px' }}>
                    {clinicInfo.address}<br />
                    Tel: {clinicInfo.phone}<br />
                </div>
            </div>

            <div style={{ borderTop: '1px dashed black', margin: '10px 0' }}></div>

            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>INV NO:</span>
                    <span>{invoice.invoice_number}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>DATE:</span>
                    <span>{format(new Date(invoice.invoice_date), 'dd/MM/yyyy')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>STATUS:</span>
                    <span style={{ fontWeight: 'bold' }}>{invoice.status.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <span>OWNER:</span>
                    <span>{invoice.owner.first_name} {invoice.owner.last_name}</span>
                </div>
                {invoice.medical_record?.pet && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>PATIENT:</span>
                        <span>{invoice.medical_record.pet.name}</span>
                    </div>
                )}
            </div>

            <div style={{ borderTop: '1px solid black', margin: '5px 0' }}></div>

            <div style={{ fontWeight: 'bold', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 1 }}>ITEM / SERVICE</span>
                <span style={{ width: '40px', textAlign: 'right' }}>QTY</span>
            </div>

            {invoice.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ flex: 1, textTransform: 'uppercase', fontSize: '11px' }}>{item.item_name}</span>
                        <span style={{ width: '40px', textAlign: 'right' }}>{item.quantity}</span>
                    </div>
                </div>
            ))}

            <div style={{ borderTop: '1px dashed black', margin: '15px 0' }}></div>

            <div style={{ spaceY: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SUBTOTAL:</span>
                    <span>LKR {parseFloat(invoice.total_amount).toLocaleString()}</span>
                </div>
                {parseFloat(invoice.service_charge) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>S. CHARGE:</span>
                        <span>+LKR {parseFloat(invoice.service_charge).toLocaleString()}</span>
                    </div>
                )}
                {parseFloat(invoice.discount_amount) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'black' }}>
                        <span>DISCOUNT:</span>
                        <span>-LKR {parseFloat(invoice.discount_amount).toLocaleString()}</span>
                    </div>
                )}
                {parseFloat(invoice.tax_amount) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>TAX:</span>
                        <span>LKR {parseFloat(invoice.tax_amount).toLocaleString()}</span>
                    </div>
                )}
                <div style={{ borderTop: '1px solid black', margin: '8px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                    <span>TOTAL AMOUNT:</span>
                    <span>LKR {parseFloat(invoice.net_amount).toLocaleString()}</span>
                </div>
            </div>

            <div style={{ borderTop: '1px dashed black', margin: '15px 0' }}></div>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ margin: '0', fontStyle: 'italic', fontSize: '11px' }}>Thank you for your visit!</p>
                <div style={{ marginTop: '10px', fontSize: '8px', opacity: '0.6' }}>
                    Printed at {format(new Date(), 'dd MMM yyyy HH:mm:ss')}
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        .thermal-receipt, .thermal-receipt * { visibility: visible; }
                        .thermal-receipt { 
                            position: absolute; 
                            left: 0; 
                            top: 0; 
                            width: 80mm !important;
                            margin: 0 !important;
                            padding: 5mm !important;
                        }
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }
                    }
                `}
            </style>
        </div>
    );
});

export default ThermalReceipt;
