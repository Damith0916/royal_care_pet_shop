<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\OwnerPortalController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ReportController;

Route::get('/', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'clinic'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    
    // Appointments
    Route::resource('appointments', AppointmentController::class);

    // Pets & Owners
    Route::resource('pets', PetController::class);
    Route::resource('owners', OwnerController::class);

    // Staff
    Route::resource('staff', StaffController::class);

    // Inventory
    Route::resource('inventory', ProductController::class);
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

    // Health Records
    Route::post('/pets/{pet}/health-records', [\App\Http\Controllers\HealthRecordController::class, 'store'])->name('pets.health-records.store');
});

// Owner Portal (Public/QR Access)
Route::prefix('portal/{uniqueId}')->group(function () {
    Route::get('/', [OwnerPortalController::class, 'index'])->name('portal.home');
    Route::get('/pet/{pet}', [OwnerPortalController::class, 'petProfile'])->name('portal.pet');
    Route::get('/invoices', [OwnerPortalController::class, 'invoices'])->name('portal.invoices');
});
