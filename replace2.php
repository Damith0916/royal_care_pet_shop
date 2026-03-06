<?php

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

$newContent = <<<'EOD'
                        {/* UNIFIED INTERACTIVE FLOW (No third column) */}
                        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-slate-900 border-l border-slate-800 shadow-2xl relative z-40 overflow-hidden">
                            
                            {/* Top Bar for Draft Feed Summary */}
                            <div className="p-4 border-b border-white/10 shrink-0 bg-slate-900/90 backdrop-blur-xl flex justify-between items-center z-50 shadow-sm relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        {steps[step].icon && React.createElement(steps[step].icon, { size: 16 })}
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">{steps[step].label}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Single Stream Interface</p>
                                    </div>
                                </div>
                                
                                {/* Quick Draft Summary Area at top right */}
                                <div className="flex items-center gap-4">
                                     <div className="flex flex-col text-right px-4 border-r border-white/10">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Running Session Bill</span>
                                        <span className="text-sm font-black text-emerald-400 tracking-tighter tabular-nums">
                                            LKR {(data.items.reduce((acc, cr) => acc + (cr.price * cr.quantity), 0) + Number(data.service_charge || 1000)).toLocaleString()}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={processing}
                                        className="py-2.5 px-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <ClipboardCheck size={14} className="stroke-[3]" /> Generate Invoice
                                    </button>
                                </div>
                            </div>

                            {/* Main Display Interface */}
                            <div className="flex-1 flex flex-col p-6 overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
                                
                                {/* Draft Feed Layer (Floating above input, top-aligned) */}
                                <div className="flex-1 overflow-y-auto mb-4 flex flex-col justify-start gap-4 custom-scrollbar pr-2 pb-10">
                                    
                                    {/* The Draft Elements */}
                                    {data.weight_kg && (
                                        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 w-fit">
                                            <Weight size={14} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Live Weight</span>
                                                <p className="text-sm font-black text-white leading-none">{data.weight_kg} KG</p>
                                            </div>
                                        </div>
                                    )}
                                    {data.complane.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 max-w-2xl">
                                            <AlertCircle size={14} className="text-blue-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">Client Complaints</span>
                                                <div className="flex flex-wrap gap-2 text-white">
                                                    {data.complane.map((i, idx) => (
                                                        <span key={idx} className="bg-blue-500 shadow shadow-blue-500/20 text-[10px] px-2.5 py-1 font-bold rounded-lg">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.patient_history.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 max-w-2xl shadow-inner">
                                            <History size={14} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Patient History</span>
                                                <ul className="space-y-1">
                                                    {data.patient_history.map((h, i) => <li key={i} className="text-[11px] font-bold text-slate-300 leading-tight flex gap-2"><span className="text-slate-600">•</span>{h}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    {data.clinical_signs.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 max-w-2xl shadow-sm">
                                            <Activity size={14} className="text-indigo-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Clinical Signs</span>
                                                <div className="flex flex-wrap gap-2 text-white">
                                                    {data.clinical_signs.map((i, idx) => (
                                                        <span key={idx} className="bg-indigo-500/40 border border-indigo-500/50 text-[10px] px-2.5 py-1 font-bold rounded-lg">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.lab_findings.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 max-w-2xl shadow-sm">
                                            <FileText size={14} className="text-amber-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block mb-1">Lab Findings</span>
                                                <div className="flex flex-wrap gap-2 text-amber-50">
                                                    {data.lab_findings.map((i, idx) => (
                                                        <span key={idx} className="bg-amber-500/40 border border-amber-500/50 text-[10px] px-2.5 py-1 font-bold rounded-lg">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.differential_diagnosis.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 max-w-2xl shadow-sm">
                                            <Dna size={14} className="text-violet-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest block mb-1">Differential Diagnoses</span>
                                                <div className="flex flex-wrap gap-2 text-violet-50">
                                                    {data.differential_diagnosis.map((i, idx) => (
                                                        <span key={idx} className="bg-violet-500/40 border border-violet-500/50 text-[10px] px-2.5 py-1 font-bold rounded-lg">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.final_diagnoses.length > 0 && (
                                        <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 max-w-2xl shadow-lg shadow-emerald-500/5">
                                            <Stethoscope size={16} className="text-emerald-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Final Diagnoses</span>
                                                <div className="flex flex-col gap-1.5">
                                                    {data.final_diagnoses.map((i, idx) => (
                                                        <span key={idx} className="text-sm font-black text-emerald-300 leading-tight uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.items.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-rose-500/5 rounded-xl border border-rose-500/20 max-w-2xl mt-4 border-t-2 border-t-rose-500/50 pt-4">
                                            <ShoppingCart size={14} className="text-rose-400 mt-0.5" />
                                            <div className="w-full">
                                                <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest block mb-3">Invoice Cart Items</span>
                                                <div className="flex flex-col gap-2">
                                                    {data.items.map((i, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/10 group shadow-sm">
                                                            <span className="text-[11px] font-bold text-white tracking-widest">{i.name}</span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/20 shadow-inner">x{i.quantity}</span>
                                                                <button onClick={() => setData('items', data.items.filter((_, itemIdx) => itemIdx !== idx))} className="w-6 h-6 bg-red-500/20 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><X size={12} className="stroke-[3]" /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Instructions */}
                                    {((step === 0 && !data.weight_kg) || (step === 1 && data.complane.length===0)) && (
                                        <div className="text-center py-20 opacity-30 mt-auto">
                                            <Terminal size={48} className="mx-auto mb-4 text-white" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System ready for sequential input</p>
                                        </div>
                                    )}
                                    
                                    {/* Empty div to auto scroll */}
                                    <div id="feed-bottom-anchor"></div>
                                </div>

                                {/* Dynamic Overlay Layer specifically for searches during respective steps */}
                                <div className="absolute bottom-[100px] left-0 w-full px-6 pointer-events-none flex flex-col justify-end z-[60]">
                                    <AnimatePresence>
                                        {(step === 4 || step === 5) && diagSearch.trim().length > 0 && Array.isArray(diagnoses) && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto custom-scrollbar p-1 pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 mb-4">
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
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto custom-scrollbar p-1 pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 mb-4">
                                                {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 10).map((p, i) => {
                                                    const type = (p.category?.name || p.type || '').toLowerCase();
                                                    const isClinical = type.includes('vaccine') || type.includes('injection');
                                                    return (
                                                        <div key={p.id} className="p-3 bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between group"
                                                            onClick={() => {
                                                                setPendingItem(p);
                                                                setPendingQty('1');
                                                                setTimeout(() => document.getElementById('qty-input')?.focus(), 50);
                                                            }}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${isClinical ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                                                                <div className="flex flex-col">
                                                                    <span>{p.name}</span>
                                                                    <span className="text-[10px] text-white/50 font-medium">{isClinical ? 'Clinical Procedure / Injection' : 'Retail Item'} | LKR {p.unit_price}</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[9px] text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-black">Set Qty</span>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}

                                        {step === 6 && pendingItem && (
                                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="pointer-events-auto bg-emerald-600/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-emerald-500/50 mb-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3 text-white">
                                                        <Syringe size={24} />
                                                        <span className="text-sm font-black uppercase tracking-widest">{pendingItem.name}</span>
                                                    </div>
                                                    <button onClick={() => {setPendingItem(null); setTimeout(() => document.getElementById('unified-input')?.focus(), 50);}} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20"><X size={16} /></button>
                                                </div>
                                                <div className="flex gap-3 relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-black text-xs uppercase tracking-widest">Quantity:</div>
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
                                                        className="w-full bg-black/20 border border-white/20 rounded-xl pl-24 pr-5 py-4 text-white text-lg font-black outline-none focus:bg-black/30 placeholder:text-white/30"
                                                        placeholder="Enter quantity..."
                                                    />
                                                </div>
                                                <p className="text-[9px] font-black text-emerald-200/70 uppercase tracking-widest mt-3 text-center">Press Enter to Confirm</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Master Input Base */}
                                <div className="shrink-0 relative mt-auto border-t border-white/10 pt-4 bg-slate-900/50 backdrop-blur-xl pb-2 z-50">
                                    <div className="absolute top-[26px] left-4 text-blue-400">
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
                                        className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-white placeholder:text-white/20 placeholder:font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                
                                                // Function to auto scroll to bottom
                                                const scrollBottom = () => {
                                                    setTimeout(() => document.getElementById('feed-bottom-anchor')?.scrollIntoView({ behavior: 'smooth' }), 50);
                                                };

                                                if (step === 0) {
                                                    setStep(1); setRemarkInput('');
                                                } else if (step === 1) {
                                                    if (val) { addListItem('complane', val); setRemarkInput(''); scrollBottom(); } else setStep(2);
                                                } else if (step === 2) {
                                                    if (val) { addListItem('patient_history', val); setRemarkInput(''); scrollBottom(); } else setStep(3);
                                                } else if (step === 3) {
                                                    if (val) { addListItem('clinical_signs', val); setRemarkInput(''); scrollBottom(); } else setStep(4);
                                                } else if (step === 4) {
                                                    if (val && !diagSearch) { addListItem('differential_diagnosis', val); setRemarkInput(''); scrollBottom(); }
                                                    else if (!val) { setStep(5); setDiagSearch(''); }
                                                } else if (step === 5) {
                                                    if (val && !diagSearch) { addListItem('final_diagnoses', val); setRemarkInput(''); scrollBottom(); }
                                                    else if (!val) { setStep(6); setDiagSearch(''); setProductSearch(''); }
                                                } else if (step === 6) {
                                                    if (!val && !pendingItem) { 
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
                                    <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 pl-2">
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70 shadow-sm border border-white/5">ENTER</span> Execute</span>
                                            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70 shadow-sm border border-white/5" style={{ letterSpacing: '0em' }}>↵↵</span> Next Mode</span>
                                        </div>
                                        <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 rounded text-white/70 shadow-sm border border-white/5 tracking-normal">Backspace</span> Previous Mode</span>
                                    </div>
                                </div>
                            </div>
                        </div>
EOD;

preg_match('/\{\/\* MIDDLE: Unified Interactive Input Flow \*\/\}(.*?)(?=\{\/\* Footer Navigation Sticky \*\/\})/s', $content, $matches);

if (count($matches) > 0) {
    $content = str_replace($matches[0], $newContent . "\n", $content);
    file_put_contents($file, $content);
    echo "Successfully unified the flow.\n";
} else {
    echo "Could not find the target block.\n";
}

