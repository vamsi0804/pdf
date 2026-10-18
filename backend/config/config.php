<?php
// backend/config/config.php - Hostinger Smart Multi-Environment (Dev & Prod) Configuration
// Detect whether the current request is for the Develop subdomain or Production domain

$httpHost = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isDevDomain = (
    str_contains($httpHost, 'dev.') || 
    str_contains($httpHost, 'stage.') || 
    str_contains($httpHost, 'test.')
);
$isLocal = ($httpHost === 'localhost' || $httpHost === '127.0.0.1' || str_starts_with($httpHost, '192.168.'));

// -------------------------------------------------------------
// 1. DEVELOP ENVIRONMENT (Connected to develop database)
// -------------------------------------------------------------
$devEnvironment = [
    'db' => [
        'driver'   => 'mysql',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'u123456789_dev_db',     // Replace with your Hostinger Develop Database name
        'username' => 'u123456789_dev_user',   // Replace with your Hostinger Develop Database username
        'password' => 'YourDevDatabasePass',   // Replace with your Hostinger Develop Database password
    ],
    'app' => [
        'name'       => 'సాంప్రదాయిక జ్ఞాన తరంగిణి (Dev Staging)',
        'url'        => 'https://dev.yourdomain.com',
        'jwt_secret' => 'telugu_traditional_sacred_knowledge_jwt_key_2026_dev',
    ]
];

// -------------------------------------------------------------
// 2. PRODUCTION ENVIRONMENT (Connected to production database)
// -------------------------------------------------------------
$prodEnvironment = [
    'db' => [
        'driver'   => 'mysql',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'u123456789_prod_db',    // Replace with your Hostinger Production Database name
        'username' => 'u123456789_prod_user',  // Replace with your Hostinger Production Database username
        'password' => 'YourProdDatabasePass',  // Replace with your Hostinger Production Database password
    ],
    'app' => [
        'name'       => 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
        'url'        => 'https://yourdomain.com',
        'jwt_secret' => 'telugu_traditional_sacred_knowledge_jwt_key_2026_prod',
    ]
];

// -------------------------------------------------------------
// 3. LOCAL OFFLINE DEV (Zero-setup SQLite fallback)
// -------------------------------------------------------------
$localEnvironment = [
    'db' => [
        'driver'   => 'sqlite',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'telugu_pdf_app',
        'username' => 'root',
        'password' => '',
    ],
    'app' => [
        'name'       => 'సాంప్రదాయిక జ్ఞాన తరంగిణి (Local)',
        'url'        => 'http://localhost:8000',
        'jwt_secret' => 'telugu_traditional_sacred_knowledge_jwt_key_2026_local',
    ]
];

// Return local config if running on local PC, otherwise select based on domain
if ($isLocal) {
    return $localEnvironment;
}

return $isDevDomain ? $devEnvironment : $prodEnvironment;
