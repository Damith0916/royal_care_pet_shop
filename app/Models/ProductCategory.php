<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\MultiClinicScope;

class ProductCategory extends Model
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

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
