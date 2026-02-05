<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $clinic = \App\Models\Clinic::create([
            'name' => 'River Cottage Clinic',
            'address' => '123 Pet Lane, Animal City',
            'phone' => '555-0123',
            'email' => 'contact@rivercottage.com',
            'tax_rate' => 5.0,
            'default_currency' => 'USD',
            'is_active' => true,
        ]);

        $adminRole = \App\Models\Role::create([
            'name' => 'Admin',
            'description' => 'System Administrator with full access'
        ]);

        $permissions = [
            'can_view_dashboard',
            'can_manage_appointments',
            'can_manage_pets',
            'can_manage_owners',
            'can_manage_staff',
            'can_manage_inventory',
            'can_manage_billing',
            'can_view_reports',
            'can_manage_settings',
        ];

        foreach ($permissions as $p) {
            $permission = \App\Models\Permission::create(['name' => $p]);
            $adminRole->permissions()->attach($permission);
        }

        \App\Models\User::create([
            'clinic_id' => $clinic->id,
            'role_id' => $adminRole->id,
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'name' => 'Admin',
            'email' => 'admin@smartpetcare.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'is_active' => true,
        ]);

        // Seed some species
        $dog = \App\Models\Species::create(['clinic_id' => $clinic->id, 'name' => 'Dog']);
        $cat = \App\Models\Species::create(['clinic_id' => $clinic->id, 'name' => 'Cat']);

        // Seed some owners
        $owner = \App\Models\Owner::create([
            'clinic_id' => $clinic->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '1234567890',
            'email' => 'john@example.com',
            'address' => '456 Owner Rd',
        ]);

        // Seed some pets
        \App\Models\Pet::create([
            'clinic_id' => $clinic->id,
            'owner_id' => $owner->id,
            'name' => 'Buddy',
            'species_id' => $dog->id,
            'breed_id' => null,
            'gender' => 'Male',
            'dob' => '2020-01-01',
        ]);

        \App\Models\Pet::create([
            'clinic_id' => $clinic->id,
            'owner_id' => $owner->id,
            'name' => 'Mittens',
            'species_id' => $cat->id,
            'gender' => 'Female',
            'dob' => '2021-05-10',
        ]);

        // Seed some services
        \App\Models\ServiceCategory::create(['clinic_id' => $clinic->id, 'name' => 'General']);
        \App\Models\Service::create([
            'clinic_id' => $clinic->id,
            'service_category_id' => 1,
            'name' => 'General Checkup',
            'cost' => 50.00,
            'duration_minutes' => 30
        ]);
        \App\Models\Service::create([
            'clinic_id' => $clinic->id,
            'service_category_id' => 1,
            'name' => 'Vaccination',
            'cost' => 30.00,
            'duration_minutes' => 15
        ]);

        // Seed some product categories
        $medsCat = \App\Models\ProductCategory::create(['clinic_id' => $clinic->id, 'name' => 'Medications']);
        $foodCat = \App\Models\ProductCategory::create(['clinic_id' => $clinic->id, 'name' => 'Pet Food']);

        // Seed some suppliers
        $supplier = \App\Models\Supplier::create([
            'clinic_id' => $clinic->id, 
            'name' => 'Global Vet Supplies',
            'contact_person' => 'Jane Smith',
            'phone' => '555-9876'
        ]);

        // Seed some products
        \App\Models\Product::create([
            'clinic_id' => $clinic->id,
            'product_category_id' => $medsCat->id,
            'supplier_id' => $supplier->id,
            'name' => 'Rabies Vaccine v2',
            'sku' => 'RV-001',
            'cost_price' => 10.00,
            'selling_price' => 25.00,
            'stock_quantity' => 100,
            'low_stock_threshold' => 10
        ]);

        \App\Models\Product::create([
            'clinic_id' => $clinic->id,
            'product_category_id' => $foodCat->id,
            'supplier_id' => $supplier->id,
            'name' => 'Adult Dog Food (Premium)',
            'sku' => 'DF-001',
            'cost_price' => 20.00,
            'selling_price' => 45.00,
            'stock_quantity' => 5,
            'low_stock_threshold' => 10
        ]);
    }
}
