<?php
// backend/config/Database.php
declare(strict_types=1);

class Database {
    private static ?PDO $instance = null;
    private static string $driver = 'sqlite';

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $localConfigFile = __DIR__ . '/config.local.php';
        $configFile = __DIR__ . '/config.php';
        $config = file_exists($localConfigFile)
            ? (require $localConfigFile)
            : (file_exists($configFile) ? (require $configFile) : []);

        $driver = $config['db']['driver'] ?? (getenv('DB_CONNECTION') ?: 'sqlite');
        $dbHost = $config['db']['host'] ?? (getenv('DB_HOST') ?: '127.0.0.1');
        $dbPort = $config['db']['port'] ?? (getenv('DB_PORT') ?: '3306');
        $dbName = $config['db']['database'] ?? (getenv('DB_DATABASE') ?: 'telugu_pdf_app');
        $dbUser = $config['db']['username'] ?? (getenv('DB_USERNAME') ?: 'root');
        $dbPass = $config['db']['password'] ?? (getenv('DB_PASSWORD') ?: '');

        if ($driver === 'mysql') {
            try {
                $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ];
                self::$instance = new PDO($dsn, $dbUser, $dbPass, $options);
                self::$driver = 'mysql';
                return self::$instance;
            } catch (PDOException $e) {
                // If MySQL fails on local dev, fallback gracefully to SQLite
                error_log("MySQL connection failed ({$e->getMessage()}), falling back to SQLite.");
            }
        }

        // SQLite connection (default for zero-setup local dev)
        $sqlitePath = dirname(__DIR__) . '/database/app.sqlite';
        $isNew = !file_exists($sqlitePath);
        $dsn = "sqlite:" . $sqlitePath;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        self::$instance = new PDO($dsn, null, null, $options);
        self::$instance->exec("PRAGMA foreign_keys = ON;");
        self::$driver = 'sqlite';

        if ($isNew) {
            self::initDatabase(self::$instance);
        }

        return self::$instance;
    }

    public static function getDriver(): string {
        return self::$driver;
    }

    public static function initDatabase(PDO $pdo): void {
        $schemaFile = dirname(__DIR__) . '/database/schema.sqlite.sql';
        $seedFile = dirname(__DIR__) . '/database/seed.sql';

        if (file_exists($schemaFile)) {
            $schemaSql = file_get_contents($schemaFile);
            $pdo->exec($schemaSql);
        }

        // Only seed if categories table is empty
        $check = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        if ($check == 0 && file_exists($seedFile)) {
            $seedSql = file_get_contents($seedFile);
            $pdo->exec($seedSql);
        }
    }
}
