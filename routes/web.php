<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NewCaseController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\OwnerPortalController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/debug-server', function () {
    return 'SERVER IS RUNNING CORRECTLY - '.now();
});

Route::middleware(['auth', 'clinic'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');

    // Pets & Owners
    Route::resource('pets', PetController::class);
    Route::resource('owners', OwnerController::class);

    // Staff
    Route::resource('staff', StaffController::class);

    // Inventory
    Route::resource('inventory', ProductController::class);
    Route::post('/inventory/bulk-restock', [ProductController::class, 'bulkRestock'])->name('inventory.bulk-restock');
    Route::post('/inventory/{product}/restock', [ProductController::class, 'restock'])->name('inventory.restock');
    Route::post('/inventory/categories', [ProductController::class, 'storeCategory'])->name('inventory.categories.store');
    Route::put('/inventory/categories/{category}', [ProductController::class, 'updateCategory'])->name('inventory.categories.update');
    Route::delete('/inventory/categories/{category}', [ProductController::class, 'destroyCategory'])->name('inventory.categories.destroy');

    // Billing
    Route::get('/billing/create', [InvoiceController::class, 'create'])->name('billing.create');
    Route::get('/billing', [InvoiceController::class, 'index'])->name('billing.index');
    Route::get('/billing/{invoice}', [InvoiceController::class, 'show'])->name('billing.show');
    Route::post('/billing', [InvoiceController::class, 'store'])->name('billing.store');
    Route::post('/billing/{invoice}/payment', [InvoiceController::class, 'addPayment'])->name('billing.payment');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/clinic', [SettingsController::class, 'updateClinic'])->name('settings.clinic.update');
    Route::post('/settings/species', [SettingsController::class, 'storeSpecies'])->name('settings.species.store');
    Route::put('/settings/species/{species}', [SettingsController::class, 'updateSpecies'])->name('settings.species.update');
    Route::delete('/settings/species/{species}', [SettingsController::class, 'destroySpecies'])->name('settings.species.destroy');
    Route::post('/settings/breeds', [SettingsController::class, 'storeBreed'])->name('settings.breeds.store');
    Route::delete('/settings/breeds/{breed}', [SettingsController::class, 'destroyBreed'])->name('settings.breeds.destroy');

    // Role Management
    Route::post('/settings/roles', [SettingsController::class, 'storeRole'])->name('settings.roles.store');
    Route::put('/settings/roles/{role}', [SettingsController::class, 'updateRole'])->name('settings.roles.update');
    Route::delete('/settings/roles/{role}', [SettingsController::class, 'destroyRole'])->name('settings.roles.destroy');

    // New Case Flow
    Route::get('/new-case', [NewCaseController::class, 'index'])->name('new-case.index');
    Route::post('/new-case', [NewCaseController::class, 'store'])->name('new-case.store');
    Route::get('/new-case/{record}/prescription-print', [NewCaseController::class, 'printPrescription'])->name('new-case.prescription-print');
    Route::post('/new-case/prescription-preview', [NewCaseController::class, 'previewPrescription'])->name('new-case.prescription-preview');
    Route::get('/new-case/{invoice}/bill-print', [NewCaseController::class, 'printBill'])->name('new-case.bill-print');
    Route::post('/new-case/bill-preview', [NewCaseController::class, 'previewBill'])->name('new-case.bill-preview');
    Route::get('/new-case/owners', [NewCaseController::class, 'getOwners'])->name('new-case.owners');
    Route::get('/new-case/pets/{owner}', [NewCaseController::class, 'getPets'])->name('new-case.pets');
    Route::get('/new-case/history/{pet}', [NewCaseController::class, 'getHistory'])->name('new-case.history');
    Route::post('/new-case/pet/{pet}/remarks', [NewCaseController::class, 'updateRemarks'])->name('new-case.pet.remarks');
    Route::put('/new-case/pet/{pet}/remarks', [NewCaseController::class, 'editRemark'])->name('new-case.pet.remarks.update');
    Route::delete('/new-case/pet/{pet}/remarks', [NewCaseController::class, 'deleteRemark'])->name('new-case.pet.remarks.destroy');
    Route::post('/new-case/owner', [NewCaseController::class, 'storeOwner'])->name('new-case.owner.store');
    Route::post('/new-case/pet', [NewCaseController::class, 'storePet'])->name('new-case.pet.store');

    // API routes for dropdowns
    Route::get('/api/species', [NewCaseController::class, 'getSpecies'])->name('api.species');
    Route::get('/api/breeds/{species}', [NewCaseController::class, 'getBreeds'])->name('api.breeds');

    // Diagnoses List
    Route::resource('diagnoses', DiagnosisController::class);

    // Branch Close
    Route::get('/branch-close', [\App\Http\Controllers\BranchCloseController::class, 'index'])->name('branch-close.index');
    Route::post('/branch-close', [\App\Http\Controllers\BranchCloseController::class, 'store'])->name('branch-close.store');

    // Health Records
    Route::post('/pets/{pet}/health-records', [HealthRecordController::class, 'store'])->name('pets.health-records.store');
});

// Owner Portal (Public/QR Access)
Route::prefix('portal/{uniqueId}')->group(function () {
    Route::get('/', [OwnerPortalController::class, 'index'])->name('portal.home');
    Route::get('/pet/{pet}', [OwnerPortalController::class, 'petProfile'])->name('portal.pet');
    Route::get('/invoices', [OwnerPortalController::class, 'invoices'])->name('portal.invoices');
});
