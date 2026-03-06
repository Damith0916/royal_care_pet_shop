<?php

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

// Replace Archive w-[30%]
$content = str_replace(
    '<div className="flex-1 flex flex-col h-[calc(100vh-80px)] min-w-0">',
    '<div className="w-[30%] lg:w-[32%] shrink-0 flex flex-col h-[calc(100vh-80px)] min-w-0">',
    $content
);

$newTacticalCommand = <<<'EOD'
                        {/* MIDDLE: Unified Interactive Input Flow */}
                        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 border-x border-slate-950 shadow-2xl relative z-[60] overflow-hidden">
                            {/* Top Bar */}
                            <div className="p-6 border-b border-white/5 shrink-0 bg-slate-900/50 backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                        {steps[step].icon && React.createElement(steps[step].icon, { size: 16 })}
                                    </div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">{steps[step].label}</h2>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-11">Complete sequence and press enter</p>
                                
                                <div className="flex gap-1.5 mt-5">
                                    {steps.map((s, idx) => (
                                        <div key={idx} className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === step ? 'bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.8)]' : idx < step ? 'bg-white/20' : 'bg-white/5'}`}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Display Interface */}
                            <div className="flex-1 flex flex-col p-8 relative">
                                
                                {/* Dynamic Content Layer (Floating above input) */}
                                <div className="flex-1 overflow-y-auto mb-6 flex flex-col justify-end gap-2 custom-scrollbar pr-2">
                                    <AnimatePresence>
                                    {(step === 4 || step === 5) && diagSearch.trim().length > 0 && Array.isArray(diagnoses) && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                            {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()) && !(step === 4 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)).slice(0, 10).map((diag, i) => (
                                                <div key={diag.id} className="p-4 bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between group"
                                                    onClick={() => {
                                                        const targetList = step === 4 ? 'differential_diagnosis' : 'final_diagnoses';
                                                        setData(targetList, [...data[targetList], diag.name]);
                                                        setDiagSearch('');
                                                        document.getElementById('unified-input')?.focus();
                                                    }}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                                                        {diag.name}
                                                    </div>
                                                    <span className="text-[9px] text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-black">Click to select [Enter]</span>
                                                </div>
                                            ))}
                                            {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()) && !(step === 4 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)).length === 0 && (
                                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-3"
                                                        onClick={async () => {
                                                            const newDiag = await handleRegisterDiagnosis(diagSearch);
                                                            if (newDiag) {
                                                                const targetList = step === 4 ? 'differential_diagnosis' : 'final_diagnoses';
                                                                setData(targetList, [...data[targetList], newDiag.name]);
                                                                setDiagSearch('');
                                                                document.getElementById('unified-input')?.focus();
                                                            }
                                                        }}
                                                >
                                                    <AlertCircle size={14} /> Register new condition: "{diagSearch}"
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {step === 6 && productSearch.trim().length > 0 && Array.isArray(products) && !pendingItem && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                            {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 10).map((p, i) => {
                                                const type = (p.category?.name || p.type || '').toLowerCase();
                                                const isClinical = type.includes('vaccine') || type.includes('injection');
                                                return (
                                                    <div key={p.id} className="p-4 bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between group"
                                                        onClick={() => {
                                                            setPendingItem(p);
                                                            setPendingQty('1');
                                                            setTimeout(() => document.getElementById('qty-input')?.focus(), 50);
                                                        }}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${isClinical ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                                                            <div className="flex flex-col">
                                                                <span>{p.name}</span>
                                                                <span className="text-[10px] text-white/50">{isClinical ? 'Clinical Procedure' : 'Retail Item'} | LKR {p.unit_price}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-black">Set Qty</span>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}

                                    {step === 6 && pendingItem && (
                                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-emerald-600/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-emerald-500/50">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <Syringe size={24} />
                                                    <span className="text-sm font-black uppercase tracking-widest">{pendingItem.name}</span>
                                                </div>
                                                <button onClick={() => {setPendingItem(null); setTimeout(() => document.getElementById('unified-input')?.focus(), 50);}} className="text-white/70 hover:text-white"><X size={20} /></button>
                                            </div>
                                            <div className="flex gap-3">
                                                <input
                                                    id="qty-input"
                                                    type="number"
                                                    step="0.1"
                                                    value={pendingQty}
                                                    onChange={e => setPendingQty(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const copy = [...data.items, { product_id: pendingItem.id, name: pendingItem.name, quantity: parseFloat(pendingQty) || 1, price: pendingItem.unit_price }];
                                                            setData('items', copy);
                                                            setPendingItem(null);
                                                            setPendingQty('1');
                                                            setProductSearch('');
                                                            setTimeout(() => document.getElementById('unified-input')?.focus(), 50);
                                                        }
                                                        if (e.key === 'Escape') {
                                                            setPendingItem(null);
                                                            setTimeout(() => document.getElementById('unified-input')?.focus(), 50);
                                                        }
                                                    }}
                                                    className="w-full bg-black/20 border border-white/20 rounded-xl px-5 py-4 text-white text-lg font-black outline-none focus:bg-black/30 placeholder:text-white/30 text-center"
                                                    placeholder="Enter quantity..."
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Action Instructions */}
                                    {((step === 0 && !data.weight_kg) || (step === 1 && data.complane.length===0)) && (
                                        <div className="text-center py-10 opacity-30">
                                            <Terminal size={48} className="mx-auto mb-4 text-white" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System ready for input</p>
                                        </div>
                                    )}
                                    </AnimatePresence>
                                </div>

                                {/* Master Input Base */}
                                <div className="shrink-0 relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-6 text-blue-400">
                                        <ChevronRight size={24} className="stroke-[3]" />
                                    </div>
                                    <input
                                        autoFocus
                                        id="unified-input"
                                        type="text"
                                        value={
                                            step === 0 ? data.weight_kg 
                                            : (step === 4 || step === 5) ? diagSearch 
                                            : step === 6 ? productSearch 
                                            : remarkInput
                                        }
                                        onChange={e => {
                                            if (step === 0) setData('weight_kg', e.target.value);
                                            else if (step === 4 || step === 5) setDiagSearch(e.target.value);
                                            else if (step === 6) setProductSearch(e.target.value);
                                            else setRemarkInput(e.target.value);
                                        }}
                                        placeholder={
                                            step === 0 ? "Enter Patient Weight (KG)..."
                                            : step === 1 ? "Record Client Complaint..."
                                            : step === 2 ? "Enter Clinical History..."
                                            : step === 3 ? "Enter Clinical Signs..."
                                            : step === 4 ? "Search Differential Diagnoses..."
                                            : step === 5 ? "Identify Final Diagnosis..."
                                            : step === 6 ? "Search Injectables / Retail / Prescriptions..."
                                            : "Enter data..."
                                        }
                                        className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-16 pr-6 py-6 text-sm font-black text-white placeholder:text-white/20 placeholder:font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                if (step === 0) {
                                                    setStep(1); setRemarkInput('');
                                                } else if (step === 1) {
                                                    if (val) { addListItem('complane', val); setRemarkInput(''); } else setStep(2);
                                                } else if (step === 2) {
                                                    if (val) { addListItem('patient_history', val); setRemarkInput(''); } else setStep(3);
                                                } else if (step === 3) {
                                                    if (val) { addListItem('clinical_signs', val); setRemarkInput(''); } else setStep(4);
                                                } else if (step === 4) {
                                                    if (val && !diagSearch) { addListItem('differential_diagnosis', val); setRemarkInput(''); }
                                                    else if (!val) { setStep(5); setDiagSearch(''); }
                                                } else if (step === 5) {
                                                    if (val && !diagSearch) { addListItem('final_diagnoses', val); setRemarkInput(''); }
                                                    else if (!val) { setStep(6); setDiagSearch(''); setProductSearch(''); }
                                                } else if (step === 6) {
                                                    if (!val && !pendingItem) { 
                                                        // Final submit
                                                        handleSubmit();
                                                    }
                                                }
                                            } else if (e.key === 'Backspace' && !e.target.value) {
                                                if (step > 0) {
                                                    setStep(step - 1);
                                                    setRemarkInput('');
                                                    setDiagSearch('');
                                                    setProductSearch('');
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 pl-2">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70">ENTER</span> Execute</span>
                                        <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70" style={{ letterSpacing: '0em' }}>↵↵</span> Next Mode</span>
                                    </div>
                                    <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70 tracking-normal">Backspace</span> Previous</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: High-Density Draft Feed */}
                        <div className="w-[20%] lg:w-[22%] shrink-0 flex flex-col h-[calc(100vh-80px)] bg-slate-50 border-l border-slate-200 shadow-xl relative z-40 overflow-hidden">
                            <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-white">
                                <div className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                                    <Activity size={14} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Draft Feed</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50">
                                {data.weight_kg && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-slate-400 pl-3">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Wt</span>
                                        <p className="text-xs font-black text-slate-900 leading-none">{data.weight_kg} KG</p>
                                    </div>
                                )}
                                {data.complane.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-blue-500 pl-3 group">
                                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Complaints</span>
                                        <div className="flex flex-wrap gap-1">
                                            {data.complane.map((i, idx) => (
                                                <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[9px] px-2 py-0.5 font-bold rounded shadow-sm">{i}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.patient_history.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-slate-400 pl-3">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">History</span>
                                        <ul className="space-y-0.5">
                                            {data.patient_history.map((h, i) => <li key={i} className="text-[10px] font-bold text-slate-700 leading-tight flex gap-1"><span className="text-slate-300">•</span>{h}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {data.clinical_signs.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-indigo-500 pl-3">
                                        <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Clinical Signs</span>
                                        <div className="flex flex-wrap gap-1">
                                            {data.clinical_signs.map((i, idx) => (
                                                <span key={idx} className="bg-white border border-indigo-100 text-indigo-700 text-[9px] px-2 py-0.5 font-bold rounded shadow-sm">{i}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.lab_findings.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-amber-500 pl-3">
                                        <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Lab Findings</span>
                                        <div className="flex flex-wrap gap-1">
                                            {data.lab_findings.map((i, idx) => (
                                                <span key={idx} className="bg-white border border-amber-100 text-amber-700 text-[9px] px-2 py-0.5 font-bold rounded shadow-sm">{i}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.differential_diagnosis.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-violet-500 pl-3">
                                        <span className="text-[8px] font-black text-violet-600 uppercase tracking-widest">Differential Diag</span>
                                        <div className="flex flex-wrap gap-1">
                                            {data.differential_diagnosis.map((i, idx) => (
                                                <span key={idx} className="bg-violet-50 border border-violet-200 text-violet-700 text-[9px] px-2 py-0.5 font-bold rounded shadow-sm">{i}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.final_diagnoses.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-emerald-600 pl-3 mt-4">
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 self-start px-2 rounded">Final Diagnosis</span>
                                        <div className="flex flex-col gap-1 pt-1">
                                            {data.final_diagnoses.map((i, idx) => (
                                                <span key={idx} className="text-xs font-black text-emerald-700 leading-tight uppercase">{i}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.items.length > 0 && (
                                    <div className="flex flex-col gap-1 border-l-[3px] border-rose-500 pl-3 pt-2">
                                        <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Clinical Cart / Invoice</span>
                                        <div className="flex flex-col gap-1.5 pt-1">
                                            {data.items.map((i, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm relative overflow-hidden group">
                                                    <span className="text-[9px] font-bold text-slate-800 line-clamp-1">{i.name}</span>
                                                    <span className="text-[8px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded ml-2 shrink-0">x{i.quantity}</span>
                                                    <button onClick={() => setData('items', data.items.filter((_, itemIdx) => itemIdx !== idx))} className="absolute right-0 top-0 bottom-0 w-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Draft Feed Bottom Total */}
                            <div className="p-5 border-t border-slate-200 bg-white">
                                <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Bill</span>
                                    <span className="text-sm font-black text-emerald-600 tracking-tighter tabular-nums text-right">
                                        <span className="text-[8px] opacity-70 block -mb-1 leading-none">LKR</span>
                                        {(data.items.reduce((acc, cr) => acc + (cr.price * cr.quantity), 0) + Number(data.service_charge || 1000)).toLocaleString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={processing}
                                    className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ClipboardCheck size={16} className="stroke-[3]" /> Generate Invoice
                                </button>
                            </div>
                        </div>
EOD;

preg_match('/\{\/\* Tactical Command: Split Feedback\/Input Flow \*\/\}(.*?)(?=\{\/\* Footer Navigation Sticky \*\/\})/s', $content, $matches);

if (count($matches) > 0) {
    $content = str_replace($matches[0], $newTacticalCommand . "\n", $content);
    file_put_contents($file, $content);
    echo "Successfully replaced the layout.\n";
} else {
    echo "Could not find the target block.\n";
}

