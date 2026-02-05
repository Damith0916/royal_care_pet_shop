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
    MoreVertical,
    Edit3,
    Filter,
    X as XIcon,
    Folder,
    Trash2,
    RefreshCw
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-primary-blue border-blue-100',
        red: 'bg-red-50 text-danger border-red-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        green: 'bg-green-50 text-success border-green-100'
    };
    return (
        <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center border group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-2">{label}</p>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</h4>
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border-gray">
                <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function InventoryIndex({ products, categories, suppliers }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Edit/Restock State
    const [editingProduct, setEditingProduct] = useState(null);
    const [restockingProduct, setRestockingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    // Forms
    const productForm = useForm({
        name: '',
        description: '',
        product_category_id: '',
        supplier_id: '',
        unit_price: '',
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

    // Handlers
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

    // Filter Logic
    const filteredProducts = (products || []).filter(p => {
        const name = p?.name || '';
        const desc = p?.description || '';
        const search = (searchTerm || '').toLowerCase();
        return name.toLowerCase().includes(search) ||
            desc.toLowerCase().includes(search);
    });

    const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock_level).length;

    // Helper to open edit modal
    const openEditProduct = (product) => {
        setEditingProduct(product);
        productForm.setData({
            name: product.name,
            description: product.description || '',
            product_category_id: product.product_category_id,
            supplier_id: product.supplier_id || '',
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

    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('inventory.destroy', id));
        }
    };

    const deleteCategory = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('inventory.categories.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Inventory Management" />

            {/* Header Hub */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide">Inventory Hub</h1>
                    <p className="text-sm font-medium text-slate-500">Monitor stock levels and manage medical supplies.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            categoryForm.reset();
                            setIsCategoryModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-primary-blue border border-primary-blue hover:bg-blue-50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                    >
                        <Folder size={16} />
                        New Category
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            productForm.reset();
                            setIsProductModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        New Product
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Catalog Items" value={products.length} icon={Box} color="blue" />
                <StatCard label="Critical Low Stock" value={lowStockCount} icon={AlertTriangle} color="red" />
                <StatCard label="Supply Nodes" value={suppliers.length} icon={Truck} color="purple" />
                <StatCard label="Active Asset Valuation" value={`LKR ${products.reduce((acc, p) => acc + (parseFloat(p.unit_price) * p.stock_quantity), 0).toLocaleString()}`} icon={TrendingUp} color="green" />
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl border border-border-gray w-fit">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-8 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-primary-blue shadow-sm border border-border-gray' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Products Catalog
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-8 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-white text-primary-blue shadow-sm border border-border-gray' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Management Categories
                </button>
            </div>

            {/* Main Listing Card */}
            <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden min-h-[400px]">
                {activeTab === 'products' && (
                    <>
                        {/* Toolbar */}
                        <div className="p-8 border-b border-border-gray bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Quick search products..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-border-gray pl-11 pr-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none shadow-sm transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border-gray rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                                    <Filter size={14} /> Advanced Filter
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-border-gray">
                                    <tr>
                                        <th className="px-8 py-5">Product Details</th>
                                        <th className="px-8 py-5">Classification</th>
                                        <th className="px-8 py-5">Stock Health</th>
                                        <th className="px-8 py-5">Market Valuation</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group text-slate-900">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                                                        <Package size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm leading-none mb-1.5 uppercase">{product.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{product.description || 'No description available'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                                                    {product.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (product.stock_quantity / Math.max(product.min_stock_level * 5, 10)) * 100)}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${product.stock_quantity <= product.min_stock_level ? 'bg-danger' : 'bg-emerald-500'}`}
                                                    ></motion.div>
                                                    {product.stock_quantity <= product.min_stock_level && (
                                                        <motion.div
                                                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute inset-0 bg-danger"
                                                        />
                                                    )}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${product.stock_quantity <= product.min_stock_level ? 'text-danger animate-pulse' : 'text-slate-600'}`}>
                                                    {product.stock_quantity} UNIT{product.stock_quantity !== 1 ? 'S' : ''}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-slate-900 tracking-tight">LKR {parseFloat(product.unit_price).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openRestock(product)}
                                                        className="p-2.5 bg-success/10 text-success hover:bg-success hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="Inventory Refill"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditProduct(product)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-blue hover:bg-white border border-border-gray rounded-xl transition-all shadow-sm"
                                                        title="Modify Product"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-danger hover:bg-red-50 border border-border-gray rounded-xl transition-all shadow-sm"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'categories' && (
                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map(cat => (
                                <div key={cat.id} className="p-6 border border-border-gray rounded-xl bg-slate-50/50 flex items-center justify-between hover:border-primary-blue/30 hover:bg-white hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center border border-primary-blue/10">
                                            <Folder size={20} />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{cat.name}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                        <button
                                            onClick={() => {
                                                setEditingCategory(cat);
                                                categoryForm.setData('name', cat.name);
                                                setIsCategoryModalOpen(true);
                                            }}
                                            className="p-2 bg-white rounded-lg text-slate-400 hover:text-primary-blue shadow-sm border border-border-gray transition-colors"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(cat.id)}
                                            className="p-2 bg-white rounded-lg text-slate-400 hover:text-danger shadow-sm border border-border-gray transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? "Manage Product Details" : "Register New Product"}>
                <form onSubmit={submitProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Catalog Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="e.g. Antibiotics A"
                                value={productForm.data.name}
                                onChange={e => productForm.setData('name', e.target.value)}
                            />
                            {productForm.errors.name && <p className="text-danger text-[10px] font-bold mt-1">{productForm.errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Brief Description</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                placeholder="Functional use..."
                                value={productForm.data.description}
                                onChange={e => productForm.setData('description', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Classification</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={productForm.data.product_category_id}
                                onChange={e => productForm.setData('product_category_id', e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {productForm.errors.product_category_id && <p className="text-danger text-[10px] font-bold mt-1">{productForm.errors.product_category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Supplier</label>
                            <select
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none appearance-none"
                                value={productForm.data.supplier_id}
                                onChange={e => productForm.setData('supplier_id', e.target.value)}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Valuation per Unit</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-bold text-primary-blue focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={productForm.data.unit_price}
                                onChange={e => productForm.setData('unit_price', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening Stock Quantity</label>
                            <input
                                type="number"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={productForm.data.stock_quantity}
                                onChange={e => productForm.setData('stock_quantity', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minimum Stock Level Alert</label>
                            <input
                                type="number"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={productForm.data.min_stock_level}
                                onChange={e => productForm.setData('min_stock_level', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Expiry Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-blue/10 outline-none"
                                value={productForm.data.expiry_date}
                                onChange={e => productForm.setData('expiry_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={productForm.processing}
                            className="px-10 py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {productForm.processing ? 'Syncing...' : (editingProduct ? 'Update Inventory Record' : 'Commit New Product')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Restock Modal */}
            <Modal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} title={`Inventory Refill: ${restockingProduct?.name}`}>
                <form onSubmit={submitRestock} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Inbound Quantity Refill</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full bg-slate-50 border border-border-gray px-4 py-4 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-blue/10 outline-none text-center"
                            placeholder="0"
                            value={restockForm.data.quantity}
                            onChange={e => restockForm.setData('quantity', e.target.value)}
                            autoFocus
                        />
                        {restockForm.errors.quantity && <p className="text-danger text-[10px] font-bold mt-1">{restockForm.errors.quantity}</p>}
                    </div>
                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={restockForm.processing}
                            className="w-full py-4 bg-success hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(34,197,94,0.2)] transition-all disabled:opacity-50"
                        >
                            {restockForm.processing ? 'Updating Treasury...' : 'Confirm Stock Refill'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Category Modal */}
            <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={editingCategory ? "Update Classification" : "New Systematic Category"}>
                <form onSubmit={submitCategory} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Systematic Category Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-border-gray px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue/10 outline-none"
                            placeholder="e.g. Surgical Supplies"
                            value={categoryForm.data.name}
                            onChange={e => categoryForm.setData('name', e.target.value)}
                            autoFocus
                        />
                        {categoryForm.errors.name && <p className="text-danger text-[10px] font-bold mt-1">{categoryForm.errors.name}</p>}
                    </div>
                    <div className="pt-6 border-t border-border-gray text-right">
                        <button
                            type="submit"
                            disabled={categoryForm.processing}
                            className="w-full py-4 bg-primary-blue hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_8px_16px_rgba(16,98,255,0.2)] transition-all disabled:opacity-50"
                        >
                            {categoryForm.processing ? 'Saving...' : 'Commit Category Change'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
