<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->json('clinical_signs')->nullable()->after('reason_for_visit');
            $table->json('lab_findings')->nullable()->after('clinical_signs');
            $table->text('differential_diagnosis')->nullable()->after('lab_findings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropColumn(['clinical_signs', 'lab_findings', 'differential_diagnosis']);
        });
    }
};
