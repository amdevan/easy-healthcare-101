<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageRequest extends Model
{
    protected $fillable = [
        'patient_id',
        'request_id',
        'patient_name',
        'package_name',
        'booking_name',
        'booking_email',
        'booking_phone',
        'relation',
        'is_for_self',
        'add_ons',
        'email',
        'phone',
        'address',
        'requested_date',
        'status',
    ];

    protected $casts = [
        'requested_date' => 'date',
        'is_for_self' => 'boolean',
        'add_ons' => 'array',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
