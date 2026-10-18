<?php
// backend/config/config.php - Hostinger Shared Hosting & Local Configuration
return [
    'db' => [
        // Use 'mysql' for Hostinger shared hosting, or 'sqlite' for local offline testing
        'driver'   => 'sqlite',
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'telugu_pdf_app',
        'username' => 'root',
        'password' => '',
    ],
    'app' => [
        'name'       => 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
        'url'        => 'http://localhost:8000',
        'jwt_secret' => 'telugu_traditional_sacred_knowledge_jwt_key_2026',
    ]
];
