<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class InjectionCategorySeeder extends Seeder
{
    public function run(): void
    {
        $clinics = Clinic::all();
        foreach ($clinics as $clinic) {
            ProductCategory::firstOrCreate(
                ['clinic_id' => $clinic->id, 'name' => 'Injections']
            );
            ProductCategory::firstOrCreate(
                ['clinic_id' => $clinic->id, 'name' => 'Vaccines']
            );
        }
    }
}
