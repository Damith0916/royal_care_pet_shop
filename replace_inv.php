<?php
$file = 'c:\\wamp64\\www\\smart percare\\smartpetcare\\resources\\js\\Pages\\Inventory\\Index.jsx';

$content = file_get_contents($file);

// Replace state and tab logic
$newContent = preg_replace('/const \[activeTab, setActiveTab\] = useState\(\'products\'\);/', "const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0].id : null);", $content);

// In the Add/Edit Product Modal, conditionally hide fields based on active tab name.
// First, we need the active category name.
// Add this right after activeTab definition:
$insertActiveCat = "    const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0].id : null);\n    const activeCategory = categories.find(c => c.id === activeTab);\n    const isPrescription = activeCategory?.name?.toLowerCase().includes('prescription');";
$newContent = preg_replace('/const \[activeTab, setActiveTab\] = useState\(categories\.length > 0 \? categories\[0\]\.id : null\);/', $insertActiveCat, $newContent);

// Update openEditProduct to set product_category_id
$oldOpenEdit = '            product_category_id: product.product_category_id,';
$newOpenEdit = '            product_category_id: product.product_category_id || activeTab,';
$newContent = str_replace($oldOpenEdit, $newOpenEdit, $newContent);

// Submitting product: if creating new, and not editing, we should set category id to activeTab
// Wait, we can just set productForm.data.product_category_id if not set in the modal.
// We'll update the "Add Product" button onClick to set the activeTab.
$oldAddButton = <<<'EOD'
                        onClick={() => {
                            setEditingProduct(null);
                            productForm.reset();
                            setIsProductModalOpen(true);
                        }}
EOD;

$newAddButton = <<<'EOD'
                        onClick={() => {
                            setEditingProduct(null);
                            productForm.reset();
                            productForm.setData('product_category_id', activeTab);
                            if (isPrescription) {
                                productForm.setData({
                                   name: '', description: '', product_category_id: activeTab,
                                   stock_quantity: 0, min_stock_level: 0, expiry_date: '', unit_price: 0
                                });
                            }
                            setIsProductModalOpen(true);
                        }}
EOD;
$newContent = str_replace($oldAddButton, $newAddButton, $newContent);

// Fix Tab Bar & Table View
// Replace the section from <div className="flex gap-1.5 mb-5... to {activeTab === 'categories' && (...)}
$oldTabsAndContentPrefix = '/\{\/\* Tabs \*\/\}(.*?)\{\/\* Product Modal \*\/\}/s';

$newTabsContent = <<<'TABS'
{/* Custom Category Tabs */}
            <div className="flex gap-1.5 mb-5 bg-slate-100/60 p-1 rounded-xl border border-slate-200 w-fit max-w-full overflow-x-auto custom-scrollbar">
                {categories.map(cat => (
                    <div key={cat.id} className="relative group/tab">
                        <button
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === cat.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {cat.name}
                        </button>
                        {activeTab === cat.id && (
                            <div className="absolute -top-1.5 -right-1.5 flex gap-0.5">
                                <button onClick={() => { setEditingCategory(cat); categoryForm.setData('name', cat.name); setIsCategoryModalOpen(true); }} className="w-5 h-5 bg-white text-primary-blue rounded-full flex items-center justify-center border border-slate-200 shadow hover:bg-blue-50">
                                    <Edit3 size={10} />
                                </button>
                                <button onClick={() => deleteCategory(cat.id, cat.name)} className="w-5 h-5 bg-white text-danger rounded-full flex items-center justify-center border border-slate-200 shadow hover:bg-red-50">
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-border-gray bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search in this category..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-border-gray pl-9 pr-4 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-border-gray">
                            <tr>
                                <th className="px-5 py-3.5">Product Name</th>
                                {!isPrescription && <th className="px-5 py-3.5">Stock</th>}
                                {!isPrescription && <th className="px-5 py-3.5">Unit Price</th>}
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.filter(p => p.product_category_id === activeTab).map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group text-slate-900">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0 border border-blue-100">
                                                <Package size={15} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{product.name}</p>
                                                {!isPrescription && <p className="text-xs text-slate-400 truncate max-w-[180px]">{product.description || 'No description'}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    {!isPrescription && (
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (product.stock_quantity / Math.max(product.min_stock_level * 5, 10)) * 100)}%` }}
                                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${product.stock_quantity <= product.min_stock_level ? 'bg-danger' : 'bg-emerald-500'}`}
                                                    ></motion.div>
                                                </div>
                                                <span className={`text-xs font-semibold ${product.stock_quantity <= product.min_stock_level ? 'text-danger' : 'text-slate-600'}`}>
                                                    {product.stock_quantity}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    {!isPrescription && (
                                        <td className="px-5 py-3.5">
                                            <span className="text-sm font-semibold text-slate-900">LKR {parseFloat(product.unit_price).toLocaleString()}</span>
                                        </td>
                                    )}
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {!isPrescription && (
                                                <button onClick={() => openRestock(product)} className="p-2 bg-success/10 text-success hover:bg-success hover:text-white rounded-lg transition-all" title="Restock">
                                                    <RefreshCw size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => openEditProduct(product)} className="p-2 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-lg transition-all" title="Edit">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => deleteProduct(product.id, product.name)} className="p-2 bg-slate-50 text-slate-400 hover:text-danger hover:bg-red-50 border border-border-gray rounded-lg transition-all" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.filter(p => p.product_category_id === activeTab).length === 0 && (
                        <div className="py-16 text-center">
                            <Package size={32} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 font-medium text-sm">No items found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
TABS;

$newContent = preg_replace($oldTabsAndContentPrefix, $newTabsContent, $newContent);

// Hide non-prescription fields in Product Modal
$oldModalFieldsPrefix = '/<div className="grid grid-cols-1 md:grid-cols-2 gap-4">(.*?)<div className="pt-4 border-t/s';
$newModalFieldsContent = <<<'MODAL'
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`space-y-1.5 ${isPrescription ? 'md:col-span-2' : ''}`}>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Name..."
                                value={productForm.data.name}
                                onChange={e => productForm.setData('name', e.target.value)}
                            />
                            {productForm.errors.name && <p className="text-danger text-xs mt-1">{productForm.errors.name}</p>}
                        </div>

                        {!isPrescription && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                        placeholder="Functional use..."
                                        value={productForm.data.description}
                                        onChange={e => productForm.setData('description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                        value={productForm.data.product_category_id}
                                        onChange={e => productForm.setData('product_category_id', e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Unit Price (LKR)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-semibold text-primary-blue focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                        value={productForm.data.unit_price}
                                        onChange={e => productForm.setData('unit_price', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Opening Stock Qty</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                        value={productForm.data.stock_quantity}
                                        onChange={e => productForm.setData('stock_quantity', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Min Stock Level</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                        value={productForm.data.min_stock_level}
                                        onChange={e => productForm.setData('min_stock_level', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                        value={productForm.data.expiry_date}
                                        onChange={e => productForm.setData('expiry_date', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="pt-4 border-t
MODAL;

$newContent = preg_replace($oldModalFieldsPrefix, $newModalFieldsContent, $newContent);

file_put_contents($file, $newContent);
echo "Inventory updated.\n";
