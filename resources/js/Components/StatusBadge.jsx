import React from 'react';

const StatusBadge = ({ status }) => {
    const colors = {
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'In Progress': 'bg-blue-50 text-primary-blue border-blue-100',
        'Pending': 'bg-slate-50 text-slate-700 border-slate-100',
        'Cancelled': 'bg-red-50 text-danger border-red-100'
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-tight border shadow-sm ${colors[status] || colors.Pending}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
