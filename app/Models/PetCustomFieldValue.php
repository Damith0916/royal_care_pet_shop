<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class PetCustomFieldValue extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'pet_id',
        'field_id',
        'field_value',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(ClinicCustomPetField::class, 'field_id');
    }
}
