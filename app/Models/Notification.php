<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class Notification extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'user_id',
        'owner_id',
        'notification_type',
        'message',
        'target_date',
        'is_sent',
        'sent_timestamp',
    ];

    protected $casts = [
        'target_date' => 'date',
        'is_sent' => 'boolean',
        'sent_timestamp' => 'datetime',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
