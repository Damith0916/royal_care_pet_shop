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
        Schema::rename('health_records', 'medical_records');

        Schema::table('medical_records', function (Blueprint $table) {
            $table->string('blood_pressure')->nullable()->after('temperature_c');
            $table->enum('status', ['Resolved', 'Ongoing', 'Follow-up Needed'])->default('Resolved')->after('blood_pressure');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropColumn(['blood_pressure', 'status']);
        });

        Schema::rename('medical_records', 'health_records');
    }
};
