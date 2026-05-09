<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Forms;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use ZipArchive;
use Carbon\Carbon;
use Filament\Notifications\Notification;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class Backups extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-archive-box-arrow-down';

    protected string $view = 'filament.pages.backups';

    protected static ?string $navigationLabel = 'Full Backup';

    protected static ?string $title = 'System Maintenance';
    
    protected static ?string $slug = 'full-backup';

    protected static ?int $navigationSort = 1;
    
    public static function getNavigationGroup(): ?string
    {
        return 'System';
    }

    public static function canAccess(): bool
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        return $user?->hasPermission('view_system') ?? false;
    }

    public function restoreAction(): Action
    {
        return Action::make('restore')
            ->label('Restore Backup')
            ->color('danger')
            ->icon('heroicon-o-arrow-path')
            ->requiresConfirmation()
            ->modalHeading('Restore System from Backup')
            ->modalDescription('WARNING: This will overwrite your current database and/or files depending on the backup content. This action cannot be undone. Please ensure you have a current backup before proceeding.')
            ->form([
                Forms\Components\FileUpload::make('backup_file')
                    ->label('Upload Backup Zip')
                    ->disk('local')
                    ->directory('temp-restores')
                    ->acceptedFileTypes(['application/zip', 'application/x-zip-compressed', 'application/x-zip', 'application/octet-stream'])
                    ->maxSize(104857600) // 100GB (Effectively unlimited)
                    ->required(),
                Forms\Components\Checkbox::make('restore_database')
                    ->label('Restore Database (if present)')
                    ->default(true),
                Forms\Components\Checkbox::make('restore_files')
                    ->label('Restore Files (if present)')
                    ->default(true),
            ])
            ->action(function (array $data) {
                try {
                    $this->processRestore($data);
                } catch (\Throwable $e) {
                    Log::error('Restore failed', ['message' => $e->getMessage()]);
                    Notification::make()->title('Error')->body('Restore failed. Check logs for details.')->danger()->send();
                }
            });
    }

    public function getLocalBackups(): array
    {
        $path = storage_path('app/manual_backups');
        if (!file_exists($path)) {
            @mkdir($path, 0775, true);
        }
        $files = glob($path . '/*.zip');
        $options = [];
        foreach ($files as $file) {
            $options[$file] = basename($file) . ' (' . $this->formatSize(filesize($file)) . ')';
        }
        return $options;
    }

    public function formatSize($bytes)
    {
        if ($bytes >= 1073741824) {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            $bytes = $bytes . ' bytes';
        } elseif ($bytes == 1) {
            $bytes = $bytes . ' byte';
        } else {
            $bytes = '0 bytes';
        }

        return $bytes;
    }

    public function restoreLocalAction(): Action
    {
        return Action::make('restoreLocal')
            ->label('Restore from Server File')
            ->color('warning')
            ->icon('heroicon-o-server')
            ->requiresConfirmation()
            ->modalHeading('Restore from Manual Backup')
            ->modalDescription('Select a backup file previously uploaded to storage/app/manual_backups via FTP/File Manager.')
            ->form([
                Forms\Components\Select::make('backup_file')
                    ->label('Select Backup File')
                    ->options($this->getLocalBackups())
                    ->required()
                    ->searchable()
                    ->noSearchResultsMessage('No backups found in storage/app/manual_backups'),
                Forms\Components\Checkbox::make('restore_database')
                    ->label('Restore Database')
                    ->default(true),
                Forms\Components\Checkbox::make('restore_files')
                    ->label('Restore Files')
                    ->default(true),
            ])
            ->action(function (array $data) {
                $originalPath = $data['backup_file'];
                if (file_exists($originalPath)) {
                    // Create a copy in temp-restores so the original is preserved
                    $tempDir = storage_path('app/temp-restores');
                    if (!is_dir($tempDir)) @mkdir($tempDir, 0775, true);
                    $tempPath = $tempDir . '/' . basename($originalPath);
                    copy($originalPath, $tempPath);
                    $data['backup_file'] = $tempPath;
                    
                    try {
                        $this->processRestore($data);
                    } catch (\Throwable $e) {
                         Log::error('Restore failed', ['message' => $e->getMessage()]);
                        Notification::make()->title('Error')->body('Restore failed: ' . $e->getMessage())->danger()->send();
                    }
                } else {
                    Notification::make()->title('Error')->body('File not found')->danger()->send();
                }
            });
    }

    protected function processRestore(array $data)
    {
        $raw = $data['backup_file'] ?? null;
        $backupPath = null;
        $candidates = [];
        $targetDir = storage_path('app/temp-restores');
        
        // Ensure target directory exists and is writable
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0775, true);
        }
        @chmod($targetDir, 0775);
        
        if ($raw instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
            $stored = $raw->storeAs('temp-restores', $raw->getClientOriginalName(), 'local');
            $candidates[] = storage_path('app/' . $stored);
        } else {
            $value = is_array($raw) ? ($raw[0] ?? null) : $raw;
            if (is_string($value) && $value !== '') {
                // Common relative paths
                $relative = ltrim($value, '/');
                $candidates[] = storage_path('app/' . $relative);
                $candidates[] = $targetDir . '/' . basename($relative);
                // Absolute path fallback
                $candidates[] = $value;
                
                // Resolve via Storage disk explicitly
                try {
                    $diskPath = Storage::disk('local')->path($relative);
                    $candidates[] = $diskPath;
                } catch (\Throwable $e) {
                    // ignore resolution failure
                }
                
                // Search in Livewire temporary directory and copy to target
                $livewireTmp = storage_path('app/livewire-tmp');
                $basename = basename($relative);
                foreach (glob($livewireTmp . '/*/' . $basename) as $tmpFile) {
                    $dest = $targetDir . '/' . $basename;
                    @copy($tmpFile, $dest);
                    $candidates[] = $dest;
                }
            }
        }
        
        foreach ($candidates as $candidate) {
            if ($candidate && file_exists($candidate)) {
                $backupPath = $candidate;
                break;
            }
        }
        
        if (!$backupPath) {
            Notification::make()->title('Error')->body('Backup file not found. Please re-upload and ensure storage/app is writable.')->danger()->send();
            return;
        }

        $tempDir = storage_path('app/temp-restore-' . uniqid());
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zip = new ZipArchive;
        $opened = $zip->open($backupPath);
        if ($opened === true) {
            $zip->extractTo($tempDir);
            $zip->close();
        } else {
            Notification::make()->title('Error')->body('Failed to open zip file.')->danger()->send();
            return;
        }

        // Restore Database
        if ($data['restore_database']) {
            $this->restoreDatabase($tempDir);
        }

        // Restore Files
        if ($data['restore_files']) {
            $this->restoreFiles($tempDir);
        }

        // Cleanup
        $this->recursiveRemoveDirectory($tempDir);
        @unlink($backupPath);

        Notification::make()
            ->title('Restore Completed')
            ->body('System restore process finished.')
            ->success()
            ->send();
    }

    protected function restoreDatabase($tempDir)
    {
        $dbConfig = config('database.connections.' . config('database.default'));
        $driver = $dbConfig['driver'];

        // Look for common dump names
        $dumpFiles = [
            $tempDir . '/database.sql',
            $tempDir . '/database.sqlite',
            $tempDir . '/database.json',
        ];

        $foundDump = null;
        foreach ($dumpFiles as $file) {
            if (file_exists($file)) {
                $foundDump = $file;
                break;
            }
        }

        if (!$foundDump) {
            Notification::make()->title('Warning')->body('No database dump found in backup.')->warning()->send();
            return;
        }

        try {
            if ($driver === 'sqlite') {
                copy($foundDump, $dbConfig['database']);
            } elseif ($driver === 'mysql' && str_ends_with($foundDump, '.sql')) {
                // Determine mysql command path (reuse getMysqldumpPath logic effectively)
                $mysqlPath = str_replace('mysqldump', 'mysql', $this->getMysqldumpPath());
                
                $command = sprintf(
                    '%s --user=%s --password=%s --host=%s --port=%s %s < %s',
                    escapeshellarg($mysqlPath),
                    escapeshellarg($dbConfig['username']),
                    escapeshellarg($dbConfig['password']),
                    escapeshellarg($dbConfig['host']),
                    escapeshellarg($dbConfig['port']),
                    escapeshellarg($dbConfig['database']),
                    escapeshellarg($foundDump)
                );
                
                exec($command, $output, $returnVar);
                
                if ($returnVar !== 0) {
                    // Try PHP-based import if command line failed
                    $this->importSqlFile($foundDump);
                }
            } else {
                 Notification::make()->title('Warning')->body('Automatic restore not supported for this driver/format.')->warning()->send();
            }
        } catch (\Exception $e) {
            Notification::make()->title('Error')->body('Database restore failed: ' . $e->getMessage())->danger()->send();
        }
    }

    protected function importSqlFile($filePath)
    {
        // Increase memory and time limit for large imports
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $handle = fopen($filePath, "r");
        if (!$handle) {
            throw new \Exception("Could not open SQL file.");
        }

        $sql = '';
        
        DB::beginTransaction();
        
        try {
            while (($line = fgets($handle)) !== false) {
                // Skip comments (simple check) and empty lines
                $trimmedLine = trim($line);
                if (substr($trimmedLine, 0, 2) == '--' || $trimmedLine == '' || substr($trimmedLine, 0, 1) == '#') {
                    continue;
                }
                
                $sql .= $line;
                
                // If line ends with semicolon, execute query
                if (substr(rtrim($line), -1, 1) == ';') {
                    DB::unprepared($sql);
                    $sql = '';
                }
            }
            
            DB::commit();
            fclose($handle);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($handle) fclose($handle);
            throw $e;
        }
    }

    protected function restoreFiles($tempDir)
    {
        $sourceStorage = $tempDir . '/storage';
        if (file_exists($sourceStorage)) {
            $destination = storage_path('app/public');
            
            // Simple copy implementation
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($sourceStorage, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            
            foreach ($iterator as $item) {
                // $subPath = $iterator->getSubPathName(); // Linter error fix
                $subPath = substr($item->getRealPath(), strlen($sourceStorage) + 1);
                $destPath = $destination . '/' . $subPath;
                
                if ($item->isDir()) {
                    if (!file_exists($destPath)) {
                        mkdir($destPath, 0755, true);
                    }
                } else {
                    copy($item, $destPath);
                }
            }
        }
    }

    protected function recursiveRemoveDirectory($directory)
    {
        if (!is_dir($directory)) {
            return;
        }

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $fileinfo) {
            $todo = ($fileinfo->isDir() ? 'rmdir' : 'unlink');
            @$todo($fileinfo->getRealPath());
        }

        @rmdir($directory);
    }

    public function backupSystemAction(): Action
    {
        return Action::make('backupSystem')
            ->label('Full System Backup')
            ->size('md')
            ->color('primary')
            ->icon('heroicon-o-server-stack')
            ->action(fn () => $this->downloadFullBackup());
    }

    public function backupDatabaseAction(): Action
    {
        return Action::make('backupDatabase')
            ->label('Database Only')
            ->size('md')
            ->color('warning')
            ->icon('heroicon-o-circle-stack')
            ->action(fn () => $this->downloadDatabaseBackup());
    }

    public function backupFilesAction(): Action
    {
        return Action::make('backupFiles')
            ->label('Files Only')
            ->size('md')
            ->color('success')
            ->icon('heroicon-o-folder')
            ->action(fn () => $this->downloadFilesBackup());
    }

    protected function getMysqldumpPath(): string
    {
        // Check if mysqldump is in PATH
        $returnVal = null;
        $output = null;
        exec('mysqldump --version', $output, $returnVal);
        if ($returnVal === 0) {
            return 'mysqldump';
        }

        // Common paths to check
        $paths = [
            '/Applications/XAMPP/xamppfiles/bin/mysqldump',
            '/usr/local/mysql/bin/mysqldump',
            '/usr/local/bin/mysqldump',
            '/opt/homebrew/bin/mysqldump',
            '/Applications/MAMP/Library/bin/mysqldump',
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return 'mysqldump'; // Fallback to default
    }

    protected function generateDbDump(string $tempDir): ?string
    {
        $dbConfig = config('database.connections.' . config('database.default'));
        $driver = $dbConfig['driver'];
        $dumpFile = null;

        try {
            if ($driver === 'sqlite') {
                $dumpFile = $tempDir . '/database.sqlite';
                copy($dbConfig['database'], $dumpFile);
            } elseif ($driver === 'mysql') {
                $dumpFile = $tempDir . '/database.sql';
                
                // Try mysqldump first
                $mysqldumpPath = $this->getMysqldumpPath();
                $command = sprintf(
                    '%s --user=%s --password=%s --host=%s --port=%s %s > %s',
                    escapeshellarg($mysqldumpPath),
                    escapeshellarg($dbConfig['username']),
                    escapeshellarg($dbConfig['password']),
                    escapeshellarg($dbConfig['host']),
                    escapeshellarg($dbConfig['port']),
                    escapeshellarg($dbConfig['database']),
                    escapeshellarg($dumpFile)
                );
                
                exec($command, $output, $returnVar);
                
                // If mysqldump failed, use PHP fallback
                if ($returnVar !== 0 || !file_exists($dumpFile) || filesize($dumpFile) === 0) {
                    $this->generatePhpSqlDump($dumpFile);
                }
            } else {
                 $dumpFile = $tempDir . '/database_fallback.json';
                 file_put_contents($dumpFile, json_encode(['error' => 'Driver not supported for full dump'], JSON_PRETTY_PRINT));
            }
        } catch (\Exception $e) {
            Notification::make()
                ->title('Database Backup Warning')
                ->body('Could not dump database: ' . $e->getMessage())
                ->warning()
                ->send();
            return null;
        }

        return $dumpFile;
    }

    protected function generatePhpSqlDump(string $outputFile)
    {
        // Increase memory and time limit for large imports
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $handle = fopen($outputFile, 'w');
        
        // Disable foreign key checks
        fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n");
        fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n\n");

        $tables = DB::select('SHOW TABLES');
        $dbName = config('database.connections.mysql.database');
        $tablesKey = "Tables_in_" . $dbName;

        foreach ($tables as $tableObj) {
            // Determine table name key (it varies based on fetch mode or PDO)
            $table = reset($tableObj);
            
            // Drop table
            fwrite($handle, "DROP TABLE IF EXISTS `$table`;\n");

            // Create table
            try {
                $createTable = DB::select("SHOW CREATE TABLE `$table`")[0];
                $createTableSql = $createTable->{'Create Table'} ?? $createTable->{'create table'};
                fwrite($handle, $createTableSql . ";\n\n");
            } catch (\Exception $e) {
                continue; // Skip if table definition cannot be read
            }

            // Insert data - use cursor for memory efficiency
            $rows = DB::table($table)->cursor();
            foreach ($rows as $row) {
                $values = array_map(function ($value) {
                    if ($value === null) return 'NULL';
                    return "'" . addslashes($value) . "'";
                }, (array)$row);
                
                fwrite($handle, "INSERT INTO `$table` VALUES (" . implode(', ', $values) . ");\n");
            }
            fwrite($handle, "\n");
        }

        // Enable foreign key checks
        fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
        fclose($handle);
    }

    protected function addFilesToZip(ZipArchive $zip, string $sourcePath, string $zipInternalPrefix = '')
    {
        if (!file_exists($sourcePath)) {
            return;
        }

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($sourcePath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                // Make relative path inside zip
                $relativePath = $zipInternalPrefix . substr($filePath, strlen($sourcePath) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
    }

    public function downloadFullBackup()
    {
        if (!class_exists('ZipArchive')) {
            $this->showZipError();
            return;
        }

        $fileName = 'full-backup-' . Carbon::now()->format('Y-m-d-H-i-s') . '.zip';
        $tempDir = storage_path('app/temp-backups/' . uniqid());
        $zipPath = storage_path('app/' . $fileName);

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $dumpFile = $this->generateDbDump($tempDir);

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            // Add DB Dump
            if ($dumpFile && file_exists($dumpFile)) {
                $zip->addFile($dumpFile, basename($dumpFile));
            }

            // Add Public Storage
            $this->addFilesToZip($zip, storage_path('app/public'), 'storage/');
            
            $zip->close();
        } else {
            $this->showZipError();
            return;
        }

        // Cleanup
        if ($dumpFile && file_exists($dumpFile)) unlink($dumpFile);
        rmdir($tempDir);

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    public function downloadDatabaseBackup()
    {
        if (!class_exists('ZipArchive')) {
            $this->showZipError();
            return;
        }

        $fileName = 'db-backup-' . Carbon::now()->format('Y-m-d-H-i-s') . '.zip';
        $tempDir = storage_path('app/temp-backups/' . uniqid());
        $zipPath = storage_path('app/' . $fileName);

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $dumpFile = $this->generateDbDump($tempDir);

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            if ($dumpFile && file_exists($dumpFile)) {
                $zip->addFile($dumpFile, basename($dumpFile));
            }
            $zip->close();
        } else {
            $this->showZipError();
            return;
        }

        if ($dumpFile && file_exists($dumpFile)) unlink($dumpFile);
        rmdir($tempDir);

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    public function downloadFilesBackup()
    {
        if (!class_exists('ZipArchive')) {
            $this->showZipError();
            return;
        }

        $fileName = 'files-backup-' . Carbon::now()->format('Y-m-d-H-i-s') . '.zip';
        $zipPath = storage_path('app/' . $fileName);

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $this->addFilesToZip($zip, storage_path('app/public'), 'storage/');
            $zip->close();
        } else {
            $this->showZipError();
            return;
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    protected function showZipError()
    {
        Notification::make()
            ->title('Error')
            ->body('ZipArchive PHP extension is missing or zip creation failed.')
            ->danger()
            ->send();
    }
}
