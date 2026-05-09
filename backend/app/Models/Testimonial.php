<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_name',
        'location',
        'author_role',
        'image',
        'content',
        'rating',
        'order',
        'is_active',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }
        return url('storage/' . $this->image);
    }
}