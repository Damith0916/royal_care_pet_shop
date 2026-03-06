<?php

$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

// Replace Archive section width
$content = str_replace(
    '<div className="w-[30%] lg:w-[32%] shrink-0 flex flex-col h-[calc(100vh-80px)] min-w-0 border-r border-slate-200">',
    '<div className="flex-1 flex flex-col h-[calc(100vh-80px)] min-w-0 border-r border-slate-200 bg-white">',
    $content
);

$newContent = <<<'EOD'
                        {/* UNIFIED INTERACTIVE FLOW (Light Theme & Compact) */}
                        <div className="w-[320px] lg:w-[380px] shrink-0 flex flex-col h-[calc(100vh-80px)] bg-slate-50 border-l border-slate-200 shadow-xl relative z-40 overflow-hidden text-slate-800">
                            
                            {/* Top Bar for Draft Feed Summary */}
                            <div className="p-3 border-b border-slate-200 shrink-0 bg-white/90 backdrop-blur-xl flex justify-between items-center z-50 shadow-sm relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center border border-blue-100 shadow-sm">
                                        {steps[step].icon && React.createElement(steps[step].icon, { size: 12 })}
                                    </div>
                                    <div>
                                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">{steps[step].label}</h2>
                                    </div>
                                </div>
                                
                                {/* Quick Draft Summary Area at top right */}
                                <div className="flex items-center gap-2">
                                     <div className="flex flex-col text-right px-2 border-r border-slate-200">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Bill Total</span>
                                        <span className="text-[13px] font-black text-emerald-600 tracking-tighter tabular-nums leading-tight">
                                            LKR {(data.items.reduce((acc, cr) => acc + (cr.price * cr.quantity), 0) + Number(data.service_charge || 1000)).toLocaleString()}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={processing}
                                        className="py-1.5 px-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-1 active:scale-95"
                                    >
                                        <ClipboardCheck size={12} className="stroke-[3]" /> Invoice
                                    </button>
                                </div>
                            </div>

                            {/* Main Display Interface */}
                            <div className="flex-1 flex flex-col p-3 overflow-hidden relative bg-slate-50">
                                
                                {/* Draft Feed Layer (Floating above input, top-aligned) */}
                                <div className="flex-1 overflow-y-auto mb-2 flex flex-col justify-start gap-2.5 custom-scrollbar pr-1 pb-10">
                                    
                                    {/* The Draft Elements */}
                                    {data.weight_kg && (
                                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 w-fit shadow-sm">
                                            <Weight size={12} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Live Weight</span>
                                                <p className="text-[13px] font-black text-slate-800 leading-none">{data.weight_kg} KG</p>
                                            </div>
                                        </div>
                                    )}
                                    {data.complane.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100 shadow-sm">
                                            <AlertCircle size={12} className="text-blue-500 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest block mb-0.5">Client Complaints</span>
                                                <div className="flex flex-wrap gap-1.5 text-slate-800">
                                                    {data.complane.map((i, idx) => (
                                                        <span key={idx} className="bg-white border border-blue-200 text-blue-800 text-[10px] px-1.5 py-0.5 font-bold rounded">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.patient_history.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                            <History size={12} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Patient History</span>
                                                <ul className="space-y-0.5">
                                                    {data.patient_history.map((h, i) => <li key={i} className="text-[11px] font-bold text-slate-600 leading-tight flex gap-1.5"><span className="text-slate-300">•</span>{h}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    {data.clinical_signs.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 shadow-sm">
                                            <Activity size={12} className="text-indigo-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-0.5">Clinical Signs</span>
                                                <div className="flex flex-wrap gap-1.5 text-slate-800">
                                                    {data.clinical_signs.map((i, idx) => (
                                                        <span key={idx} className="bg-white border border-indigo-200 text-indigo-700 text-[10px] px-1.5 py-0.5 font-bold rounded">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.lab_findings.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100 shadow-sm">
                                            <FileText size={12} className="text-amber-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">Lab Findings</span>
                                                <div className="flex flex-wrap gap-1.5 text-slate-800">
                                                    {data.lab_findings.map((i, idx) => (
                                                        <span key={idx} className="bg-white border border-amber-200 text-amber-700 text-[10px] px-1.5 py-0.5 font-bold rounded">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.differential_diagnosis.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-violet-50/50 rounded-lg border border-violet-100 shadow-sm">
                                            <Dna size={12} className="text-violet-400 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-violet-500 uppercase tracking-widest block mb-0.5">Differential Diagnoses</span>
                                                <div className="flex flex-wrap gap-1.5 text-slate-800">
                                                    {data.differential_diagnosis.map((i, idx) => (
                                                        <span key={idx} className="bg-white border border-violet-200 text-violet-700 text-[10px] px-1.5 py-0.5 font-bold rounded">{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.final_diagnoses.length > 0 && (
                                        <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
                                            <Stethoscope size={14} className="text-emerald-500 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Final Diagnoses</span>
                                                <div className="flex flex-col gap-1">
                                                    {data.final_diagnoses.map((i, idx) => (
                                                        <span key={idx} className="text-[13px] font-black text-emerald-700 leading-tight uppercase flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{i}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data.items.length > 0 && (
                                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 mt-2 shadow-sm border-t-2 border-t-rose-400">
                                            <ShoppingCart size={12} className="text-rose-400 mt-0.5" />
                                            <div className="w-full">
                                                <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest block mb-1.5">Invoice Cart Items</span>
                                                <div className="flex flex-col gap-1.5">
                                                    {data.items.map((i, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-1.5 px-2 rounded border border-slate-100 group shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                            <span className="text-[11px] font-bold text-slate-700 tracking-tight line-clamp-1 break-words mr-2">{i.name}</span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">x{i.quantity}</span>
                                                                <button onClick={() => setData('items', data.items.filter((_, itemIdx) => itemIdx !== idx))} className="w-5 h-5 bg-red-50 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><X size={10} className="stroke-[3]" /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Instructions */}
                                    {((step === 0 && !data.weight_kg) || (step === 1 && data.complane.length===0)) && (
                                        <div className="text-center py-10 opacity-40 mt-auto">
                                            <Terminal size={32} className="mx-auto mb-2 text-slate-400" />
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System ready</p>
                                        </div>
                                    )}
                                    
                                    {/* Empty div to auto scroll */}
                                    <div id="feed-bottom-anchor"></div>
                                </div>

                                {/* Dynamic Overlay Layer specifically for searches during respective steps */}
                                <div className="absolute bottom-[90px] left-0 w-full px-3 pointer-events-none flex flex-col justify-end z-[60]">
                                    <AnimatePresence>
                                        {(step === 4 || step === 5) && diagSearch.trim().length > 0 && Array.isArray(diagnoses) && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-1.5 w-full max-h-[250px] overflow-y-auto custom-scrollbar p-1 pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-2 mb-2">
                                                {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()) && !(step === 4 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)).slice(0, 10).map((diag, i) => (
                                                    <div key={diag.id} className="p-2.5 bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 text-slate-800 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                                                        onClick={() => {
                                                            const targetList = step === 4 ? 'differential_diagnosis' : 'final_diagnoses';
                                                            setData(targetList, [...data[targetList], diag.name]);
                                                            setDiagSearch('');
                                                            document.getElementById('unified-input')?.focus();
                                                        }}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                            {diag.name}
                                                        </div>
                                                        <span className="text-[8px] text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-black">Select [Enter]</span>
                                                    </div>
                                                ))}
                                                {diagnoses.filter(d => d.name.toLowerCase().includes(diagSearch.toLowerCase()) && !(step === 4 ? data.differential_diagnosis : data.final_diagnoses).includes(d.name)).length === 0 && (
                                                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[11px] font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-amber-100 transition-all"
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
                                                        <AlertCircle size={12} /> Register: "{diagSearch}"
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {step === 6 && productSearch.trim().length > 0 && Array.isArray(products) && !pendingItem && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-1.5 w-full max-h-[250px] overflow-y-auto custom-scrollbar p-1 pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-2 mb-2">
                                                {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 10).map((p, i) => {
                                                    const type = (p.category?.name || p.type || '').toLowerCase();
                                                    const isClinical = type.includes('vaccine') || type.includes('injection');
                                                    return (
                                                        <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 text-slate-800 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                                                            onClick={() => {
                                                                setPendingItem(p);
                                                                setPendingQty('1');
                                                                setTimeout(() => document.getElementById('qty-input')?.focus(), 50);
                                                            }}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${isClinical ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                                                                <div className="flex flex-col">
                                                                    <span>{p.name}</span>
                                                                    <span className="text-[9px] text-slate-400 font-medium">{isClinical ? 'Clinical Procedure' : 'Retail Item'} | LKR {p.unit_price}</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[8px] text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-black">Set Qty</span>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}

                                        {step === 6 && pendingItem && (
                                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="pointer-events-auto bg-white p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-emerald-200 mb-2">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2 text-emerald-600">
                                                        <Syringe size={16} />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">{pendingItem.name}</span>
                                                    </div>
                                                    <button onClick={() => {setPendingItem(null); setTimeout(() => document.getElementById('unified-input')?.focus(), 50);}} className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50"><X size={14} /></button>
                                                </div>
                                                <div className="flex gap-2 relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] uppercase tracking-widest">Qty:</div>
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
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-14 pr-3 py-2 text-slate-800 text-[13px] font-black outline-none focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-300"
                                                        placeholder="Enter quantity..."
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Master Input Base */}
                                <div className="shrink-0 relative mt-auto border-t border-slate-200 pt-3 bg-white/90 backdrop-blur-xl z-50 rounded-t-xl -mx-3 px-3">
                                    <div className="absolute top-[21px] left-6 text-blue-500">
                                        <ChevronRight size={18} className="stroke-[3]" />
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
                                            : step === 6 ? "Injectables / Retail..."
                                            : "Enter data..."
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-bold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
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
                                    <div className="mt-2 flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-slate-400 pl-1">
                                        <div className="flex gap-3">
                                            <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 shadow-sm border border-slate-200">ENTER</span> Add</span>
                                            <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 shadow-sm border border-slate-200">2x ENTER</span> Next</span>
                                        </div>
                                        <span className="flex items-center gap-1"><span className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 shadow-sm border border-slate-200">BckSpc</span> Prev</span>
                                    </div>
                                </div>
                            </div>
                        </div>
EOD;

preg_match('/\{\/\* UNIFIED INTERACTIVE FLOW \(No third column\) \*\/\}(.*?)(?=\{\/\* Footer Navigation Sticky \*\/\})/s', $content, $matches);

if (count($matches) > 0) {
    $content = str_replace($matches[0], $newContent . "\n                    </div>\n                </div>\n", $content);
    file_put_contents($file, $content);
    echo "Successfully unified the flow.\n";
} else {
    echo "Could not find the target block.\n";
}
