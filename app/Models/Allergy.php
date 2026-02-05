<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\MultiClinicScope;

class Allergy extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'pet_id',
        'allergy_name',
        'severity',
        'notes',
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
