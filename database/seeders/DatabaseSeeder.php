<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $now = now();

        // 1. Clinic
        $clinicId = DB::table('clinics')->insertGetId([
            'name' => 'SmartPetCare Clinic',
            'tagline' => 'Precision Veterinary Care',
            'address' => 'No 1, Vet Street',
            'phone' => '0712345678',
            'email' => 'admin@smartpetcare.com',
            'tax_rate' => 8.0,
            'default_currency' => 'LKR',
            'is_active' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 2. Role
        $roleId = DB::table('roles')->insertGetId([
            'name' => 'Admin',
            'description' => 'System Administrator with full access',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 3. Permissions
        $permissions = [
            'can_view_dashboard', 'can_manage_pets',
            'can_manage_owners', 'can_manage_staff', 'can_manage_inventory',
            'can_manage_billing', 'can_view_reports', 'can_manage_settings',
        ];
        foreach ($permissions as $p) {
            $permId = DB::table('permissions')->insertGetId([
                'name' => $p, 'created_at' => $now, 'updated_at' => $now,
            ]);
            DB::table('role_permissions')->insert([
                'role_id' => $roleId, 'permission_id' => $permId,
                'created_at' => $now, 'updated_at' => $now,
            ]);
        }

        // 4. Admin User
        DB::table('users')->insert([
            'clinic_id' => $clinicId,
            'role_id' => $roleId,
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'name' => 'Admin',
            'email' => 'admin@smartpetcare.com',
            'password' => Hash::make('password'),
            'is_active' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 5. Species
        $dogId = DB::table('species')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Dog', 'created_at' => $now, 'updated_at' => $now]);
        $catId = DB::table('species')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Cat', 'created_at' => $now, 'updated_at' => $now]);

        // 6. Service Categories & Services
        $genCatId = DB::table('service_categories')->insertGetId(['clinic_id' => $clinicId, 'name' => 'General', 'created_at' => $now, 'updated_at' => $now]);
        DB::table('services')->insert([
            ['clinic_id' => $clinicId, 'service_category_id' => $genCatId, 'name' => 'General Checkup', 'cost' => 1500.00, 'duration_minutes' => 30, 'created_at' => $now, 'updated_at' => $now],
            ['clinic_id' => $clinicId, 'service_category_id' => $genCatId, 'name' => 'Vaccination', 'cost' => 1200.00, 'duration_minutes' => 15, 'created_at' => $now, 'updated_at' => $now],
            ['clinic_id' => $clinicId, 'service_category_id' => $genCatId, 'name' => 'Consultation', 'cost' => 800.00, 'duration_minutes' => 20, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 7. Product Categories
        $medsCatId = DB::table('product_categories')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Medications', 'created_at' => $now, 'updated_at' => $now]);
        $injCatId = DB::table('product_categories')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Injections', 'created_at' => $now, 'updated_at' => $now]);
        $vacCatId = DB::table('product_categories')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Vaccines',   'created_at' => $now, 'updated_at' => $now]);
        $foodCatId = DB::table('product_categories')->insertGetId(['clinic_id' => $clinicId, 'name' => 'Pet Food',   'created_at' => $now, 'updated_at' => $now]);

        // 8. Supplier
        $supplierId = DB::table('suppliers')->insertGetId([
            'clinic_id' => $clinicId, 'name' => 'Global Vet Supplies',
            'contact_person' => 'Jane Smith', 'phone' => '555-9876',
            'created_at' => $now, 'updated_at' => $now,
        ]);
    }
}
