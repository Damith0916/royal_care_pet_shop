import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Stethoscope, Plus, Search, Edit3, Trash2,
    X, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ show, onClose, title, children }) => (
    <AnimatePresence>
        {show && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        )}
    </AnimatePresence>
);

export default function DiagnosisIndex({ diagnoses }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDiagnosis, setEditingDiagnosis] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const filteredDiagnoses = diagnoses.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const submit = (e) => {
        e.preventDefault();
        if (editingDiagnosis) {
            put(route('diagnoses.update', editingDiagnosis.id), {
                onSuccess: () => { setShowAddModal(false); setEditingDiagnosis(null); reset(); },
            });
        } else {
            post(route('diagnoses.store'), {
                onSuccess: () => { setShowAddModal(false); reset(); },
            });
        }
    };

    const handleEdit = (diagnosis) => {
        setEditingDiagnosis(diagnosis);
        setData({ name: diagnosis.name, description: diagnosis.description || '' });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this diagnosis?')) {
            destroy(route('diagnoses.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Diagnosis Library" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Diagnosis Library</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage clinical conditions and diagnoses used in medical records.</p>
                </div>

                <button
                    onClick={() => { setEditingDiagnosis(null); reset(); setShowAddModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all shadow-lg"
                >
                    <Plus size={16} /> Add Diagnosis
                </button>
            </div>

            <div className="card-standard overflow-hidden bg-white">
                <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search diagnoses..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none text-slate-900 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-3.5">Condition Name</th>
                                <th className="px-5 py-3.5">Description</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDiagnoses.map((diagnosis) => (
                                <tr key={diagnosis.id} className="hover:bg-blue-50/20 transition-all group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center border border-blue-100">
                                                <Activity size={15} />
                                            </div>
                                            <span className="font-semibold text-slate-900 text-sm group-hover:text-primary-blue transition-colors">
                                                {diagnosis.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-slate-500 text-sm leading-relaxed max-w-md line-clamp-2">
                                            {diagnosis.description || 'No description provided.'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(diagnosis)}
                                                className="p-2 bg-white text-slate-400 hover:text-primary-blue hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-lg transition-all shadow-sm"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(diagnosis.id)}
                                                className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 hover:border-red-200 rounded-lg transition-all shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredDiagnoses.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                <Search size={24} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">No diagnoses found.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                show={showAddModal}
                onClose={() => { setShowAddModal(false); setEditingDiagnosis(null); reset(); }}
                title={editingDiagnosis ? 'Edit Diagnosis' : 'Add Diagnosis'}
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Condition Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            placeholder="e.g. Parvovirus Enteritis"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue/20 outline-none transition-all"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows="4"
                            placeholder="Clinical notes or pathological description..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue/20 outline-none transition-all leading-relaxed resize-none"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="pt-3 border-t border-border-gray">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : (editingDiagnosis ? 'Update Diagnosis' : 'Save Diagnosis')}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
