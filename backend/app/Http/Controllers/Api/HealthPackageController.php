<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;

class HealthPackageController extends Controller
{
    /**
     * Get a specific health package by ID from the CMS content.
     */
    public function show($id)
    {
        // 1. Fetch the health-package page
        $page = Page::where('slug', 'health-package')->first();

        if (!$page || empty($page->content)) {
            return response()->json(['message' => 'Health packages configuration not found'], 404);
        }

        // 2. Find the packages_section
        $packagesBlock = collect($page->content)->firstWhere('type', 'packages_section');

        if (!$packagesBlock || empty($packagesBlock['data']['packages'])) {
            return response()->json(['message' => 'No packages found'], 404);
        }

        // 3. Find the specific package by ID
        $package = collect($packagesBlock['data']['packages'])->firstWhere('id', $id);

        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        // 4. Return the package data
        // Fetch add-ons from the CMS block, fallback to default if empty
        $addOns = $packagesBlock['data']['add_ons'] ?? [];
        
        if (empty($addOns)) {
            $addOns = [
                ['id' => 'home_sample', 'name' => 'Home Sample Collection', 'price' => 500],
                ['id' => 'hard_copy_report', 'name' => 'Hard Copy Report Delivery', 'price' => 300],
                ['id' => 'doctor_consult', 'name' => 'Specialist Consultation', 'price' => 1000],
            ];
        }

        return response()->json([
            'package' => $package,
            'customization_options' => [
                'add_ons' => $addOns
            ]
        ]);
    }
}
