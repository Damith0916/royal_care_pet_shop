import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    DollarSign,
    PawPrint,
    Activity,
    Clock,
    ChevronRight,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Search,
    ShieldOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colorMap = {
        green: 'text-success bg-green-50 border-green-100',
        blue: 'text-primary-blue bg-blue-50 border-blue-100',
        orange: 'text-orange-600 bg-orange-50 border-orange-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100',
        red: 'text-danger bg-red-50 border-red-100'
    };
    return (
        <div className="bg-white p-5 rounded-xl border border-border-gray shadow-sm group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-semibold">{title}</span>
                <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center border transition-all group-hover:scale-105`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 text-success font-semibold text-xs bg-green-50 px-2 py-1 rounded-md border border-green-100">
                        <ArrowUpRight size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between group/link cursor-pointer">
                <span className="text-xs font-medium text-slate-400 transition-colors group-hover/link:text-primary-blue">View details</span>
                <ChevronRight size={14} className="text-slate-300 group-hover/link:translate-x-1 group-hover/link:text-primary-blue transition-all" />
            </div>
        </div>
    );
};

export default function Dashboard({ stats, overview, revenueChart, recentActivities }) {
    const handlePeriodChange = (period) => {
        router.get(route('dashboard'), { period }, { preserveState: true, preserveScroll: true, only: ['overview', 'revenueChart'] });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Clinic Intelligence Unit • {overview.period} overview</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Link
                            href={route('branch-close.index')}
                            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 transition-all active:scale-95 shadow-sm"
                        >
                            Branch Close
                        </Link>

                        <div className="w-px h-8 bg-slate-100 mx-1"></div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePeriodChange('weekly')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${overview.period === 'weekly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => handlePeriodChange('monthly')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${overview.period === 'monthly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Revenue Today"
                        value={`LKR ${parseFloat(overview.revenue).toLocaleString()}`}
                        icon={DollarSign}
                        color="green"
                        trend="+12.5%"
                    />
                    <StatCard
                        title="New Patients"
                        value={overview.new_pets}
                        icon={PawPrint}
                        color="orange"
                    />
                    <StatCard
                        title="Total Owners"
                        value={stats.totalOwners}
                        icon={Users}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                    {/* Revenue Chart */}
                    <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Revenue Overview</h3>
                                <p className="text-slate-400 text-xs font-medium mt-0.5">Daily revenue for the selected period</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-blue shadow-[0_0_6px_rgba(16,98,255,0.4)]"></div>
                                <span className="text-xs font-medium text-slate-400">Revenue</span>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChart}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                        tickFormatter={(val) => `${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgb(0 0 0 / 0.08)', padding: '12px', background: '#fff' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: '600', color: '#1062FF' }}
                                        labelStyle={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}
                                        formatter={(val) => [`LKR ${parseFloat(val).toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => format(parseISO(label), 'EEEE, MMMM dd')}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#1062FF"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm mb-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">Latest system events and case logs</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-border-gray">
                            <Activity size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentActivities.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-border-gray">
                                <Search size={28} className="mx-auto text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium text-sm">No recent activity found.</p>
                            </div>
                        ) : (
                            recentActivities.map((activity) => {
                                const IconToRender = activity.icon === 'DollarSign' ? DollarSign : Activity;
                                return (
                                    <div key={activity.id} className="flex gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-primary-blue/15 transition-all duration-300 group">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-border-gray group-hover:bg-primary-blue group-hover:text-white group-hover:border-transparent transition-all shrink-0">
                                            <IconToRender size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-[10px] font-semibold text-primary-blue uppercase tracking-wide">{activity.type}</p>
                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                <p className="text-[10px] font-medium text-slate-400">{activity.time}</p>
                                            </div>
                                            <h4 className="font-semibold text-slate-800 text-sm mb-0.5 leading-tight">{activity.title}</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{activity.description}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
