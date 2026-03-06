<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicCustomPetField extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'field_name',
        'field_type',
        'field_options_json',
        'is_required',
    ];

    protected $casts = [
        'field_options_json' => 'array',
        'is_required' => 'boolean',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
