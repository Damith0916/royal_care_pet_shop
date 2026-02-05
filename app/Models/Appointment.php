<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\MultiClinicScope;

class Appointment extends Model
{
    use MultiClinicScope, SoftDeletes;
    
    protected $fillable = [
        'clinic_id',
        'pet_id',
        'owner_id',
        'vet_id',
        'datetime',
        'status',
        'notes',
        'reason_for_visit',
        'reminder_sent',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'reminder_sent' => 'boolean',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }

    public function vet(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vet_id');
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'appointment_services')
            ->withPivot('service_cost_at_time');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
