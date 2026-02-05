import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    User,
    Mail,
    Phone,
    Shield,
    MoreVertical,
    X as XIcon,
    CheckCircle2,
    Trash2,
    Edit3,
    ArrowRight
} from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border-gray">
                <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        red: 'bg-red-50 text-red-700 border-red-100',
        slate: 'bg-slate-50 text-slate-500 border-slate-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${colors[color]}`}>
            {children}
        </span>
    );
};

export default function StaffIndex({ staff, roles }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        phone: '',
        password: 'password',
    });

    const [editingMember, setEditingMember] = useState(null);

    const openEditModal = (member) => {
        setEditingMember(member);
        setData({
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            role_id: member.role_id,
            phone: member.phone || '',
            password: '',
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingMember) {
            post(route('staff.update', editingMember.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingMember(null);
                },
            });
        } else {
            post(route('staff.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const filteredStaff = staff.filter(member =>
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.role?.name && member.role.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout>
            <Head title="Staff Operations Intelligence" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Staff Operations Hub</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage clinical faculty, access levels, and deployment roles.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingMember(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-8 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all active:scale-[0.98] hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Register Faculty Member
                </button>
            </div>

            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden mb-12">
                <div className="p-8 border-b border-border-gray bg-slate-50/20">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by faculty name, record, or role..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-border-gray pl-12 pr-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none transition-all text-slate-800 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6 border-b border-border-gray">Faculty Intelligence</th>
                                <th className="px-8 py-6 border-b border-border-gray">Communication Vectors</th>
                                <th className="px-8 py-6 border-b border-border-gray">Operational Status</th>
                                <th className="px-8 py-6 border-b border-border-gray text-right">Administrative</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStaff.map(member => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center font-bold text-xl border border-border-gray shadow-inner group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                {member.first_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-none mb-2 uppercase tracking-tight text-base">{member.first_name} {member.last_name}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge color="blue">{member.role?.name || 'Unassigned'}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                                                <Mail size={14} className="text-slate-300" />
                                                {member.email}
                                            </div>
                                            {member.phone && (
                                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                                    <Phone size={14} className="text-slate-300" />
                                                    {member.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2.5 h-2.5 rounded-full ${member.is_active ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></div>
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{member.is_active ? 'Active Path' : 'Archived'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="p-3 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all shadow-sm"
                                                title="Edit Record"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to permanently delete this faculty record?')) {
                                                        router.delete(route('staff.destroy', member.id));
                                                    }
                                                }}
                                                className="p-3 text-slate-400 hover:text-danger hover:bg-red-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                                title="Purge Record"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStaff.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-inner border border-slate-100">
                            <User size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Zero Intelligence Results</h3>
                        <p className="text-slate-500 font-medium text-sm">No faculty members detected matching current parameters.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Modify Faculty Identity" : "Initialize Faculty Registration"}>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">Legal First Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                            />
                            {errors.first_name && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.first_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">Legal Last Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                            />
                            {errors.last_name && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.last_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">Intelligence Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">Communication Link (Phone)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">Operational Role</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.role_id}
                                onChange={e => setData('role_id', e.target.value)}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role_id && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.role_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none">
                                {editingMember ? 'Coded Access Token (Optional)' : 'Initialize Password'}
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder={editingMember ? "Null for no change" : ""}
                            />
                            {errors.password && <p className="text-danger text-[10px] font-bold mt-1 uppercase leading-none">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-gray">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_12px_24px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {processing ? 'Synchronizing Intelligence...' : (editingMember ? 'Commit Identity Update' : 'Initialize Faculty Registration')}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
