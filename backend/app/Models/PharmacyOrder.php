<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'email',
        'note',
        'prescription_path',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'status' => 'string',
    ];
}
