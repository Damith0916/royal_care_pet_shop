import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Calendar,
    DollarSign,
    PawPrint,
    Activity,
    Clock,
    ChevronRight,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colorMap = {
        green: 'text-success bg-green-50/50 border-green-100 shadow-green-100/20',
        blue: 'text-primary-blue bg-blue-50/50 border-blue-100 shadow-blue-100/20',
        orange: 'text-orange-600 bg-orange-50/50 border-orange-100 shadow-orange-100/20',
        purple: 'text-purple-600 bg-purple-50/50 border-purple-100 shadow-purple-100/20',
        red: 'text-danger bg-red-50/50 border-red-100 shadow-red-100/20'
    };
    return (
        <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-none">{title}</span>
                <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center border-2 border-white shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={22} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 text-success font-bold text-[10px] uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md border border-green-100">
                        <ArrowUpRight size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between group/link cursor-pointer">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest transition-colors group-hover/link:text-primary-blue">Audit Detailed Analysis</span>
                <ChevronRight size={14} className="text-slate-300 group-hover/link:translate-x-1 group-hover/link:text-primary-blue transition-all" />
            </div>
        </div>
    );
};

export default function Dashboard({ stats, overview, revenueChart, recentActivities, upcomingSchedule }) {
    const handlePeriodChange = (period) => {
        router.get(route('dashboard'), { period }, { preserveState: true, preserveScroll: true, only: ['overview', 'revenueChart'] });
    };

    return (
        <AppLayout>
            <Head title="Operations Intelligence Dashboard" />

            {/* Global Aesthetic Overlay Elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-1 bg-primary-blue rounded-full"></span>
                            <span className="text-[10px] font-bold text-primary-blue uppercase tracking-[0.3em]">System Operational Status: Optimal</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase tracking-wide">Intelligence Command</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Real-time synthetic overview of clinical performance vectors.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-white p-1.5 rounded-xl border border-border-gray flex shadow-sm">
                            <button
                                onClick={() => handlePeriodChange('weekly')}
                                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${overview.period === 'weekly' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Weekly Sequence
                            </button>
                            <button
                                onClick={() => handlePeriodChange('monthly')}
                                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${overview.period === 'monthly' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Monthly Sequence
                            </button>
                        </div>

                        <Link
                            href={route('appointments.index', { new: true })}
                            className="flex items-center gap-3 px-8 py-3.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_12px_24px_rgba(16,98,255,0.3)] transition-all hover:-translate-y-1 active:scale-95"
                        >
                            <Plus size={18} />
                            Initialize Booking
                        </Link>
                    </div>
                </div>

                {/* Tactical Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard
                        title="Revenue Cycle (Today)"
                        value={`LKR ${parseFloat(overview.revenue).toLocaleString()}`}
                        icon={DollarSign}
                        color="green"
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Active Sessions"
                        value={overview.appointments}
                        icon={Calendar}
                        color="blue"
                        trend="+4.2%"
                    />
                    <StatCard
                        title="New Patient Intake"
                        value={overview.new_pets}
                        icon={PawPrint}
                        color="orange"
                    />
                    <StatCard
                        title="Guardian Network"
                        value={stats.totalOwners}
                        icon={Users}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Diagnostic Chart Area */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-2xl border border-border-gray shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Financial Trajectory</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Historical revenue synchronization</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary-blue shadow-[0_0_8px_rgba(16,98,255,0.4)]"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Revenue Path</span>
                            </div>
                        </div>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChart}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1062FF" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#1062FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                        tickFormatter={(val) => `${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 'bold', color: '#1062FF' }}
                                        labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        formatter={(val) => [`LKR ${parseFloat(val).toLocaleString()}`, 'Processed Revenue']}
                                        labelFormatter={(label) => format(parseISO(label), 'EEEE, MMMM dd')}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#1062FF"
                                        strokeWidth={5}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Temporal Schedule Sidebar */}
                    <div className="bg-white p-10 rounded-2xl border border-border-gray shadow-sm flex flex-col relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Today's Protocol</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Scheduled clinical interactions</p>
                            </div>
                            <Link href={route('appointments.index')} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-primary-blue hover:bg-white rounded-xl transition-all border border-border-gray shadow-sm hover:shadow-lg">
                                <ChevronRight size={20} />
                            </Link>
                        </div>

                        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {upcomingSchedule.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner mb-6">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest px-8 leading-relaxed">System scan reveals zero clinical appointments for the current temporal cycle.</p>
                                </div>
                            ) : (
                                upcomingSchedule.map(app => (
                                    <div key={app.id} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group/item cursor-pointer">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-border-gray shadow-sm flex flex-col items-center justify-center font-bold text-primary-blue group-hover/item:bg-primary-blue group-hover/item:text-white transition-all overflow-hidden relative">
                                            <div className="absolute inset-0 bg-primary-blue/5 group-hover/item:hidden"></div>
                                            <span className="text-[9px] uppercase opacity-40 leading-none mb-1">Time</span>
                                            <span className="text-lg leading-none tracking-tight">{format(parseISO(app.datetime), 'HH:mm')}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 text-base truncate uppercase tracking-tight leading-none mb-1.5">{app.pet.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-blue"></span>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Dr. {app.vet.last_name}</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white text-orange-600 border border-orange-100 shadow-sm">
                                            {app.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* System Audit Intelligence */}
                <div className="bg-white p-10 rounded-2xl border border-border-gray shadow-sm mb-24">
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Intelligence Logs</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Real-time system audit and event synchronization</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-border-gray">
                            <Activity size={24} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentActivities.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-border-gray">
                                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Digital silence. No audit logs detected in current session.</p>
                            </div>
                        ) : (
                            recentActivities.map((activity) => {
                                const IconToRender = activity.icon === 'DollarSign' ? DollarSign : Activity;
                                return (
                                    <div key={activity.id} className="flex gap-5 p-6 bg-slate-50/30 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:border-primary-blue/20 transition-all duration-500 group relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-blue/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-border-gray group-hover:bg-primary-blue group-hover:text-white group-hover:border-transparent group-hover:rotate-6 transition-all shrink-0 shadow-sm relative z-10">
                                            <IconToRender size={22} />
                                        </div>
                                        <div className="min-w-0 relative z-10 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="text-[9px] font-bold text-primary-blue uppercase tracking-[0.2em]">{activity.type}</p>
                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{activity.time}</p>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-base mb-1.5 uppercase tracking-tight leading-tight">{activity.title}</h4>
                                            <p className="text-slate-500 text-[11px] font-medium leading-relaxed italic line-clamp-2">"{activity.description}"</p>
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
