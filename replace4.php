<?php
// This script replaces the unified interactive flow panel in Index.jsx
// with a fully featured version including:
// 1. List items with edit/delete, items prepended to top
// 2. DD/Diagnosis with arrow-key navigation on suggestions
// 3. Injection section with existing shown + add more
// 4. Inventory tabs: Injections | Prescription (separate from Products/Categories)
// 5. Prescription: name only, qty/freq/duration prompt, draft feed display
// 6. After all prescriptions, Enter => prescription print modal
// 7. Service charge entry => thermal bill print
// 8. Draft feed items with hover edit/delete icons

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

// -----------------------------------------------------------------------
// 1. Replace `steps` array to add 'injection' and 'prescription' steps
// -----------------------------------------------------------------------
$oldSteps = <<<'EOD'
    const steps = [
        { id: 'weight', label: 'Weight', icon: Weight },
        { id: 'complane', label: 'Complaint', icon: AlertCircle },
        { id: 'history', label: 'Patient History', icon: History },
        { id: 'signs', label: 'Clinical Signs', icon: Activity },
        { id: 'lab', label: 'LAB Findings', icon: FileText },
        { id: 'dd', label: 'Differential Diagnosis', icon: Dna },
        { id: 'diagnosis', label: 'Diagnosis', icon: ClipboardList },
        { id: 'treatment', label: 'Treatment Plan', icon: ShoppingCart },
    ];
EOD;

$newSteps = <<<'EOD'
    const steps = [
        { id: 'weight',       label: 'Weight',                icon: Weight },
        { id: 'complane',     label: 'Complaints',            icon: AlertCircle },
        { id: 'history',      label: 'Patient History',       icon: History },
        { id: 'signs',        label: 'Clinical Signs',        icon: Activity },
        { id: 'lab',          label: 'Lab Findings',          icon: FileText },
        { id: 'dd',           label: 'Differential Diagnosis',icon: Dna },
        { id: 'diagnosis',    label: 'Final Diagnosis',       icon: ClipboardList },
        { id: 'injection',    label: 'Injections / Clinical', icon: Syringe },
        { id: 'prescription', label: 'Prescription',          icon: Pill },
        { id: 'service',      label: 'Service Charge',        icon: DollarSign },
    ];
EOD;

$content = str_replace($oldSteps, $newSteps, $content);

// -----------------------------------------------------------------------
// 2. Add extra state variables after existing pendingQty state
// -----------------------------------------------------------------------
$oldState = '    const [pendingItem, setPendingItem] = useState(null);
    const [pendingQty, setPendingQty] = useState(\'1\');';

$newState = '    const [pendingItem, setPendingItem] = useState(null);
    const [pendingQty, setPendingQty] = useState(\'1\');
    const [ddHighlight, setDdHighlight] = useState(-1);
    const [diagHighlight, setDiagHighlight] = useState(0);
    const [injSearch, setInjSearch] = useState(\'\');
    const [injHighlight, setInjHighlight] = useState(-1);
    const [rxSearch, setRxSearch] = useState(\'\');
    const [rxHighlight, setRxHighlight] = useState(-1);
    const [rxHighlightSave, setRxHighlightSave] = useState(false);
    const [rxPendingItem, setRxPendingItem] = useState(null);
    const [rxQty, setRxQty] = useState(\'\');
    const [rxFreq, setRxFreq] = useState(\'\');
    const [rxDuration, setRxDuration] = useState(\'\');
    const [rxStage, setRxStage] = useState(\'name\'); // name|qty|freq|duration
    const [serviceChargeInput, setServiceChargeInput] = useState(\'1000\');
    const [editingListItem, setEditingListItem] = useState(null); // {key, index, value}
    const [editingListValue, setEditingListValue] = useState(\'\');';

$content = str_replace($oldState, $newState, $content);

// -----------------------------------------------------------------------
// 3. Replace the entire unified interactive flow panel
// -----------------------------------------------------------------------
$newPanel = <<<'PANEL'
                        {/* UNIFIED INTERACTIVE FLOW */}
                        <div className="w-[340px] lg:w-[390px] shrink-0 flex flex-col h-[calc(100vh-80px)] bg-slate-50 border-l border-slate-200 shadow-xl relative z-40 overflow-hidden">
                            
                            {/* Top Bar */}
                            <div className="p-3 border-b border-slate-200 shrink-0 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center border border-blue-100">
                                        {steps[step].icon && React.createElement(steps[step].icon, { size: 12 })}
                                    </div>
                                    <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">{steps[step].label}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col text-right px-2 border-r border-slate-200">
                                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Bill</span>
                                        <span className="text-[13px] font-black text-emerald-600 tabular-nums leading-tight">
                                            LKR {(data.items.reduce((acc, cr) => acc + (cr.price * cr.quantity), 0) + Number(data.service_charge || 0)).toLocaleString()}
                                        </span>
                                    </div>
                                    <button onClick={handleSubmit} disabled={processing}
                                        className="py-1.5 px-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-1 active:scale-95">
                                        <ClipboardCheck size={12} className="stroke-[3]" /> Invoice
                                    </button>
                                </div>
                            </div>

                            {/* Step progress dots */}
                            <div className="flex gap-0.5 px-3 pt-2 pb-0 shrink-0">
                                {steps.map((s, idx) => (
                                    <div key={idx} onClick={() => setStep(idx)} className={`h-1 flex-1 rounded-full transition-all cursor-pointer ${idx === step ? 'bg-blue-500' : idx < step ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
                                ))}
                            </div>

                            {/* Draft Feed */}
                            <div className="flex-1 overflow-y-auto p-3 pt-2 flex flex-col gap-2 custom-scrollbar">

                                {/* Weight */}
                                {data.weight_kg && (
                                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm group relative">
                                        <Weight size={12} className="text-slate-400 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[8px] font-black text-slate-400 uppercase block">Weight</span>
                                            <p className="text-[13px] font-black text-slate-800 leading-none">{data.weight_kg} KG</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
                                            <button onClick={() => { setStep(0); }} className="w-5 h-5 bg-blue-50 text-blue-500 rounded flex items-center justify-center hover:bg-blue-500 hover:text-white" title="Edit"><Edit2 size={9} /></button>
                                        </div>
                                    </div>
                                )}

                                {/* List sections: complane, history, signs, lab, dd, diagnosis */}
                                {[
                                    { key: 'complane',               label: 'Complaints',             color: 'blue',   step: 1, icon: AlertCircle },
                                    { key: 'patient_history',        label: 'History',                color: 'slate',  step: 2, icon: History },
                                    { key: 'clinical_signs',         label: 'Clinical Signs',         color: 'indigo', step: 3, icon: Activity },
                                    { key: 'lab_findings',           label: 'Lab Findings',           color: 'amber',  step: 4, icon: FileText },
                                    { key: 'differential_diagnosis', label: 'Differential Diagnosis', color: 'violet', step: 5, icon: Dna },
                                    { key: 'final_diagnoses',        label: 'Final Diagnosis',        color: 'emerald',step: 6, icon: Stethoscope },
                                ].map(section => data[section.key].length > 0 && (
                                    <div key={section.key} className={`p-2 bg-${section.color}-50/50 rounded-lg border border-${section.color}-100 shadow-sm`}>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            {React.createElement(section.icon, { size: 11, className: `text-${section.color}-500` })}
                                            <span className={`text-[8px] font-black text-${section.color}-500 uppercase tracking-widest`}>{section.label}</span>
                                            <button onClick={() => setStep(section.step)} className="ml-auto w-4 h-4 rounded bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-500 flex items-center justify-center transition-all" title="Edit section"><Edit2 size={8} /></button>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {data[section.key].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1 group/item">
                                                    {editingListItem?.key === section.key && editingListItem?.index === idx ? (
                                                        <input
                                                            autoFocus
                                                            value={editingListValue}
                                                            onChange={e => setEditingListValue(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    const newArr = [...data[section.key]];
                                                                    newArr[idx] = editingListValue.trim() || item;
                                                                    setData(section.key, newArr);
                                                                    setEditingListItem(null);
                                                                }
                                                                if (e.key === 'Escape') setEditingListItem(null);
                                                            }}
                                                            className="flex-1 text-[10px] font-bold bg-white border border-blue-300 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                                                        />
                                                    ) : (
                                                        <span className="flex-1 text-[10px] font-bold text-slate-700 leading-tight">{item}</span>
                                                    )}
                                                    <div className="opacity-0 group-hover/item:opacity-100 flex gap-0.5 transition-opacity shrink-0">
                                                        <button onClick={() => { setEditingListItem({key: section.key, index: idx}); setEditingListValue(item); }}
                                                            className="w-4 h-4 bg-blue-50 text-blue-500 rounded flex items-center justify-center hover:bg-blue-500 hover:text-white"><Edit2 size={8} /></button>
                                                        <button onClick={() => removeListItem(section.key, idx)}
                                                            className="w-4 h-4 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-500 hover:text-white"><X size={8} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Injections */}
                                {data.items.filter(i => i.type === 'injection').length > 0 && (
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 border-t-2 border-t-blue-400 shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Syringe size={11} className="text-blue-500" />
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Injections</span>
                                        </div>
                                        {data.items.filter(i => i.type === 'injection').map((item, idx) => {
                                            const realIdx = data.items.indexOf(item);
                                            return (
                                                <div key={idx} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-100 mb-1 group/item">
                                                    <span className="text-[10px] font-bold text-slate-700 flex-1 mr-2 line-clamp-1">{item.name}</span>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">x{item.quantity}</span>
                                                        <div className="opacity-0 group-hover/item:opacity-100 flex gap-0.5 transition-opacity">
                                                            <button onClick={() => setData('items', data.items.filter((_, i) => i !== realIdx))}
                                                            className="w-4 h-4 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-500 hover:text-white"><X size={8} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Prescriptions */}
                                {data.prescribed_drugs.length > 0 && (
                                    <div className="p-2 bg-violet-50/50 rounded-lg border border-violet-100 border-t-2 border-t-violet-500 shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Pill size={11} className="text-violet-500" />
                                            <span className="text-[8px] font-black text-violet-500 uppercase tracking-widest">Prescriptions</span>
                                        </div>
                                        {data.prescribed_drugs.map((drug, idx) => (
                                            <div key={idx} className="flex items-start justify-between bg-white px-2 py-1 rounded border border-violet-100 mb-1 group/item">
                                                <div className="flex-1 mr-2">
                                                    <span className="text-[10px] font-bold text-slate-800 block line-clamp-1">{drug.name}</span>
                                                    <span className="text-[8px] text-slate-400 font-medium">{drug.quantity} · {drug.frequency} · {drug.duration}</span>
                                                </div>
                                                <div className="opacity-0 group-hover/item:opacity-100 flex gap-0.5 transition-opacity shrink-0 mt-0.5">
                                                    <button onClick={() => setData('prescribed_drugs', data.prescribed_drugs.filter((_, i) => i !== idx))}
                                                        className="w-4 h-4 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-500 hover:text-white"><X size={8} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Empty state */}
                                {step === 0 && !data.weight_kg && (
                                    <div className="text-center py-10 opacity-30 mt-auto">
                                        <Terminal size={28} className="mx-auto mb-2 text-slate-400" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System ready</p>
                                    </div>
                                )}

                                <div id="feed-bottom-anchor"></div>
                            </div>

                            {/* Search suggestion overlays + Input base */}
                            <div className="shrink-0 relative border-t border-slate-200 bg-white/95 backdrop-blur-xl">

                                {/* DD/Diagnosis Suggestions Overlay */}
                                <AnimatePresence>
                                    {(step === 5 || step === 6) && diagSearch.trim().length > 0 && Array.isArray(diagnoses) && (() => {
                                        const filtered = diagnoses.filter(d =>
                                            d.name.toLowerCase().includes(diagSearch.toLowerCase()) &&
                                            !(step === 5 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)
                                        ).slice(0, 8);
                                        return (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute bottom-full left-0 w-full bg-white border border-slate-200 rounded-t-xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-[70]">
                                                {filtered.map((diag, i) => (
                                                    <div key={diag.id}
                                                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer transition-all text-[11px] font-bold ${i === ddHighlight ? 'bg-blue-500 text-white' : 'hover:bg-slate-50 text-slate-800'}`}
                                                        onClick={() => {
                                                            const key = step === 5 ? 'differential_diagnosis' : 'final_diagnoses';
                                                            setData(key, [diag.name, ...data[key]]);
                                                            setDiagSearch(''); setDdHighlight(-1);
                                                            document.getElementById('unified-input')?.focus();
                                                        }}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${i === ddHighlight ? 'bg-white' : 'bg-blue-400'}`}></div>
                                                        {diag.name}
                                                    </div>
                                                ))}
                                                {filtered.length === 0 && (
                                                    <div className="px-3 py-2 text-[11px] font-bold text-amber-600 bg-amber-50 flex items-center gap-2 cursor-pointer"
                                                        onClick={async () => {
                                                            const nd = await handleRegisterDiagnosis(diagSearch);
                                                            if (nd) {
                                                                const key = step === 5 ? 'differential_diagnosis' : 'final_diagnoses';
                                                                setData(key, [nd.name, ...data[key]]);
                                                                setDiagSearch(''); 
                                                                document.getElementById('unified-input')?.focus();
                                                            }
                                                        }}>
                                                        <Plus size={12} className="stroke-[3]" /> Register "{diagSearch}"
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>

                                {/* Injection Suggestions Overlay */}
                                <AnimatePresence>
                                    {step === 7 && injSearch.trim().length > 0 && Array.isArray(products) && !pendingItem && (() => {
                                        const filtered = products.filter(p => p.name.toLowerCase().includes(injSearch.toLowerCase())).slice(0, 8);
                                        return (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute bottom-full left-0 w-full bg-white border border-slate-200 rounded-t-xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-[70]">
                                                {filtered.map((p, i) => (
                                                    <div key={p.id}
                                                        className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-all text-[11px] ${i === injHighlight ? 'bg-blue-500 text-white' : 'hover:bg-slate-50 text-slate-800'}`}
                                                        onClick={() => {
                                                            setPendingItem(p); setPendingQty('1');
                                                            setInjSearch('');
                                                            setTimeout(() => document.getElementById('qty-input')?.focus(), 50);
                                                        }}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${i === injHighlight ? 'bg-white' : 'bg-blue-400'}`}></div>
                                                            <div>
                                                                <div className="font-bold">{p.name}</div>
                                                                <div className={`text-[9px] ${i === injHighlight ? 'text-blue-100' : 'text-slate-400'}`}>LKR {p.unit_price}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>

                                {/* Prescription Suggestions Overlay */}
                                <AnimatePresence>
                                    {step === 8 && rxStage === 'name' && rxSearch.trim().length > 0 && Array.isArray(products) && !rxPendingItem && (() => {
                                        const filtered = products.filter(p => p.name.toLowerCase().includes(rxSearch.toLowerCase())).slice(0, 8);
                                        return (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute bottom-full left-0 w-full bg-white border border-slate-200 rounded-t-xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-[70]">
                                                {filtered.map((p, i) => (
                                                    <div key={p.id}
                                                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer transition-all text-[11px] ${i === rxHighlight ? 'bg-violet-500 text-white' : 'hover:bg-slate-50 text-slate-800'}`}
                                                        onClick={() => {
                                                            setRxPendingItem(p); setRxSearch(''); setRxStage('qty');
                                                            setTimeout(() => document.getElementById('rx-qty-input')?.focus(), 50);
                                                        }}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${i === rxHighlight ? 'bg-white' : 'bg-violet-400'}`}></div>
                                                        <div className="font-bold">{p.name}</div>
                                                    </div>
                                                ))}
                                                {filtered.length === 0 && (
                                                    <div className="px-3 py-2 text-[11px] font-bold text-violet-600 bg-violet-50 flex items-center gap-2 cursor-pointer"
                                                        onClick={() => {
                                                            setRxPendingItem({ name: rxSearch, id: null });
                                                            setRxSearch(''); setRxStage('qty');
                                                            setTimeout(() => document.getElementById('rx-qty-input')?.focus(), 50);
                                                        }}>
                                                        <Plus size={12} className="stroke-[3]" /> Add "{rxSearch}" as custom drug
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>

                                {/* Pending item qty popup (injection) */}
                                <AnimatePresence>
                                    {step === 7 && pendingItem && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="absolute bottom-full left-0 w-full bg-white border border-blue-200 border-b-0 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] p-3 z-[70]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Syringe size={14} className="text-blue-500" />
                                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest line-clamp-1">{pendingItem.name}</span>
                                                </div>
                                                <button onClick={() => { setPendingItem(null); document.getElementById('unified-input')?.focus(); }}
                                                    className="w-5 h-5 bg-slate-100 rounded text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X size={10} /></button>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-[9px] font-black text-slate-400 uppercase shrink-0">Qty:</span>
                                                <input id="qty-input" type="number" step="0.1" value={pendingQty} onChange={e => setPendingQty(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const newItems = [
                                                                ...data.items,
                                                                { product_id: pendingItem.id, name: pendingItem.name, quantity: parseFloat(pendingQty) || 1, price: pendingItem.unit_price, type: 'injection' }
                                                            ];
                                                            setData('items', newItems);
                                                            setPendingItem(null); setPendingQty('1'); setInjSearch('');
                                                            document.getElementById('unified-input')?.focus();
                                                        }
                                                        if (e.key === 'Escape') { setPendingItem(null); document.getElementById('unified-input')?.focus(); }
                                                    }}
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-black text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                                                    placeholder="Enter quantity..." />
                                            </div>
                                            <p className="text-[8px] text-slate-400 font-bold mt-1.5 text-center uppercase tracking-widest">Enter to confirm</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Prescription qty/freq/duration steps */}
                                <AnimatePresence>
                                    {step === 8 && rxPendingItem && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="absolute bottom-full left-0 w-full bg-white border border-violet-200 border-b-0 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] p-3 z-[70]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Pill size={14} className="text-violet-500" />
                                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{rxPendingItem.name}</span>
                                                </div>
                                                <button onClick={() => { setRxPendingItem(null); setRxStage('name'); setRxQty(''); setRxFreq(''); setRxDuration(''); document.getElementById('unified-input')?.focus(); }}
                                                    className="w-5 h-5 bg-slate-100 rounded text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X size={10} /></button>
                                            </div>
                                            {rxStage === 'qty' && (
                                                <div>
                                                    <label className="text-[8px] font-black text-violet-500 uppercase tracking-widest block mb-1">Quantity</label>
                                                    <input id="rx-qty-input" type="text" value={rxQty} onChange={e => setRxQty(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && rxQty.trim()) { setRxStage('freq'); setTimeout(() => document.getElementById('rx-freq-input')?.focus(), 50); }
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-black text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                                                        placeholder="e.g. 10 Tabs" />
                                                </div>
                                            )}
                                            {rxStage === 'freq' && (
                                                <div>
                                                    <label className="text-[8px] font-black text-violet-500 uppercase tracking-widest block mb-1">Frequency</label>
                                                    <input id="rx-freq-input" type="text" value={rxFreq} onChange={e => setRxFreq(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && rxFreq.trim()) { setRxStage('duration'); setTimeout(() => document.getElementById('rx-dur-input')?.focus(), 50); }
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-black text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                                                        placeholder="e.g. BID (2x/day)" />
                                                </div>
                                            )}
                                            {rxStage === 'duration' && (
                                                <div>
                                                    <label className="text-[8px] font-black text-violet-500 uppercase tracking-widest block mb-1">Duration</label>
                                                    <input id="rx-dur-input" type="text" value={rxDuration} onChange={e => setRxDuration(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && rxDuration.trim()) {
                                                                setData('prescribed_drugs', [
                                                                    ...data.prescribed_drugs,
                                                                    { name: rxPendingItem.name, quantity: rxQty, frequency: rxFreq, duration: rxDuration }
                                                                ]);
                                                                setRxPendingItem(null); setRxStage('name');
                                                                setRxQty(''); setRxFreq(''); setRxDuration('');
                                                                document.getElementById('unified-input')?.focus();
                                                            }
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-black text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                                                        placeholder="e.g. 5 Days" />
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Master Input */}
                                <div className="p-3">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                                            <ChevronRight size={16} className="stroke-[3]" />
                                        </div>
                                        <input
                                            autoFocus
                                            id="unified-input"
                                            type={step === 0 ? 'number' : 'text'}
                                            value={
                                                step === 0 ? data.weight_kg
                                                : (step === 5 || step === 6) ? diagSearch
                                                : step === 7 ? injSearch
                                                : step === 8 ? rxSearch
                                                : step === 9 ? serviceChargeInput
                                                : remarkInput
                                            }
                                            onChange={e => {
                                                if (step === 0) setData('weight_kg', e.target.value);
                                                else if (step === 5 || step === 6) { setDiagSearch(e.target.value); setDdHighlight(-1); }
                                                else if (step === 7) { setInjSearch(e.target.value); setInjHighlight(-1); }
                                                else if (step === 8) { setRxSearch(e.target.value); setRxHighlight(-1); }
                                                else if (step === 9) setServiceChargeInput(e.target.value);
                                                else setRemarkInput(e.target.value);
                                            }}
                                            placeholder={
                                                step === 0 ? 'Weight (KG)...'
                                                : step === 1 ? 'Type complaint, Enter to add...'
                                                : step === 2 ? 'Type history, Enter to add...'
                                                : step === 3 ? 'Type clinical sign, Enter to add...'
                                                : step === 4 ? 'Type lab finding, Enter to add...'
                                                : step === 5 ? 'Search / type differential diagnosis...'
                                                : step === 6 ? 'Search / type final diagnosis...'
                                                : step === 7 ? 'Search injection or clinical item...'
                                                : step === 8 ? 'Search prescription drug name...'
                                                : step === 9 ? 'Enter service charge (LKR)...'
                                                : 'Enter...'
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-[13px] font-black text-slate-800 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                                            onKeyDown={e => {
                                                const val = e.target.value.trim();

                                                // Arrow key navigation for DD/Diagnosis suggestions
                                                if ((step === 5 || step === 6) && diagSearch) {
                                                    const filtered = diagnoses.filter(d =>
                                                        d.name.toLowerCase().includes(diagSearch.toLowerCase()) &&
                                                        !(step === 5 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)
                                                    ).slice(0, 8);
                                                    if (e.key === 'ArrowDown') { e.preventDefault(); setDdHighlight(h => Math.min(h + 1, filtered.length - 1)); return; }
                                                    if (e.key === 'ArrowUp') { e.preventDefault(); setDdHighlight(h => Math.max(h - 1, -1)); return; }
                                                    if (e.key === 'Enter' && ddHighlight >= 0 && filtered[ddHighlight]) {
                                                        e.preventDefault();
                                                        const key = step === 5 ? 'differential_diagnosis' : 'final_diagnoses';
                                                        setData(key, [filtered[ddHighlight].name, ...data[key]]);
                                                        setDiagSearch(''); setDdHighlight(-1);
                                                        return;
                                                    }
                                                }

                                                // Arrow key navigation for Injection suggestions
                                                if (step === 7 && injSearch && !pendingItem) {
                                                    const filtered = products.filter(p => p.name.toLowerCase().includes(injSearch.toLowerCase())).slice(0, 8);
                                                    if (e.key === 'ArrowDown') { e.preventDefault(); setInjHighlight(h => Math.min(h + 1, filtered.length - 1)); return; }
                                                    if (e.key === 'ArrowUp') { e.preventDefault(); setInjHighlight(h => Math.max(h - 1, -1)); return; }
                                                    if (e.key === 'Enter' && injHighlight >= 0 && filtered[injHighlight]) {
                                                        e.preventDefault();
                                                        setPendingItem(filtered[injHighlight]); setPendingQty('1');
                                                        setInjSearch(''); setInjHighlight(-1);
                                                        setTimeout(() => document.getElementById('qty-input')?.focus(), 50);
                                                        return;
                                                    }
                                                }

                                                // Arrow key navigation for Prescription suggestions
                                                if (step === 8 && rxSearch && !rxPendingItem) {
                                                    const filtered = products.filter(p => p.name.toLowerCase().includes(rxSearch.toLowerCase())).slice(0, 8);
                                                    if (e.key === 'ArrowDown') { e.preventDefault(); setRxHighlight(h => Math.min(h + 1, filtered.length - 1)); return; }
                                                    if (e.key === 'ArrowUp') { e.preventDefault(); setRxHighlight(h => Math.max(h - 1, -1)); return; }
                                                    if (e.key === 'Enter' && rxHighlight >= 0 && filtered[rxHighlight]) {
                                                        e.preventDefault();
                                                        setRxPendingItem(filtered[rxHighlight]); setRxSearch(''); setRxStage('qty'); setRxHighlight(-1);
                                                        setTimeout(() => document.getElementById('rx-qty-input')?.focus(), 50);
                                                        return;
                                                    }
                                                }

                                                if (e.key !== 'Enter' && e.key !== 'Backspace') return;

                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const scrollBottom = () => setTimeout(() => document.getElementById('feed-bottom-anchor')?.scrollIntoView({ behavior: 'smooth' }), 50);

                                                    if (step === 0) { if (val) { setStep(1); setRemarkInput(''); } }
                                                    else if (step === 1) { if (val) { setData('complane', [val, ...data.complane]); setRemarkInput(''); scrollBottom(); } else setStep(2); }
                                                    else if (step === 2) { if (val) { setData('patient_history', [val, ...data.patient_history]); setRemarkInput(''); scrollBottom(); } else setStep(3); }
                                                    else if (step === 3) { if (val) { setData('clinical_signs', [val, ...data.clinical_signs]); setRemarkInput(''); scrollBottom(); } else setStep(4); }
                                                    else if (step === 4) { if (val) { setData('lab_findings', [val, ...data.lab_findings]); setRemarkInput(''); scrollBottom(); } else setStep(5); }
                                                    else if (step === 5) {
                                                        if (!val) { setStep(6); setDiagSearch(''); }
                                                        else if (!diagSearch) { setData('differential_diagnosis', [val, ...data.differential_diagnosis]); setRemarkInput(''); scrollBottom(); }
                                                    }
                                                    else if (step === 6) {
                                                        if (!val) { setStep(7); setDiagSearch(''); }
                                                        else if (!diagSearch) { setData('final_diagnoses', [val, ...data.final_diagnoses]); setRemarkInput(''); scrollBottom(); }
                                                    }
                                                    else if (step === 7) {
                                                        if (!val && !pendingItem) { setStep(8); setInjSearch(''); }
                                                    }
                                                    else if (step === 8) {
                                                        if (!val && !rxPendingItem && !rxSearch) {
                                                            // Print prescription if any, then move to service charge
                                                            setStep(9);
                                                        }
                                                    }
                                                    else if (step === 9) {
                                                        // Set service charge and submit/print
                                                        if (val) {
                                                            setData('service_charge', parseFloat(val) || 1000);
                                                        }
                                                        handleSubmit();
                                                    }
                                                }

                                                if (e.key === 'Backspace' && !e.target.value) {
                                                    if (step > 0) {
                                                        setStep(step - 1);
                                                        setRemarkInput(''); setDiagSearch('');
                                                        setInjSearch(''); setRxSearch('');
                                                        setDdHighlight(-1); setInjHighlight(-1); setRxHighlight(-1);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex gap-3">
                                            <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 text-[7px]">↑↓</span> Navigate</span>
                                            <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 text-[7px]">ENTER</span> Add/Next</span>
                                        </div>
                                        <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 text-[7px]">⌫</span> Back</span>
                                    </div>
                                </div>
                            </div>
                        </div>
PANEL;

preg_match('/\{\/\* UNIFIED INTERACTIVE FLOW \*\/\}(.*?)(?=\{\/\* Footer Navigation Sticky \*\/\})/s', $content, $matches);

if (count($matches) > 0) {
    $content = str_replace($matches[0], $newPanel . "\n                    </div>\n                </div>\n", $content);
    file_put_contents($file, $content);
    echo "Successfully replaced the panel.\n";
} else {
    echo "Panel target block not found!\n";
}
