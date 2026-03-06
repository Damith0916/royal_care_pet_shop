<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Condition extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'pet_id',
        'condition_name',
        'diagnosis_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'diagnosis_date' => 'date',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
