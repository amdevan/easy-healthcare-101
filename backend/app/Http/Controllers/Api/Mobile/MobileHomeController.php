<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\Article;

class MobileHomeController extends Controller
{
    /**
     * Get data for mobile home screen.
     */
    public function index()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get();

        $specialties = Specialty::where('is_active', true)
            ->limit(10)
            ->get();

        $topDoctors = Doctor::where('is_active', true)
            ->with('specialty') // Eager load specialty
            ->orderByDesc('rating')
            ->limit(5)
            ->get();
            
        $latestArticles = Article::latest()
            ->limit(5)
            ->get();

        return response()->json([
            'banners' => $banners,
            'specialties' => $specialties,
            'top_doctors' => $topDoctors,
            'latest_articles' => $latestArticles,
        ]);
    }
}
