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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('clinic_id')->after('id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->after('clinic_id')->nullable()->constrained()->onDelete('set null');
            $table->string('first_name')->after('role_id')->nullable();
            $table->string('last_name')->after('first_name')->nullable();
            $table->string('phone')->after('email')->nullable();
            $table->string('specialization')->after('phone')->nullable();
            $table->json('working_hours_json')->after('specialization')->nullable();
            $table->boolean('is_active')->after('working_hours_json')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('clinic_id');
            $table->dropConstrainedForeignId('role_id');
            $table->dropColumn(['first_name', 'last_name', 'phone', 'specialization', 'working_hours_json', 'is_active']);
        });
    }
};
