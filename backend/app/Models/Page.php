<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'hero_image',
        'seo_title',
        'seo_description',
        'is_active',
        'open_in_new_tab',
        'sort_order',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
        'open_in_new_tab' => 'boolean',
    ];
}
