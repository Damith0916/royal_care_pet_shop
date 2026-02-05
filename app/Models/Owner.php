<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\MultiClinicScope;

class Owner extends Model
{
    use MultiClinicScope, SoftDeletes;
    protected $fillable = [
        'clinic_id',
        'first_name',
        'last_name',
        'address',
        'phone',
        'email',
        'portal_access_enabled',
        'portal_password',
        'unique_owner_code',
    ];

    protected $hidden = [
        'portal_password',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
