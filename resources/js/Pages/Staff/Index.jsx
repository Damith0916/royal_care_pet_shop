import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    User,
    Mail,
    Phone,
    Shield,
    X as XIcon,
    Trash2,
    Edit3,
    ArrowRight
} from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 relative z-10">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function StaffIndex({ staff, roles }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        phone: '',
        password: 'password',
    });

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
                onSuccess: () => { setIsModalOpen(false); reset(); setEditingMember(null); },
            });
        } else {
            post(route('staff.store'), {
                onSuccess: () => { setIsModalOpen(false); reset(); },
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
            <Head title="Staff Management" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Staff</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage clinic staff members and their roles.</p>
                </div>

                <button
                    onClick={() => { setEditingMember(null); reset(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} />
                    Add Staff Member
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/20">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none text-slate-900 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-border-gray">
                                <th className="px-5 py-3.5">Staff Member</th>
                                <th className="px-5 py-3.5">Contact</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStaff.map(member => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-50 text-primary-blue flex items-center justify-center font-bold text-base border border-slate-200 group-hover:bg-primary-blue group-hover:text-white transition-all">
                                                {member.first_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{member.first_name} {member.last_name}</p>
                                                <span className="px-2 py-0.5 bg-blue-50 text-primary-blue border border-blue-100 rounded-md text-xs font-semibold">{member.role?.name || 'Unassigned'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <Mail size={12} className="text-slate-400" />
                                                {member.email}
                                            </div>
                                            {member.phone && (
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Phone size={12} className="text-slate-300" />
                                                    {member.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-success' : 'bg-red-500'}`}></div>
                                            <span className="text-xs font-semibold text-slate-700">{member.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="p-2 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-lg transition-all shadow-sm"
                                                title="Edit"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete({ open: true, id: member.id, name: `${member.first_name} ${member.last_name}` })}
                                                className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 border border-border-gray rounded-lg transition-all shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStaff.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3 border border-slate-100">
                            <User size={24} />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-1">No staff found</h3>
                        <p className="text-xs text-slate-400">No staff members match your search.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Edit Staff Member" : "Add Staff Member"}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">First Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                            />
                            {errors.first_name && <p className="text-danger text-xs mt-1">{errors.first_name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                            />
                            {errors.last_name && <p className="text-danger text-xs mt-1">{errors.last_name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={data.role_id}
                                onChange={e => setData('role_id', e.target.value)}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role_id && <p className="text-danger text-xs mt-1">{errors.role_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                {editingMember ? 'New Password (optional)' : 'Password'}
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder={editingMember ? "Leave empty to keep current" : ""}
                            />
                            {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border-gray">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {processing ? 'Saving...' : (editingMember ? 'Update Staff Member' : 'Add Staff Member')}
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ ...confirmDelete, open: false })}
                onConfirm={() => router.delete(route('staff.destroy', confirmDelete.id))}
                title="Remove Staff Member"
                message={`Are you sure you want to remove ${confirmDelete.name} from the system? This action cannot be undone and will revoke all system access for this member.`}
                confirmText="Remove Member"
                type="danger"
            />
        </AppLayout>
    );
}
