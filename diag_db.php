<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=smartpetcare', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully\n";
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS test_users (id INT AUTO_INCREMENT PRIMARY KEY)");
    echo "Test table created successfully\n";
    
    $pdo->exec("DROP TABLE test_users");
    echo "Test table dropped successfully\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
