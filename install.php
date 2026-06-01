<?php
// install.php - Easy Healthcare 101 Auto-Installer v2.0
// Features: Auto-path detection, Permission Fixer, Debug Mode, Filament Admin Creation

error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- Configuration & Helpers ---

// 1. Detect Backend Path
// We look for 'vendor/autoload.php' to confirm the root
$possiblePaths = [
    __DIR__ . '/../backend_app',       // Recommended structure (sibling)
    __DIR__ . '/../backend_core',      // Legacy structure
    __DIR__ . '/..',                   // Standard Laravel (public/ inside root)
    __DIR__ . '/backend_app',          // Subfolder
    __DIR__ . '/backend',              // Subfolder
];

$corePath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path . '/vendor/autoload.php') && file_exists($path . '/bootstrap/app.php')) {
        $corePath = realpath($path);
        break;
    }
}

if (!$corePath) {
    die("<h1>Fatal Error: Backend Not Found</h1><p>Could not locate the Laravel backend directory. Tried: " . implode(', ', $possiblePaths) . "</p><p>Please ensure you uploaded the 'backend_app' folder correctly.</p>");
}

$envPath = $corePath . '/.env';
$envExamplePath = $corePath . '/.env.example';

session_start();
$step = $_GET['step'] ?? 1;
$error = '';
$success = '';

// Helper: Update .env
function updateEnv($data, $envPath) {
    $content = file_exists($envPath) ? file_get_contents($envPath) : '';
    foreach ($data as $key => $value) {
        if (!is_bool($value) && !is_numeric($value)) {
            $value = '"' . str_replace('"', '\"', $value) . '"';
        }
        $value = $value === true ? 'true' : ($value === false ? 'false' : $value);
        
        if (preg_match("/^$key=/m", $content)) {
            $content = preg_replace("/^$key=.*$/m", "$key=$value", $content);
        } else {
            $content .= "\n$key=$value";
        }
    }
    file_put_contents($envPath, $content);
}

// Helper: Get .env values
function getEnvValues($envPath) {
    if (!file_exists($envPath)) return [];
    $content = file_get_contents($envPath);
    $lines = explode("\n", $content);
    $values = [];
    foreach ($lines as $line) {
        if (trim($line) === '' || strpos(trim($line), '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            $value = trim($value, '"\'');
            $values[$key] = $value;
        }
    }
    return $values;
}

// Helper: Test DB Connection
function testDbConnection($envPath) {
    $env = getEnvValues($envPath);
    if (empty($env['DB_HOST'])) return ['success' => false, 'message' => 'Not configured'];
    try {
        $dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']}";
        $pdo = new PDO($dsn, $env['DB_USERNAME'], $env['DB_PASSWORD']);
        return ['success' => true, 'message' => 'Connected'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

// Helper: Bootstrap Laravel
function bootstrapLaravel($corePath) {
    if (!defined('LARAVEL_START')) define('LARAVEL_START', microtime(true));
    require $corePath . '/vendor/autoload.php';
    $app = require_once $corePath . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    return $app;
}

// Helper: Recursive Copy
function recurseCopy($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                recurseCopy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

// Helper: Manual Key Generation
function generateAppKey($envPath) {
    $key = 'base64:' . base64_encode(random_bytes(32));
    updateEnv(['APP_KEY' => $key], $envPath);
    return $key;
}

// --- Action Handling ---

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Generate Key Action
    if ($action === 'generate_key') {
        try {
            generateAppKey($envPath);
            $success = "✅ Application Key generated successfully!";
        } catch (Exception $e) {
            $error = "❌ Failed to generate key: " . $e->getMessage();
        }
    }

    // Step 1: Requirements & Permissions
    if ($action === 'check_reqs') {
        // Try to fix permissions if requested
        if (isset($_POST['fix_permissions'])) {
            $dirs = [
                $corePath . '/storage',
                $corePath . '/storage/app',
                $corePath . '/storage/framework',
                $corePath . '/storage/logs',
                $corePath . '/bootstrap/cache'
            ];
            foreach ($dirs as $dir) {
                if (file_exists($dir)) {
                    @chmod($dir, 0775);
                }
            }
        }
        header("Location: ?step=2");
        exit;
    }

    // Step 2: Database
    if ($action === 'save_db') {
        try {
            $dsn = "mysql:host={$_POST['db_host']};port={$_POST['db_port']};dbname={$_POST['db_name']}";
            $pdo = new PDO($dsn, $_POST['db_user'], $_POST['db_pass']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Check if tables exist
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $hasTables = count($tables) > 0;
            
            // If user confirmed overwrite or no tables, proceed
            if (!$hasTables || isset($_POST['confirm_overwrite'])) {
                // Create .env if missing
                if (!file_exists($envPath) && file_exists($envExamplePath)) {
                    copy($envExamplePath, $envPath);
                }

                updateEnv([
                    'APP_DEBUG' => 'true', // Enable debug by default during install
                    'DB_CONNECTION' => 'mysql', // Force MySQL
                    'DB_HOST' => $_POST['db_host'],
                    'DB_PORT' => $_POST['db_port'],
                    'DB_DATABASE' => $_POST['db_name'],
                    'DB_USERNAME' => $_POST['db_user'],
                    'DB_PASSWORD' => $_POST['db_pass'],
                ], $envPath);

                $_SESSION['db_configured'] = true;
                header("Location: ?step=3");
                exit;
            } else {
                $error = "⚠️ Warning: The database '{$_POST['db_name']}' is not empty. Proceeding may overwrite existing data. Check the box below to confirm.";
                $showOverwriteConfirm = true;
            }
        } catch (Exception $e) {
            $error = "❌ Database Error: " . $e->getMessage();
        }
    }

    // Step 3: App Settings
    if ($action === 'save_app') {
        $appUrl = rtrim($_POST['app_url'], '/');
        $appUrlHost = parse_url($appUrl, PHP_URL_HOST);
        
        // Derive root domain for session (e.g., admin.example.com -> .example.com)
        $parts = explode('.', $appUrlHost);
        $count = count($parts);
        $rootDomain = ($count > 2) ? '.' . $parts[$count-2] . '.' . $parts[$count-1] : '.' . $appUrlHost;

        updateEnv([
            'APP_NAME' => '"Easy Healthcare 101"',
            'APP_ENV' => 'production',
            'APP_URL' => $appUrl,
            'FRONTEND_URL' => $appUrl, // Same as App URL for single domain
            'SANCTUM_STATEFUL_DOMAINS' => $appUrlHost,
            'SESSION_DOMAIN' => $rootDomain,
            'FILESYSTEM_DISK' => 'public',
        ], $envPath);
        header("Location: ?step=4");
        exit;
    }

    // Run Migrations Action
    if ($action === 'run_migrations') {
        try {
            bootstrapLaravel($corePath);
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            $success = "✅ Migrations run successfully!\n" . \Illuminate\Support\Facades\Artisan::output();
        } catch (Exception $e) {
            $error = "❌ Failed to run migrations: " . $e->getMessage();
        }
    }

    // Fix Storage Link Action
    if ($action === 'fix_storage') {
        try {
            bootstrapLaravel($corePath);
            if (file_exists($corePath . '/public/storage')) {
                @unlink($corePath . '/public/storage');
            }
            \Illuminate\Support\Facades\Artisan::call('storage:link');
            $success = "✅ Storage link recreated successfully!";
        } catch (Exception $e) {
            $error = "❌ Failed to link storage: " . $e->getMessage();
        }
    }

    // Clear Cache Action
    if ($action === 'clear_cache') {
        try {
            bootstrapLaravel($corePath);
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('cache:clear');
            \Illuminate\Support\Facades\Artisan::call('view:clear');
            $success = "✅ Cache cleared successfully!";
        } catch (Exception $e) {
            $error = "❌ Failed to clear cache: " . $e->getMessage();
        }
    }

    // Step 4: Installation (Migrate & Seed)
    if ($action === 'install_core') {
        try {
            set_time_limit(300);
            bootstrapLaravel($corePath);
            
            $output = "Starting Installation...\n";
            
            // Generate Key
            try {
                \Illuminate\Support\Facades\Artisan::call('key:generate', ['--force' => true]);
                $output .= "Key Generated via Artisan.\n";
            } catch (Exception $e) {
                $output .= "⚠️ Artisan Key Generation failed, attempting manual generation...\n";
                generateAppKey($envPath);
                $output .= "Manual Key Generated.\n";
            }

            // Migrate
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            $output .= \Illuminate\Support\Facades\Artisan::output();

            // Seed
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
            $output .= \Illuminate\Support\Facades\Artisan::output();

            // Filament Upgrade (Publish Assets & Icons)
            $output .= "Upgrading Filament...\n";
            try {
                \Illuminate\Support\Facades\Artisan::call('filament:upgrade');
                $output .= \Illuminate\Support\Facades\Artisan::output();
            } catch (Exception $e) {
                $output .= "⚠️ Filament Upgrade Warning: " . $e->getMessage() . "\n";
            }

            // Filament Optimize
            try {
                \Illuminate\Support\Facades\Artisan::call('filament:optimize');
                $output .= "Filament Optimized.\n";
            } catch (Exception $e) {
                // Ignore optimization errors in some environments
            }

            // Sync Assets (Critical for cPanel where public is separate)
            $output .= "Syncing assets to public root...\n";
            $publicAssets = ['build', 'css', 'js', 'filament', 'images'];
            $sourcePublic = $corePath . '/public';
            $destPublic = __DIR__;

            foreach ($publicAssets as $asset) {
                if (file_exists($sourcePublic . '/' . $asset)) {
                    // Recursive copy function
                    $output .= "Syncing $asset...\n";
                    recurseCopy($sourcePublic . '/' . $asset, $destPublic . '/' . $asset);
                }
            }

            // Storage Link
            if (file_exists($corePath . '/public/storage')) {
                $output .= "Storage link already exists.\n";
            } else {
                \Illuminate\Support\Facades\Artisan::call('storage:link');
                $output .= "Storage Linked.\n";
            }

            // Clear Cache
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            $output .= "Cache Cleared.\n";

            $_SESSION['install_log'] = $output;
            header("Location: ?step=5");
            exit;
        } catch (Exception $e) {
            $error = "❌ Installation Failed: " . $e->getMessage() . "\n\nTrace:\n" . $e->getTraceAsString();
        }
    }

    // Step 5: Admin User
    if ($action === 'create_admin') {
        try {
            bootstrapLaravel($corePath);
            $user = \App\Models\User::firstOrNew(['email' => $_POST['email']]);
            $user->name = $_POST['name'];
            $user->password = bcrypt($_POST['password']);
            $user->save();
            
            // Assign Admin Role (Custom Role System)
            $role = \App\Models\Role::where('slug', 'admin')->first();
            
            if (!$role) {
                // Create Admin Role if it doesn't exist (Backup)
                $role = \App\Models\Role::create([
                    'name' => 'Super Admin',
                    'slug' => 'admin',
                    'permissions' => [], // Admin gets all permissions via isAdmin() check
                ]);
            }
            
            $user->role_id = $role->id;
            $user->save();

            header("Location: ?step=6");
            exit;
        } catch (Exception $e) {
            $error = "❌ Failed to create admin: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation Wizard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-lg">
        <!-- Header -->
        <div class="text-center">
            <h1 class="text-3xl font-extrabold text-gray-900">Installation Wizard</h1>
            <p class="mt-2 text-sm text-gray-500">Step <?php echo min($step, 4); ?> of 4</p>
        </div>
        
        <!-- Progress Bar -->
        <div class="flex gap-3 mt-6">
            <?php 
            $progressSteps = 4;
            $currentVisualStep = min($step, 4);
            if ($step >= 5) $currentVisualStep = 4;
            
            for($i=1; $i<=$progressSteps; $i++): 
                $isActive = $currentVisualStep >= $i;
            ?>
                <div class="h-2 flex-1 rounded-full <?php echo $isActive ? 'bg-teal-500' : 'bg-gray-200'; ?>"></div>
            <?php endfor; ?>
        </div>

        <?php if ($error): ?>
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm"><?php echo $error; ?></p>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Step 1: Server Requirements -->
        <?php if ($step == 1): ?>
            <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">1. Server Requirements</h2>
                <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                    <!-- PHP Version -->
                    <div class="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <span class="text-gray-700 font-medium">PHP Version >= 8.1</span>
                        <?php if (version_compare(PHP_VERSION, '8.1.0', '>=')): ?>
                            <span class="text-green-600 font-bold text-sm">OK (<?php echo PHP_VERSION; ?>)</span>
                        <?php else: ?>
                            <span class="text-red-600 font-bold text-sm"><?php echo PHP_VERSION; ?></span>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Extensions -->
                    <?php
                    $exts = ['bcmath', 'ctype', 'fileinfo', 'json', 'mbstring', 'openssl', 'pdo', 'tokenizer', 'xml', 'curl', 'gd', 'zip'];
                    $allExts = true;
                    foreach ($exts as $ext):
                        $loaded = extension_loaded($ext);
                        if (!$loaded) $allExts = false;
                    ?>
                        <div class="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                            <span class="text-gray-700 font-medium capitalize"><?php echo $ext; ?> Extension</span>
                            <?php if ($loaded): ?>
                                <span class="text-green-600 font-bold text-sm">OK</span>
                            <?php else: ?>
                                <span class="text-red-600 font-bold text-sm">MISSING</span>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                    
                    <!-- Permissions -->
                    <?php
                    $folders = [
                        'Storage Directory' => $corePath . '/storage',
                        'Bootstrap Cache' => $corePath . '/bootstrap/cache',
                        '.env File' => $envPath
                    ];
                    if (!file_exists($envPath)) touch($envPath);
                    
                    $allWritable = true;
                    foreach ($folders as $name => $path):
                        $writable = is_writable($path);
                        if (!$writable) $allWritable = false;
                    ?>
                        <div class="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                            <span class="text-gray-700 font-medium"><?php echo $name; ?></span>
                            <?php if ($writable): ?>
                                <span class="text-green-600 font-bold text-sm">Writable</span>
                            <?php else: ?>
                                <span class="text-red-600 font-bold text-sm">Not Writable</span>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <form method="post" class="mt-8">
                    <input type="hidden" name="action" value="check_reqs">
                    <?php if (!$allWritable): ?>
                        <div class="flex items-center mb-4">
                            <input type="checkbox" name="fix_permissions" value="1" id="fix_perms" class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                            <label for="fix_perms" class="ml-2 block text-sm text-gray-900">
                                Attempt to fix permissions automatically
                            </label>
                        </div>
                    <?php endif; ?>
                    
                    <button type="submit" <?php echo !$allExts ? 'disabled' : ''; ?> class="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-sm">
                        Next: Database Configuration
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- Step 2: Database -->
        <?php if ($step == 2): ?>
            <?php 
                $currentEnv = getEnvValues($envPath);
                $dbStatus = testDbConnection($envPath);
            ?>
            <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">2. Database Configuration</h2>
                
                <!-- Status -->
                <div class="mb-6 p-4 rounded-lg border <?php echo $dbStatus['success'] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'; ?>">
                    <div class="flex items-center">
                        <div class="mr-3 text-xl">
                            <?php echo $dbStatus['success'] ? '<i class="fas fa-check-circle text-green-500"></i>' : '<i class="fas fa-database text-gray-400"></i>'; ?>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm <?php echo $dbStatus['success'] ? 'text-green-800' : 'text-gray-700'; ?>">
                                <?php echo $dbStatus['success'] ? 'Connected' : 'Not Connected'; ?>
                            </h3>
                            <p class="text-xs text-gray-500">
                                <?php echo $dbStatus['success'] ? 'Database is ready.' : ($dbStatus['message'] === 'Not configured' ? 'Enter credentials below.' : 'Error: ' . $dbStatus['message']); ?>
                            </p>
                        </div>
                    </div>
                </div>

                <form method="post" class="space-y-4">
                    <input type="hidden" name="action" value="save_db">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Host</label>
                            <input type="text" name="db_host" value="<?php echo $_POST['db_host'] ?? $currentEnv['DB_HOST'] ?? '127.0.0.1'; ?>" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Port</label>
                            <input type="text" name="db_port" value="<?php echo $_POST['db_port'] ?? $currentEnv['DB_PORT'] ?? '3306'; ?>" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                        <input type="text" name="db_name" value="<?php echo $_POST['db_name'] ?? $currentEnv['DB_DATABASE'] ?? ''; ?>" placeholder="e.g. easyhealth" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" name="db_user" value="<?php echo $_POST['db_user'] ?? $currentEnv['DB_USERNAME'] ?? ''; ?>" placeholder="e.g. root" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="db_pass" value="<?php echo $_POST['db_pass'] ?? $currentEnv['DB_PASSWORD'] ?? ''; ?>" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border">
                    </div>
                    
                    <?php if (isset($showOverwriteConfirm)): ?>
                        <div class="flex items-center mt-4">
                            <input type="checkbox" name="confirm_overwrite" value="1" id="confirm_overwrite" class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                            <label for="confirm_overwrite" class="ml-2 block text-sm text-gray-900">
                                Confirm overwrite of existing database
                            </label>
                        </div>
                    <?php endif; ?>

                    <button type="submit" class="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out shadow-sm mt-6">
                        Save & Continue
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- Step 3: Settings -->
        <?php if ($step == 3): ?>
            <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">3. Application Settings</h2>
                <form method="post" class="space-y-4">
                    <input type="hidden" name="action" value="save_app">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
                        <input type="url" name="app_url" value="<?php echo (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]"; ?>" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                        <p class="mt-1 text-xs text-gray-500">The domain where both frontend and admin will be accessible (e.g., https://example.com)</p>
                    </div>
                    <button type="submit" class="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out shadow-sm mt-6">
                        Save & Continue
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- Step 4: Install -->
        <?php if ($step == 4): ?>
            <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900 mb-4">4. Ready to Install</h2>
                <p class="text-gray-500 mb-8">We will now run migrations, seed the database, and configure the application. This may take a minute.</p>
                <form method="post">
                    <input type="hidden" name="action" value="install_core">
                    <button type="submit" class="w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out shadow-lg transform hover:scale-[1.02]">
                        <i class="fas fa-rocket mr-2"></i> Start Installation
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- Step 5: Admin -->
        <?php if ($step == 5): ?>
            <div>
                <h2 class="text-xl font-bold text-gray-900 mb-4">Create Super Admin</h2>
                <?php if (isset($_SESSION['install_log'])): ?>
                    <div class="bg-gray-900 text-green-400 p-4 rounded-lg mb-6 h-32 overflow-y-auto text-xs font-mono shadow-inner">
                        <?php echo nl2br(htmlspecialchars($_SESSION['install_log'])); ?>
                    </div>
                <?php endif; ?>
                <form method="post" class="space-y-4">
                    <input type="hidden" name="action" value="create_admin">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" name="name" value="Super Admin" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value="admin@easyhealthcare101.com" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2 border" required>
                    </div>
                    <button type="submit" class="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out shadow-sm mt-6">
                        Create Account
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- Step 6: Finish -->
        <?php if ($step == 6): ?>
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <i class="fas fa-check text-green-600 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Installation Complete!</h2>
                <p class="text-gray-500 mb-8">Your application has been successfully installed.</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <a href="/admin" class="flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm">
                        Go to Admin Panel
                    </a>
                    <a href="<?php echo $_SESSION['frontend_url'] ?? '/'; ?>" class="flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                        Visit Website
                    </a>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-left mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-shield-alt text-yellow-400"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-yellow-800">Security Warning</h3>
                            <div class="mt-2 text-sm text-yellow-700">
                                <p>Please delete this <code>install.php</code> file now to prevent unauthorized access.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-sm font-medium text-gray-900 mb-4">Troubleshooting</h4>
                    <div class="flex flex-wrap justify-center gap-2">
                        <form method="post" class="inline-block">
                            <input type="hidden" name="action" value="generate_key">
                            <button type="submit" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition">
                                <i class="fas fa-key mr-1"></i> Generate App Key
                            </button>
                        </form>

                        <form method="post" class="inline-block">
                            <input type="hidden" name="action" value="run_migrations">
                            <button type="submit" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition">
                                <i class="fas fa-database mr-1"></i> Run Migrations
                            </button>
                        </form>

                        <form method="post" class="inline-block">
                            <input type="hidden" name="action" value="fix_storage">
                            <button type="submit" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition">
                                <i class="fas fa-link mr-1"></i> Fix Storage
                            </button>
                        </form>
                        
                        <form method="post" class="inline-block">
                            <input type="hidden" name="action" value="clear_cache">
                            <button type="submit" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition">
                                <i class="fas fa-broom mr-1"></i> Clear Cache
                            </button>
                        </form>
                    </div>
                    <?php if(isset($success)) echo "<div class='mt-4 text-green-600 text-sm font-bold'>$success</div>"; ?>
                </div>
            </div>
        <?php endif; ?>

    </div>
    <div class="text-center text-gray-400 mt-8 text-sm">&copy; Easy Healthcare 101 - Installer v2.0</div>
</body>
</html>
