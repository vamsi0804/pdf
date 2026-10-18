<?php
// backend/database/init_db.php
require_once dirname(__DIR__) . '/config/Database.php';

echo "Initializing database...\n";
$sqlitePath = __DIR__ . '/app.sqlite';
if (file_exists($sqlitePath)) {
    unlink($sqlitePath);
    echo "Removed previous SQLite database file.\n";
}

$pdo = Database::getConnection();

echo "Database initialized successfully with SQLite at: {$sqlitePath}\n";
$stmt = $pdo->query("SELECT COUNT(*) as count FROM categories");
$res = $stmt->fetch();
echo "Categories seeded: " . $res['count'] . "\n";

$stmt = $pdo->query("SELECT COUNT(*) as count FROM chapters");
$res = $stmt->fetch();
echo "Chapters seeded: " . $res['count'] . "\n";

$stmt = $pdo->query("SELECT COUNT(*) as count FROM subtopics");
$res = $stmt->fetch();
echo "Subtopics seeded: " . $res['count'] . "\n";

$stmt = $pdo->query("SELECT COUNT(*) as count FROM documents");
$res = $stmt->fetch();
echo "Documents seeded: " . $res['count'] . "\n";
