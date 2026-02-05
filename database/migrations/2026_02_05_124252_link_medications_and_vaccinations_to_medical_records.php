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
        Schema::table('medications', function (Blueprint $table) {
            $table->foreignId('medical_record_id')->nullable()->after('vet_id')->constrained()->onDelete('set null');
        });

        Schema::table('vaccinations', function (Blueprint $table) {
            $table->foreignId('medical_record_id')->nullable()->after('administered_by_vet_id')->constrained()->onDelete('set null');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->foreignId('medical_record_id')->nullable()->after('vet_id')->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medications', function (Blueprint $table) {
            $table->dropForeign(['medical_record_id']);
            $table->dropColumn('medical_record_id');
        });

        Schema::table('vaccinations', function (Blueprint $table) {
            $table->dropForeign(['medical_record_id']);
            $table->dropColumn('medical_record_id');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->dropForeign(['medical_record_id']);
            $table->dropColumn('medical_record_id');
        });
    }
};
