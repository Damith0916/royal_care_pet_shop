import React from 'react';
import AppLayout from '../../Layouts/AppLayout'; // Corrected path
import { Head } from '@inertiajs/react';
import {
    Users,
    PawPrint,
    CalendarCheck,
    AlertCircle,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3.5 rounded-2xl bg-${color}-50 text-${color}-600 ring-1 ring-${color}-100`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold leading-none">
                    <TrendingUp size={12} />
                    {trend}
                </div>
            )}
        </div>
        <p className="text-[15px] font-semibold text-gray-500 mb-1">{label}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
    </div>
);

export default function Dashboard({ stats, recentActivities, upcomingSchedule }) {
    if (!stats) stats = {};
    if (!recentActivities) recentActivities = [];
    if (!upcomingSchedule) upcomingSchedule = [];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Clinic Overview</h1>
                    <p className="text-gray-500 font-medium">Monitoring pet health and clinic operations in real-time</p>
                </div>
                <div className="flex items-center gap-3 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">Daily</button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Weekly</button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Monthly</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label="Total Active Pets"
                    value={stats.totalPets || '0'}
                    icon={PawPrint}
                    color="blue"
                    trend={stats.totalPets > 0 ? "+1%" : null}
                />
                <StatCard
                    label="Registered Owners"
                    value={stats.totalOwners || '0'}
                    icon={Users}
                    color="purple"
                    trend={stats.totalOwners > 0 ? "+1%" : null}
                />
                <StatCard
                    label="Today's Appointments"
                    value={stats.upcomingAppointments || '0'}
                    icon={CalendarCheck}
                    color="orange"
                />
                <StatCard
                    label="Low Stock Alerts"
                    value={stats.lowStockAlerts || '0'}
                    icon={AlertCircle}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-900">Recent Activities</h3>
                        <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</a>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivities.length > 0 ? recentActivities.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                                            <Clock size={10} /> {activity.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{activity.description}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-gray-400 font-medium italic">
                                No recent activities found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Schedule Mini List */}
                <div className="bg-[#1E1E2D] rounded-3xl p-6 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <CalendarCheck size={160} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="font-bold text-xl mb-6">Upcoming Schedule</h3>
                        <div className="space-y-6 flex-1">
                            {upcomingSchedule.length > 0 ? upcomingSchedule.map((appt) => (
                                <div key={appt.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex flex-col items-center justify-center shrink-0 text-center">
                                        <span className="text-[8px] font-bold uppercase leading-none mb-0.5">
                                            {new Date(appt.datetime).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-sm font-extrabold leading-none">
                                            {new Date(appt.datetime).getDate().toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-0.5">{appt.pet?.name || 'Pet'}</p>
                                        <p className="text-xs text-white/50 font-medium">
                                            {new Date(appt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Dr. {appt.vet?.last_name || 'Staff'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center text-white/30 font-medium italic border border-dashed border-white/10 rounded-2xl">
                                    No upcoming appointments.
                                </div>
                            )}
                        </div>
                        <button className="mt-8 w-full py-3.5 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-xl shadow-black/20">
                            Book New Appointment
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
