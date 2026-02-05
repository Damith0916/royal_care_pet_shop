<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\MultiClinicScope;

class ServiceCategory extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'name',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
