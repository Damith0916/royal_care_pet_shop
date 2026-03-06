import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Box,
    ArrowUpRight,
    Download,
    Printer,
    Filter,
    PawPrint,
    Activity,
    Stethoscope,
    Heart,
    FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#1062FF', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

const TabButton = ({ active, onClick, children, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${active
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
            : 'text-slate-400 hover:text-slate-600'
            }`}
    >
        <Icon size={14} /> <span>{children}</span>
    </button>
);

const StatMini = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100'
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${colorMap[color] || 'bg-slate-50'} flex items-center justify-center border shadow-sm`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-slate-500 text-xs font-medium leading-none mb-1">{label}</p>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</h4>
            </div>
        </div>
    );
};

export default function ReportsIndex({
    revenueData, totalRevenue, totalInvoices,
    totalPets, totalOwners, petsBySpecies, petsByGender, ageRanges,
    newPetsInPeriod, topDiagnoses, totalDiagnosesInPeriod, totalCases,
    inventoryValue, filters
}) {
    const [activeTab, setActiveTab] = useState('pets');

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

    const speciesChartData = (petsBySpecies || []).map((s, i) => ({
        name: s.name,
        value: s.count,
        fill: COLORS[i % COLORS.length]
    }));

    const genderChartData = (petsByGender || []).map((g, i) => ({
        name: g.gender,
        value: g.count,
        fill: COLORS[i % COLORS.length]
    }));

    const ageData = Object.entries(ageRanges || {}).map(([range, count]) => ({
        name: range,
        count: count
    }));

    const diagnosisChartData = (topDiagnoses || []).slice(0, 10).map((d, i) => ({
        name: d.name.length > 18 ? d.name.substring(0, 18) + '...' : d.name,
        fullName: d.name,
        count: d.count,
        fill: COLORS[i % COLORS.length]
    }));

    return (
        <AppLayout>
            <Head title="Reports" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Reports</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Clinical performance analytics and summaries.</p>
                </div>

                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="px-4 py-1.5 border-r border-slate-100">
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Start</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="border-none p-0 text-sm font-semibold text-slate-900 focus:ring-0 bg-transparent"
                            />
                        </div>
                        <div className="px-4 py-1.5">
                            <label className="block text-xs font-semibold text-slate-400 mb-1">End</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className="border-none p-0 text-sm font-semibold text-slate-900 focus:ring-0 bg-transparent"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Filter size={14} /> Apply
                    </button>
                </form>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1.5 mb-6 bg-slate-100/60 p-1 rounded-xl border border-slate-200 w-fit">
                <TabButton active={activeTab === 'pets'} onClick={() => setActiveTab('pets')} icon={PawPrint}>Pet Census</TabButton>
                <TabButton active={activeTab === 'sales'} onClick={() => setActiveTab('sales')} icon={DollarSign}>Sales & Revenue</TabButton>
                <TabButton active={activeTab === 'diagnosis'} onClick={() => setActiveTab('diagnosis')} icon={Activity}>Clinical Diagnoses</TabButton>
            </div>

            <AnimatePresence mode="wait">
                {/* PET CENSUS TAB */}
                {activeTab === 'pets' && (
                    <motion.div key="pets" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatMini label="Total Registered Pets" value={totalPets} icon={PawPrint} color="blue" />
                            <StatMini label="Total Owners" value={totalOwners} icon={Users} color="purple" />
                            <StatMini label="New Pets (Period)" value={newPetsInPeriod} icon={Heart} color="emerald" />
                            <StatMini label="Inventory Value" value={`LKR ${parseFloat(inventoryValue || 0).toLocaleString()}`} icon={Box} color="amber" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Species Distribution */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary-blue rounded-full"></div>
                                    Species Distribution
                                </h3>
                                {speciesChartData.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {speciesChartData.map((s, i) => {
                                            const percentage = totalPets > 0 ? (s.value / totalPets) * 100 : 0;
                                            return (
                                                <div key={s.name}>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-400">{percentage.toFixed(1)}%</span>
                                                            <span className="text-sm font-bold text-slate-900">{s.value}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: s.fill }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm text-center py-8">No species data available.</p>
                                )}
                            </div>

                            {/* Gender Breakdown */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                                    Gender Breakdown
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {genderChartData.map((g, i) => (
                                        <div key={g.name} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all">
                                            <span className="text-3xl font-bold text-slate-900 mb-1">{g.value}</span>
                                            <span className="text-xs font-semibold text-slate-500">{g.name}</span>
                                            <span className="text-xs font-semibold mt-1" style={{ color: COLORS[i] }}>
                                                {totalPets > 0 ? ((g.value / totalPets) * 100).toFixed(1) : 0}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SALES REPORT TAB */}
                {activeTab === 'sales' && (
                    <motion.div key="sales" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatMini label="Total Revenue" value={`LKR ${parseFloat(totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="emerald" />
                            <StatMini label="Paid Invoices" value={totalInvoices || 0} icon={FileText} color="blue" />
                            <StatMini label="Avg. Invoice Value" value={`LKR ${totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices).toLocaleString() : '0'}`} icon={TrendingUp} color="purple" />
                            <StatMini label="Inventory Value" value={`LKR ${parseFloat(inventoryValue || 0).toLocaleString()}`} icon={Box} color="amber" />
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary-blue rounded-full"></div>
                                Revenue — {filters.start_date} to {filters.end_date}
                            </h3>

                            {revenueData && revenueData.length > 0 ? (
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1062FF" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#1062FF" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                                tickFormatter={(val) => `${val}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgb(0 0 0 / 0.08)', padding: '12px', background: '#fff' }}
                                                formatter={(val) => [`LKR ${parseFloat(val).toLocaleString()}`, 'Revenue']}
                                                labelFormatter={(label) => format(parseISO(label), 'EEEE, MMMM dd')}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="total"
                                                stroke="#1062FF"
                                                strokeWidth={2.5}
                                                fillOpacity={1}
                                                fill="url(#colorRev)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <DollarSign size={32} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-400 font-medium text-sm">No revenue data for this period.</p>
                                </div>
                            )}
                        </div>

                        {/* Daily Revenue Table */}
                        {revenueData && revenueData.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                                    <h3 className="text-sm font-bold text-slate-900">Daily Revenue Breakdown</h3>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-3.5">Date</th>
                                            <th className="px-5 py-3.5 text-right">Revenue</th>
                                            <th className="px-5 py-3.5 text-right">% of Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {revenueData.map((day) => (
                                            <tr key={day.date} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{format(parseISO(day.date), 'EEE, MMM dd yyyy')}</td>
                                                <td className="px-5 py-3.5 text-right text-sm font-bold text-slate-900">LKR {parseFloat(day.total).toLocaleString()}</td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className="text-xs font-semibold text-primary-blue bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                                        {totalRevenue > 0 ? ((parseFloat(day.total) / totalRevenue) * 100).toFixed(1) : 0}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* DIAGNOSIS TAB */}
                {activeTab === 'diagnosis' && (
                    <motion.div key="diagnosis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <StatMini label="Total Cases" value={totalCases || 0} icon={FileText} color="blue" />
                            <StatMini label="Diagnosed Cases" value={totalDiagnosesInPeriod || 0} icon={Stethoscope} color="emerald" />
                            <StatMini label="Unique Conditions" value={(topDiagnoses || []).length} icon={Activity} color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Top Diagnoses Chart */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
                                    Top Diagnoses — {filters.start_date} to {filters.end_date}
                                </h3>

                                {diagnosisChartData.length > 0 ? (
                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={diagnosisChartData} layout="vertical" barSize={16}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    type="number"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                                    width={110}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '10px 14px', fontWeight: 600 }}
                                                    formatter={(val, _, props) => [`${val} cases`, props.payload.fullName]}
                                                />
                                                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                                    {diagnosisChartData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <Stethoscope size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-slate-400 font-medium text-sm">No diagnosis data for this period.</p>
                                    </div>
                                )}
                            </div>

                            {/* Full Diagnosis List */}
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                                    <h3 className="text-sm font-bold text-slate-900">All Diagnoses</h3>
                                </div>
                                <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                                    {(topDiagnoses || []).length > 0 ? (
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3">#</th>
                                                    <th className="px-4 py-3">Condition</th>
                                                    <th className="px-4 py-3 text-right">Cases</th>
                                                    <th className="px-4 py-3 text-right">Share</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {(topDiagnoses || []).map((d, i) => (
                                                    <tr key={d.name} className="hover:bg-blue-50/20 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length] }}>
                                                                {i + 1}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{d.name}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">{d.count}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                                                {totalDiagnosesInPeriod > 0 ? ((d.count / totalDiagnosesInPeriod) * 100).toFixed(1) : 0}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <Activity size={32} className="mx-auto text-slate-200 mb-3" />
                                            <p className="text-slate-400 font-medium text-sm">No diagnoses for this period.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Export Area */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800 mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-lg font-bold mb-1">Export Reports</h2>
                        <p className="text-slate-400 text-sm">
                            Download clinical performance data for the current analysis period.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all shadow-lg"
                        >
                            <Printer size={16} /> Print
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all border border-white/10"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
