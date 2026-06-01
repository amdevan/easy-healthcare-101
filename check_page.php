<?php
require __DIR__ . '/backend/vendor/autoload.php';
$app = require_once __DIR__ . '/backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$page = App\Models\Page::where('slug', 'easy-care-365')->first();
if ($page) {
    echo "Slug: " . $page->slug . "\n";
    echo "Active: " . ($page->is_active ? 'Yes' : 'No') . "\n";
    echo "Content Length: " . strlen(json_encode($page->content)) . "\n";
} else {
    echo "Page not found with slug: easy-care-365\n";
    $allPages = App\Models\Page::select('slug', 'title', 'is_active')->get();
    echo "Available pages:\n";
    foreach ($allPages as $p) {
        echo "- " . $p->slug . " (" . $p->title . ") Active: " . ($p->is_active ? 'Yes' : 'No') . "\n";
    }
}
