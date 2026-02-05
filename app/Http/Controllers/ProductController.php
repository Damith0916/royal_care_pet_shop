<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Index', [
            'products' => Product::with(['category', 'supplier'])->get(),
            'categories' => ProductCategory::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_category_id' => 'required|exists:product_categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit_price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'min_stock_level' => 'required|integer',
            'expiry_date' => 'nullable|date',
        ]);

        Product::create($validated);

        return redirect()->back()->with('success', 'Product added to inventory.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_category_id' => 'sometimes|exists:product_categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'unit_price' => 'sometimes|numeric',
            'stock_quantity' => 'sometimes|integer',
            'min_stock_level' => 'sometimes|integer',
            'expiry_date' => 'nullable|date',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product information updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product removed from inventory.');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        ProductCategory::create($validated);
        return redirect()->back()->with('success', 'Category added.');
    }

    public function updateCategory(Request $request, ProductCategory $category)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $category->update($validated);
        return redirect()->back()->with('success', 'Category updated.');
    }

    public function destroyCategory(ProductCategory $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted.');
    }

    public function restock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        $product->increment('stock_quantity', $validated['quantity']);
        return redirect()->back()->with('success', 'Stock updated.');
    }
}
