<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    use MultiClinicScope;

    protected $table = 'medical_records';

    protected $fillable = [
        'clinic_id',
        'pet_id',
        'vet_id',
        'invoice_id',
        'date_of_record',
        'complane',
        'clinical_signs',
        'lab_findings',
        'patient_history',
        'differential_diagnosis',
        'diagnosis',
        'treatment_plan',
        'observations',
        'weight_kg',
        'blood_pressure',
        'status',
        'rx_note',
    ];

    protected $casts = [
        'date_of_record' => 'datetime',
        'complane' => 'array',
        'clinical_signs' => 'array',
        'lab_findings' => 'array',
        'patient_history' => 'array',
        'differential_diagnosis' => 'array',
        'weight_kg' => 'decimal:2',
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

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
