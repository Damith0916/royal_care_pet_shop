<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\MultiClinicScope;

class NotificationTemplate extends Model
{
    use MultiClinicScope;
    protected $fillable = [
        'clinic_id',
        'template_type',
        'subject',
        'body',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
