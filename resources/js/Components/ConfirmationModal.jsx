import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? 'bg-red-600' : 'bg-primary-blue';
    const lightAccentColor = type === 'danger' ? 'bg-red-50' : 'bg-blue-50';
    const iconColor = type === 'danger' ? 'text-red-600' : 'text-primary-blue';
    const borderAccent = type === 'danger' ? 'border-red-100' : 'border-blue-100';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-8 text-center">
                        <div className={`w-20 h-20 ${lightAccentColor} ${iconColor} rounded-3xl flex items-center justify-center mx-auto mb-6 border ${borderAccent} shadow-sm`}>
                            <AlertTriangle size={36} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3 uppercase">
                            {title}
                        </h2>

                        <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                            {message}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 p-6 bg-slate-50 border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-4 ${accentColor} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:brightness-110 active:scale-95 transition-all`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
