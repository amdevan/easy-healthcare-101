<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Health check endpoint for Coolify and monitoring
     */
    public function check()
    {
        try {
            // Check database connection
            DB::connection()->getPdo();
            $dbStatus = 'healthy';
        } catch (\Exception $e) {
            $dbStatus = 'unhealthy';
        }

        $status = $dbStatus === 'healthy' ? 'healthy' : 'degraded';
        $httpCode = $status === 'healthy' ? 200 : 503;

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => $dbStatus,
                'application' => 'healthy',
            ],
        ], $httpCode);
    }
}
