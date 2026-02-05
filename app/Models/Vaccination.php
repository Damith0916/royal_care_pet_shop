<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class Vaccination extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'pet_id',
        'vaccine_type',
        'date_given',
        'next_due_date',
        'administered_by_vet_id',
        'medical_record_id',
    ];

    protected $casts = [
        'date_given' => 'date',
        'next_due_date' => 'date',
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
        return $this->belongsTo(User::class, 'administered_by_vet_id');
    }

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
