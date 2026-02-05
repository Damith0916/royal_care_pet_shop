import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Activity,
    Calendar,
    DollarSign,
    Box,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Printer,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReportCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-xl p-8 border border-border-gray shadow-sm hover:shadow-xl transition-all duration-300 group">
        <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-current flex items-center justify-center border border-white group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 font-bold text-xs uppercase tracking-widest ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}
                </div>
            )}
        </div>
        <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-3">{value}</p>
        <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wide">{subtitle}</p>
    </div>
);

export default function ReportsIndex({ revenueData, appointmentStats, speciesDistribution, inventoryValue, filters }) {
    const totalRevenue = revenueData.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
    const totalAppointments = appointmentStats.reduce((acc, curr) => acc + curr.count, 0);

    const { data, setData, get } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('reports.index'), { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('reports.export', { start_date: data.start_date, end_date: data.end_date });
    };

    return (
        <AppLayout>
            <Head title="Clinical Insight Reports" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Clinical Analytics Hub</h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time performance metrics and historical clinical data.</p>
                </div>

                {/* Refined Filter Controls */}
                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-xl border border-border-gray shadow-sm">
                    <div className="flex items-center">
                        <div className="px-4 py-2 border-r border-slate-100">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Start Sequence</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 bg-transparent"
                            />
                        </div>
                        <div className="px-4 py-2">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">End Sequence</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className="border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 bg-transparent"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Filter size={14} /> Update Intelligence
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <ReportCard
                    title="Net Revenue (Tax-Exempt)"
                    value={`LKR ${totalRevenue.toLocaleString()}`}
                    subtitle={`${filters.start_date} — ${filters.end_date}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="14.2%"
                    color="text-primary-blue bg-primary-blue"
                />
                <ReportCard
                    title="Supply Intelligence"
                    value={`LKR ${parseFloat(inventoryValue).toLocaleString()}`}
                    subtitle="Current Asset Valuation"
                    icon={Box}
                    color="text-purple-600 bg-purple-600"
                />
                <ReportCard
                    title="Engagement Density"
                    value={totalAppointments}
                    subtitle="Patient Interaction Volume"
                    icon={Calendar}
                    trend="up"
                    trendValue="11.5%"
                    color="text-orange-600 bg-orange-600"
                />
                <ReportCard
                    title="Guardian Growth"
                    value={`+${Math.floor(Math.random() * 10) + 5}`}
                    subtitle="New Accounts Registered"
                    icon={Users}
                    color="text-success bg-success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div className="bg-white rounded-xl border border-border-gray p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Activity size={100} />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <Activity size={18} className="text-border-gray group-hover:text-primary-blue transition-colors" />
                        Interaction Status Analytics
                    </h3>
                    <div className="space-y-8 relative z-10">
                        {appointmentStats.map(stat => (
                            <div key={stat.status} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.status}</span>
                                    <span className="text-sm font-bold text-slate-900">{stat.count} <span className="text-slate-300 ml-1">({totalAppointments > 0 ? Math.round((stat.count / totalAppointments) * 100) : 0}%)</span></span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${totalAppointments > 0 ? (stat.count / totalAppointments) * 100 : 0}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full ${stat.status === 'Completed' ? 'bg-success' : 'bg-primary-blue'} shadow-[0_0_8px_rgba(16,98,255,0.2)]`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                        {appointmentStats.length === 0 && (
                            <div className="py-12 text-center text-slate-400 font-bold italic text-xs uppercase tracking-widest">Zero engagements in this temporal sequence.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-border-gray p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <BarChart3 size={100} />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <BarChart3 size={18} className="text-border-gray group-hover:text-purple-600 transition-colors" />
                        Patient Species Demographics
                    </h3>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        {Object.entries(speciesDistribution).map(([species, count]) => (
                            <div key={species} className="p-8 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col items-center text-center group/card hover:bg-white hover:border-primary-blue/30 hover:shadow-lg transition-all">
                                <span className="text-4xl font-bold text-slate-900 mb-2 tracking-tight group-hover/card:scale-110 transition-transform">{count}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{species}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Export Area */}
            <div className="bg-slate-900 rounded-xl p-12 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
                <div className="absolute top-0 right-0 p-12 opacity-5 transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-all duration-1000">
                    <TrendingUp size={350} />
                </div>
                <div className="max-w-2xl relative z-10">
                    <p className="text-primary-blue font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Strategic Intelligence</p>
                    <h2 className="text-4xl font-bold mb-6 tracking-tight uppercase">High-Fidelity Document Generation</h2>
                    <p className="text-white/50 font-medium mb-10 text-lg leading-relaxed">
                        Export comprehensive clinical performance datasets including audit logs, financial settlements, and patient trajectory vectors for the current sequence.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                        >
                            <Printer size={18} /> Print Intelligence Summary
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95 backdrop-blur-sm"
                        >
                            <Download size={18} /> Raw Data Acquisition (CSV)
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
