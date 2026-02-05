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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('owner_id')->nullable()->constrained('owners')->onDelete('cascade');
            $table->enum('notification_type', ['AppointmentReminder', 'LowStock', 'VaccinationDue', 'LabResultReady', 'SystemAlert']);
            $table->text('message');
            $table->date('target_date')->nullable();
            $table->boolean('is_sent')->default(false);
            $table->dateTime('sent_timestamp')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
