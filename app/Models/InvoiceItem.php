<?php

namespace App\Models;

use App\Traits\MultiClinicScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use MultiClinicScope;

    protected $fillable = [
        'clinic_id',
        'invoice_id',
        'item_type',
        'item_id',
        'item_name',
        'quantity',
        'unit_price_at_sale',
        'line_total',
    ];

    protected $casts = [
        'unit_price_at_sale' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'item_id');
    }
}
