<?php
$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\NewCase\\Index.jsx';
$content = file_get_contents($file);

$oldFeedButtons = <<<'EOD'
                                                    <div className="opacity-0 group-hover/item:opacity-100 flex gap-0.5 transition-opacity shrink-0">
                                                        <button onClick={() => { setEditingListItem({ key: section.key, index: idx }); setEditingListValue(item); }}
                                                            className="w-4 h-4 bg-blue-50 text-blue-500 rounded flex items-center justify-center hover:bg-blue-500 hover:text-white"><Edit2 size={8} /></button>
                                                        <button onClick={() => removeListItem(section.key, idx)}
                                                            className="w-4 h-4 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-500 hover:text-white"><X size={8} /></button>
                                                    </div>
EOD;

$newFeedButtons = <<<'EOD'
                                                    <div className="opacity-0 group-hover/item:opacity-100 flex gap-0.5 transition-opacity shrink-0">
                                                        {(section.key === 'differential_diagnosis' || section.key === 'final_diagnoses') && 
                                                         !diagnoses.some(d => d.name.toLowerCase() === item.toLowerCase()) && (
                                                            <button 
                                                                onClick={async () => {
                                                                    const nd = await handleRegisterDiagnosis(item);
                                                                    if (nd) {
                                                                        const newArr = [...data[section.key]];
                                                                        newArr[idx] = nd.name;
                                                                        setData(section.key, newArr);
                                                                    }
                                                                }}
                                                                title="Save to database"
                                                                className="w-4 h-4 bg-emerald-50 text-emerald-500 rounded flex items-center justify-center hover:bg-emerald-500 hover:text-white"
                                                            >
                                                                <PlusCircle size={8} className="stroke-[3]" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => { setEditingListItem({ key: section.key, index: idx }); setEditingListValue(item); }}
                                                            className="w-4 h-4 bg-blue-50 text-blue-500 rounded flex items-center justify-center hover:bg-blue-500 hover:text-white"><Edit2 size={8} /></button>
                                                        <button onClick={() => removeListItem(section.key, idx)}
                                                            className="w-4 h-4 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-500 hover:text-white"><X size={8} /></button>
                                                    </div>
EOD;

$content = str_replace($oldFeedButtons, $newFeedButtons, $content);

file_put_contents($file, $content);
echo "NewCase/Index.jsx updated with DD save icon.\n";
