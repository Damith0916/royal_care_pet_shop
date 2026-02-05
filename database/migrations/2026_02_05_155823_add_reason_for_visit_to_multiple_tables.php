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
            $table->string('reason_for_visit')->nullable()->after('vet_id');
            $table->foreignId('appointment_id')->nullable()->after('id')->constrained()->onDelete('set null');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reason_for_visit')->nullable()->after('vet_id');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->string('reason_for_visit')->nullable()->after('appointment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropForeign(['appointment_id']);
            $table->dropColumn(['reason_for_visit', 'appointment_id']);
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('reason_for_visit');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('reason_for_visit');
        });
    }
};
