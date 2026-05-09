<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UiSetting;

class TestimonialSectionSeeder extends Seeder
{
    public function run(): void
    {
        UiSetting::updateOrCreate(
            ['key' => 'testimonial_section'],
            [
                'value' => [
                    'title' => 'Success Stories',
                    'subtitle' => 'Trusted by Families'
                ]
            ]
        );
    }
}
