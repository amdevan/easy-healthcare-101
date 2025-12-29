<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=doctor";
    $pdo = new PDO($dsn, "postgres", "root", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5]);
    echo "Connection successful!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
