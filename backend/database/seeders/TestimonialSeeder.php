<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'content' => "Living in Sydney, I was constantly worried about my mother's diabetes management in Kathmandu. Easy Care 365 has been a godsend. The weekly nurse visits and detailed reports give me total peace of mind.",
                'author_name' => "Sushil K.",
                'location' => "Sydney, Australia",
                'author_role' => "Son of 72-year-old member",
                'image' => "https://randomuser.me/api/portraits/men/32.jpg",
                'rating' => 5,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'content' => "The emergency coordination was incredible. When my father had a fall, the Care Coordinator was at the hospital before I could even book a flight. They handled everything professionally and with such kindness.",
                'author_name' => "Anjali S.",
                'location' => "New York, USA",
                'author_role' => "Daughter of 80-year-old member",
                'image' => "https://randomuser.me/api/portraits/women/44.jpg",
                'rating' => 5,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'content' => "I didn't realize how much logistics goes into medical care until I started using this service. No more queuing for appointments or running around for medicines. It's all done for us.",
                'author_name' => "Rajesh M.",
                'location' => "London, UK",
                'author_role' => "Son of 68-year-old member",
                'image' => "https://randomuser.me/api/portraits/men/86.jpg",
                'rating' => 5,
                'order' => 3,
                'is_active' => true,
            ]
        ];

        foreach ($items as $i) {
            Testimonial::updateOrCreate(['author_name' => $i['author_name']], $i);
        }
    }
}
