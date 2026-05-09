<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Route::get('/', function () {
    return response()->json(['message' => 'Easy Healthcare 101 Backend API is running']);
});

Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);

    if (!file_exists($filePath)) {
        abort(404);
    }

    return response()->file($filePath);
})->where('path', '.*');

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

// --- DEBUG / RESCUE ROUTE ---
Route::get('/debug-session', function () {
    $session = session();
    $session->put('test_key', 'test_value_' . time());
    $session->save();
    
    return [
        'session_id' => $session->getId(),
        'test_value' => $session->get('test_key'),
        'cookie_config' => config('session'),
        'cookies_received' => request()->cookies->all(),
        'user' => Auth::user(),
    ];
});

// removed debug-ini route

Route::get('/reset-admin', function () {
    try {
        Artisan::call('config:clear');
        
        $output = "<h1>Admin User Diagnostic & Reset</h1>";
        
        // 1. Check Database Connection
        try {
            DB::connection()->getPdo();
            $output .= "<p>✅ Database Connected Successfully.</p>";
        } catch (\Exception $e) {
            return "❌ Database Connection Failed: " . $e->getMessage();
        }
        
        // 2. Find or Create Admin
        $user = User::where('email', 'admin@example.com')->first();
        
        if ($user) {
            $user->password = Hash::make('password');
            $user->save();
            $output .= "<p>✅ Admin user found. Password reset to: <strong>password</strong></p>";
        } else {
            try {
                $user = User::create([
                    'name' => 'Admin',
                    'email' => 'admin@example.com',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]);
                $output .= "<p>✅ Admin user was missing. Created new admin with password: <strong>password</strong></p>";
            } catch (\Exception $e) {
                $output .= "<p>❌ Failed to create admin user: " . $e->getMessage() . "</p>";
            }
        }
        
        if ($user) {
            $output .= "<h3>Login Credentials:</h3>";
            $output .= "<ul>";
            $output .= "<li>Email: <strong>admin@example.com</strong></li>";
            $output .= "<li>Password: <strong>password</strong></li>";
            $output .= "</ul>";
            $output .= "<p><a href='/admin/login' target='_blank'>Go to Admin Login</a></p>";
        }

        return $output;
        
    } catch (\Exception $e) {
        return "Critical Error: " . $e->getMessage();
    }
});

// --- DATABASE SETUP ROUTE (Temporary for cPanel) ---
Route::get('/setup-database', function () {
    try {
        // Clear config cache first to ensure we read fresh .env
        Artisan::call('config:clear');
        
        $output = "--- Debug Info ---\n";
        $output .= "Environment: " . app()->environment() . "\n";
        $output .= "DB Connection (Config): " . config('database.default') . "\n";
        
        // Check .env content directly (masking sensitive data)
        $envPath = base_path('.env');
        if (file_exists($envPath)) {
            $envContent = file_get_contents($envPath);
            preg_match('/^DB_CONNECTION=(.*)$/m', $envContent, $matches);
            $dbConnectionEnv = $matches[1] ?? 'NOT FOUND';
            $output .= "DB_CONNECTION in .env: " . trim($dbConnectionEnv) . "\n";
            
            preg_match('/^DB_DATABASE=(.*)$/m', $envContent, $matches);
            $output .= "DB_DATABASE in .env: " . trim($matches[1] ?? 'NOT FOUND') . "\n";
        } else {
             $output .= "WARNING: .env file not found at " . $envPath . "\n";
        }
        
        $output .= "------------------\n\n";

        if (config('database.default') === 'sqlite') {
            $output .= "❌ ERROR: Application is still using SQLite.\n";
            $output .= "Please ensure your .env file has: DB_CONNECTION=mysql\n";
            $output .= "And that you have renamed .env.example to .env\n";
            return '<pre>' . $output . '</pre>';
        }

        // Run Migrations
        Artisan::call('migrate', ['--force' => true]);
        $output .= "Migrations:\n" . Artisan::output();

        // Run Seeders
        Artisan::call('db:seed', ['--force' => true]);
        $output .= "\nSeeders:\n" . Artisan::output();

        // Link Storage
        Artisan::call('storage:link');
        $output .= "\nStorage Link:\n" . Artisan::output();

        // Clear Caches again to be safe
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        $output .= "\nCache Cleared.";

        return '<pre>' . $output . '</pre>';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage() . '<br><pre>' . $e->getTraceAsString() . '</pre>';
    }
});

// --- SPECIFIC SEEDER ROUTE (For Board of Directors) ---
Route::get('/seed-board-page', function () {
    try {
        Artisan::call('optimize:clear');
        $output = "Cache Cleared.\n";

        Artisan::call('migrate', ['--force' => true]);
        $output .= "Migrations:\n" . Artisan::output();

        Artisan::call('db:seed', ['--class' => 'PageSeeder', '--force' => true]);
        $output .= "\nPageSeeder:\n" . Artisan::output();

        Artisan::call('db:seed', ['--class' => 'BoardMemberSeeder', '--force' => true]);
        $output .= "\nBoardMemberSeeder:\n" . Artisan::output();

        return "<h1>Success!</h1><p>Board of Directors page and members have been seeded.</p><pre>" . $output . "</pre>";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});

Route::get('/debug-routes', function () {
    $routes = [];
    foreach (Illuminate\Support\Facades\Route::getRoutes() as $route) {
        if (str_contains($route->uri(), 'board') || str_contains($route->uri(), 'api')) {
             $routes[] = $route->uri() . ' (' . implode('|', $route->methods()) . ')';
        }
    }
    return $routes;
});
// ---------------------------------------------------

// Serve React App for any other route (SPA Fallback)
Route::fallback(function () {
    // If the request expects JSON or is an API route, return 404 JSON.
    // This prevents API 404s from returning HTML.
    if (request()->expectsJson() || request()->is('api/*')) {
        return response()->json([
            'message' => 'Not Found',
            'path' => request()->path(),
            'debug' => 'Route not registered in Laravel'
        ], 404);
    }

    $path = public_path('index.html');
    if (!file_exists($path)) {
       // If frontend not built yet, fall back to simple message or 404
       abort(404, 'Frontend build not found.');
    }
    return file_get_contents($path);
});



// Local-only helper: login as the seeded admin and redirect to Filament
if (app()->environment('local')) {
    Route::get('/dev/login-as-admin', function () {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );
        Auth::login($user);
        Log::info('Dev login-as-admin executed', ['user_id' => $user->id, 'session_id' => session()->getId()]);
        return redirect('/admin');
    });

    Route::get('/dev/whoami', function () {
        $user = Auth::user();
        return response()->json([
            'auth' => Auth::check(),
            'user' => $user ? [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ] : null,
            'session_id' => session()->getId(),
        ]);
    });

    // Local-only simple login to bypass Livewire / asset issues
    Route::get('/dev/simple-login', function () {
        return view('dev.simple-login');
    })->name('dev.simple-login');

    Route::post('/dev/simple-login', function () {
        $credentials = request()->only('email', 'password');
        if (Auth::attempt($credentials)) {
            request()->session()->regenerate();
            return redirect('/admin');
        }
        return back()->withErrors(['email' => 'Invalid credentials'])->withInput();
    });

    // Admin auth debug to verify session when accessing the panel
    Route::get('/admin/debug', function () {
        $user = Auth::user();
        return response()->json([
            'auth' => Auth::check(),
            'user' => $user ? [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ] : null,
            'session_id' => session()->getId(),
        ]);
    });
}
