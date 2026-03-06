<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabResult extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'pet_id',
        'vet_id',
        'test_type',
        'date_requested',
        'date_resulted',
        'result_summary',
        'document_url',
        'medical_record_id',
    ];

    protected $casts = [
        'date_requested' => 'date',
        'date_resulted' => 'date',
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
