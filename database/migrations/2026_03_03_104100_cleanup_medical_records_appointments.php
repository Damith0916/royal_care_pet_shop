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
            if (Schema::hasColumn('medical_records', 'appointment_id')) {
                $table->dropForeign(['appointment_id']);
                $table->dropColumn('appointment_id');
            }
            if (Schema::hasColumn('medical_records', 'reason_for_visit')) {
                $table->dropColumn('reason_for_visit');
            }
        });

        Schema::table('invoices', function (Blueprint $table) {
            if (Schema::hasColumn('invoices', 'reason_for_visit')) {
                $table->dropColumn('reason_for_visit');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->foreignId('appointment_id')->nullable()->constrained()->onDelete('set null');
            $table->string('reason_for_visit')->nullable();
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->string('reason_for_visit')->nullable();
        });
    }
};
