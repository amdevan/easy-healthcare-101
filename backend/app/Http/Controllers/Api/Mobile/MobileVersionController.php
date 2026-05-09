<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MobileVersionController extends Controller
{
    /**
     * Check app version and status.
     */
    public function check(Request $request)
    {
        return response()->json([
            'android' => [
                'latest_version' => '1.0.0',
                'min_version' => '1.0.0',
                'url' => 'https://play.google.com/store/apps/details?id=com.easyhealthcare101.app',
                'force_update' => false,
            ],
            'ios' => [
                'latest_version' => '1.0.0',
                'min_version' => '1.0.0',
                'url' => 'https://apps.apple.com/app/id123456789',
                'force_update' => false,
            ],
            'maintenance_mode' => false,
            'maintenance_message' => 'We are currently performing maintenance. Please try again later.',
        ]);
    }
}
