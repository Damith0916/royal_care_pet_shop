<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class Medication extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'pet_id',
        'vet_id',
        'date_prescribed',
        'drug_name',
        'dosage',
        'frequency',
        'duration_days',
        'medical_record_id',
    ];

    protected $casts = [
        'date_prescribed' => 'datetime',
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

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
