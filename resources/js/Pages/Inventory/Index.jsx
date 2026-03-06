import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Package,
    AlertTriangle,
    TrendingUp,
    Box,
    Truck,
    Edit3,
    Filter,
    X as XIcon,
    Folder,
    Trash2,
    RefreshCw
} from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        red: 'bg-red-50 text-danger border-red-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return (
        <div className="card-interactive p-4 flex items-center gap-4 bg-white">
            <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center border`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-slate-500 text-xs font-medium leading-none mb-1">{label}</p>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none truncate">{value}</h4>
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            ></motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 relative z-10"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1 h-5 bg-primary-blue rounded-full"></div>
                        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:text-danger rounded-lg transition-all text-slate-400 border border-transparent hover:border-danger/10">
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default function InventoryIndex({ products, categories, suppliers }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0].id : null);
    const activeCategory = categories.find(c => c.id === activeTab);
    const isPrescription = activeCategory?.name?.toLowerCase().includes('prescription');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [isBulkRestockModalOpen, setIsBulkRestockModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [restockingProduct, setRestockingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, type: 'product', id: null, name: '' });

    const productForm = useForm({
        name: '',
        description: '',
        product_category_id: '',
        stock_quantity: '',
        min_stock_level: '5',
        expiry_date: '',
    });

    const categoryForm = useForm({
        name: '',
    });

    const restockForm = useForm({
        quantity: '',
    });

    const [bulkRestockItems, setBulkRestockItems] = useState([]);
    const [bulkSearch, setBulkSearch] = useState('');
    const [bulkHighlight, setBulkHighlight] = useState(-1);
    const [bulkPendingQty, setBulkPendingQty] = useState('');
    const [bulkPendingItem, setBulkPendingItem] = useState(null);

    const bulkRestockForm = useForm({
        items: []
    });

    const submitProduct = (e) => {
        e.preventDefault();
        if (editingProduct) {
            productForm.put(route('inventory.update', editingProduct.id), {
                onSuccess: () => {
                    setIsProductModalOpen(false);
                    productForm.reset();
                    setEditingProduct(null);
                }
            });
        } else {
            productForm.post(route('inventory.store'), {
                onSuccess: () => {
                    setIsProductModalOpen(false);
                    productForm.reset();
                }
            });
        }
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route('inventory.categories.update', editingCategory.id), {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    categoryForm.reset();
                    setEditingCategory(null);
                }
            });
        } else {
            categoryForm.post(route('inventory.categories.store'), {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    categoryForm.reset();
                }
            });
        }
    };

    const submitRestock = (e) => {
        e.preventDefault();
        restockForm.post(route('inventory.restock', restockingProduct.id), {
            onSuccess: () => {
                setIsRestockModalOpen(false);
                restockForm.reset();
                setRestockingProduct(null);
            }
        });
    };

    const submitBulkRestock = () => {
        if (bulkRestockItems.length === 0) return;
        bulkRestockForm.setData('items', bulkRestockItems.map(it => ({ id: it.id, quantity: it.quantity })));
        bulkRestockForm.post(route('inventory.bulk-restock'), {
            onSuccess: () => {
                setIsBulkRestockModalOpen(false);
                setBulkRestockItems([]);
            }
        });
    };

    const filteredProducts = (products || []).filter(p => {
        const name = p?.name || '';
        const desc = p?.description || '';
        const search = (searchTerm || '').toLowerCase();
        return name.toLowerCase().includes(search) ||
            desc.toLowerCase().includes(search);
    });

    const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock_level).length;

    const openEditProduct = (product) => {
        setEditingProduct(product);
        productForm.setData({
            name: product.name,
            description: product.description || '',
            product_category_id: product.product_category_id || activeTab,
            unit_price: product.unit_price,
            stock_quantity: product.stock_quantity,
            min_stock_level: product.min_stock_level,
            expiry_date: product.expiry_date || '',
        });
        setIsProductModalOpen(true);
    };

    const openRestock = (product) => {
        setRestockingProduct(product);
        restockForm.setData('quantity', '');
        setIsRestockModalOpen(true);
    };

    const deleteProduct = (id, name) => {
        setConfirmDelete({ open: true, type: 'product', id, name });
    };

    const deleteCategory = (id, name) => {
        setConfirmDelete({ open: true, type: 'category', id, name });
    };

    const handleConfirmedDelete = () => {
        if (confirmDelete.type === 'product') {
            router.delete(route('inventory.destroy', confirmDelete.id));
        } else {
            router.delete(route('inventory.categories.destroy', confirmDelete.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Inventory Management" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Monitor stock levels and manage medical supplies.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setBulkRestockItems([]);
                            setIsBulkRestockModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={16} />
                        Bulk Restock
                    </button>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            categoryForm.reset();
                            setIsCategoryModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary-blue border border-primary-blue hover:bg-blue-50 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
                    >
                        <Folder size={16} />
                        New Category
                    </button>
                    <button
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
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Products" value={products.length} icon={Box} color="blue" />
                <StatCard label="Low Stock Items" value={lowStockCount} icon={AlertTriangle} color="red" />
                <StatCard label="Total Inventory Value" value={`LKR ${products.reduce((acc, p) => acc + (parseFloat(p.unit_price) * p.stock_quantity), 0).toLocaleString()}`} icon={TrendingUp} color="green" />
            </div>

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
            <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
                <form onSubmit={submitProduct} className="space-y-4">
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

                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={productForm.processing}
                            className="px-6 py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {productForm.processing ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Restock Modal */}
            <Modal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} title={`Restock: ${restockingProduct?.name}`}>
                <form onSubmit={submitRestock} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity to Add</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-blue/10 outline-none text-center"
                            placeholder="0"
                            value={restockForm.data.quantity}
                            onChange={e => restockForm.setData('quantity', e.target.value)}
                            autoFocus
                        />
                        {restockForm.errors.quantity && <p className="text-danger text-xs mt-1">{restockForm.errors.quantity}</p>}
                    </div>
                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={restockForm.processing}
                            className="w-full py-2.5 bg-success hover:bg-green-700 text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all disabled:opacity-50"
                        >
                            {restockForm.processing ? 'Updating...' : 'Confirm Restock'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Category Modal */}
            <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={editingCategory ? "Edit Category" : "New Category"}>
                <form onSubmit={submitCategory} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-border-gray px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                            placeholder="e.g. Surgical Supplies"
                            value={categoryForm.data.name}
                            onChange={e => categoryForm.setData('name', e.target.value)}
                            autoFocus
                        />
                        {categoryForm.errors.name && <p className="text-danger text-xs mt-1">{categoryForm.errors.name}</p>}
                    </div>
                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={categoryForm.processing}
                            className="w-full py-2.5 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {categoryForm.processing ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Bulk Restock Modal */}
            <Modal isOpen={isBulkRestockModalOpen} onClose={() => setIsBulkRestockModalOpen(false)} title="Bulk Restock Stock">
                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Search Product</label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                autoFocus
                                placeholder="Type product name..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-300 transition-all outline-none"
                                value={bulkSearch}
                                onChange={e => {
                                    setBulkSearch(e.target.value);
                                    setBulkHighlight(0);
                                }}
                                onKeyDown={e => {
                                    const filtered = products.filter(p => !p.category?.name?.toLowerCase().includes('prescription') && p.name.toLowerCase().includes(bulkSearch.toLowerCase()));
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setBulkHighlight(prev => Math.min(prev + 1, filtered.length - 1));
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setBulkHighlight(prev => Math.max(prev - 1, 0));
                                    } else if (e.key === 'Enter' && filtered[bulkHighlight]) {
                                        e.preventDefault();
                                        setBulkPendingItem(filtered[bulkHighlight]);
                                        setBulkSearch('');
                                    }
                                }}
                            />
                        </div>

                        {bulkSearch && !bulkPendingItem && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-2xl border border-slate-100 rounded-xl z-[100] max-h-[200px] overflow-auto mt-1 overflow-hidden">
                                {products.filter(p => !p.category?.name?.toLowerCase().includes('prescription') && p.name.toLowerCase().includes(bulkSearch.toLowerCase())).map((p, i) => (
                                    <div
                                        key={i}
                                        onClick={() => { setBulkPendingItem(p); setBulkSearch(''); }}
                                        className={`p-3 text-xs font-bold hover:bg-emerald-50 cursor-pointer border-b border-slate-50 flex justify-between items-center ${bulkHighlight === i ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700'}`}
                                    >
                                        <span>{p.name}</span>
                                        <span className="text-[10px] opacity-60">Stock: {p.stock_quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {bulkPendingItem && (
                            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{bulkPendingItem.category?.name || 'Item'}</p>
                                    <h4 className="font-bold text-slate-900 truncate">{bulkPendingItem.name}</h4>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        type="number"
                                        placeholder="Qty"
                                        className="w-20 p-2 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={bulkPendingQty}
                                        onChange={e => setBulkPendingQty(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && bulkPendingQty > 0) {
                                                setBulkRestockItems([...bulkRestockItems, { ...bulkPendingItem, quantity: parseInt(bulkPendingQty) }]);
                                                setBulkPendingItem(null);
                                                setBulkPendingQty('');
                                            } else if (e.key === 'Escape') {
                                                setBulkPendingItem(null);
                                                setBulkPendingQty('');
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (bulkPendingQty > 0) {
                                                setBulkRestockItems([...bulkRestockItems, { ...bulkPendingItem, quantity: parseInt(bulkPendingQty) }]);
                                                setBulkPendingItem(null);
                                                setBulkPendingQty('');
                                            }
                                        }}
                                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pending Restock List</h4>
                        <div className="space-y-2 max-h-[300px] overflow-auto custom-scrollbar">
                            {bulkRestockItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:border-emerald-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Package size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500">Add {item.quantity} units</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setBulkRestockItems(bulkRestockItems.filter((_, i) => i !== idx))} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <XIcon size={14} />
                                    </button>
                                </div>
                            ))}
                            {bulkRestockItems.length === 0 && (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <RefreshCw size={20} className="mx-auto text-slate-300 mb-2 opacity-30" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">List is empty</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border-gray text-right">
                        <button
                            onClick={submitBulkRestock}
                            disabled={bulkRestockForm.processing || bulkRestockItems.length === 0}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {bulkRestockForm.processing ? 'Saving...' : (
                                <>
                                    <RefreshCw size={16} className={bulkRestockForm.processing ? 'animate-spin' : ''} />
                                    Commit Bulk Stock Update
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ ...confirmDelete, open: false })}
                onConfirm={handleConfirmedDelete}
                title={confirmDelete.type === 'product' ? "Remove Product" : "Delete Category"}
                message={confirmDelete.type === 'product'
                    ? `Are you sure you want to remove ${confirmDelete.name} from your inventory? This will also remove the product from all future billing selections.`
                    : `Are you sure you want to delete the ${confirmDelete.name} category? This will not delete the products within it, but they will become uncategorized.`
                }
                confirmText={confirmDelete.type === 'product' ? "Delete Product" : "Delete Category"}
                type="danger"
            />
        </AppLayout>
    );
}
