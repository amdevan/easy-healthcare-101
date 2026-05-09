<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ManagementTeam;

class ManagementTeamSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'John Doe',
                'role' => 'Chief Executive Officer',
                'bio' => '<p>John has over 20 years of experience in healthcare management and strategic planning.</p>',
                'photo_path' => null, // Placeholder or null
                'order' => 1,
                'is_active' => true,
                'links' => [
                    ['label' => 'LinkedIn', 'href' => 'https://linkedin.com'],
                    ['label' => 'Twitter', 'href' => 'https://twitter.com'],
                ],
            ],
            [
                'name' => 'Jane Smith',
                'role' => 'Chief Operations Officer',
                'bio' => '<p>Jane leads the operational excellence of our healthcare facilities across the country.</p>',
                'photo_path' => null,
                'order' => 2,
                'is_active' => true,
                'links' => [
                    ['label' => 'LinkedIn', 'href' => 'https://linkedin.com'],
                ],
            ],
            [
                'name' => 'Dr. Robert Brown',
                'role' => 'Chief Medical Officer',
                'bio' => '<p>Dr. Brown ensures the highest standards of clinical care and medical protocols.</p>',
                'photo_path' => null,
                'order' => 3,
                'is_active' => true,
                'links' => [],
            ],
        ];

        foreach ($members as $member) {
            ManagementTeam::create($member);
        }
    }
}
