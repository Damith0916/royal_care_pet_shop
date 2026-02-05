<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\MultiClinicScope;

class MedicalRecord extends Model
{
    use MultiClinicScope;
    
    protected $table = 'medical_records';
    
    protected $fillable = [
        'clinic_id',
        'pet_id',
        'vet_id',
        'appointment_id',
        'invoice_id',
        'date_of_record',
        'reason_for_visit',
        'diagnosis',
        'treatment_plan',
        'observations',
        'weight_kg',
        'temperature_c',
        'blood_pressure',
        'status',
    ];

    protected $casts = [
        'date_of_record' => 'datetime',
        'weight_kg' => 'decimal:2',
        'temperature_c' => 'decimal:2',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function vet(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vet_id');
    }

    public function medications(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Medication::class);
    }

    public function vaccinations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    public function labResults(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LabResult::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
