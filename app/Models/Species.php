<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Species extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'name',
    ];

    public function breeds(): HasMany
    {
        return $this->hasMany(Breed::class);
    }

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }
}
