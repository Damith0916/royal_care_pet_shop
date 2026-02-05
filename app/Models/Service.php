<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class Service extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'service_category_id',
        'name',
        'description',
        'cost',
        'duration_minutes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }
}
