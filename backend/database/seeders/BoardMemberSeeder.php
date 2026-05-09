<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BoardMember;

class BoardMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'Dr. Sarah Johnson',
                'role' => 'Chairperson',
                'bio' => 'Dr. Johnson brings over 25 years of medical and administrative experience to the board.',
                'email' => 'sarah.johnson@example.com',
                'phone' => '+1 (555) 123-4567',
                'photo_path' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500',
                'order' => 1,
                'is_active' => true,
                'links' => [
                    ['platform' => 'linkedin', 'url' => 'https://linkedin.com'],
                    ['platform' => 'twitter', 'url' => 'https://twitter.com'],
                ],
            ],
            [
                'name' => 'Michael Chen',
                'role' => 'Finance Director',
                'bio' => 'Michael is a certified public accountant with a decade of experience in healthcare finance.',
                'email' => 'michael.chen@example.com',
                'phone' => '+1 (555) 987-6543',
                'photo_path' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500',
                'order' => 2,
                'is_active' => true,
                'links' => [
                    ['platform' => 'linkedin', 'url' => 'https://linkedin.com'],
                ],
            ],
            [
                'name' => 'Emily Davis',
                'role' => 'Community Outreach',
                'bio' => 'Emily dedicates her time to building strong relationships between the hospital and the community.',
                'email' => 'emily.davis@example.com',
                'phone' => null,
                'photo_path' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500',
                'order' => 3,
                'is_active' => true,
                'links' => [],
            ],
            [
                'name' => 'James Wilson',
                'role' => 'Legal Advisor',
                'bio' => 'James specializes in healthcare law and ensures compliance with all regulations.',
                'email' => 'james.wilson@example.com',
                'phone' => null,
                'photo_path' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=500',
                'order' => 4,
                'is_active' => true,
                'links' => [
                     ['platform' => 'linkedin', 'url' => 'https://linkedin.com'],
                ],
            ],
        ];

        foreach ($members as $member) {
            BoardMember::firstOrCreate(['name' => $member['name']], $member);
        }
    }
}
