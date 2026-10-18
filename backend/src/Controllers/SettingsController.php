<?php
// backend/src/Controllers/SettingsController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';

class SettingsController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getSettings(): void {
        $stmt = $this->db->query("SELECT setting_key, setting_value FROM app_settings");
        $rows = $stmt->fetchAll();

        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }

        echo json_encode(['success' => true, 'data' => $settings]);
    }

    public function updateSettings(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Settings data must be key-value pairs']);
            return;
        }

        $stmt = $this->db->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) 
            ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP");

        // If MySQL driver is active, handle ON DUPLICATE KEY UPDATE
        if (Database::getDriver() === 'mysql') {
            $stmt = $this->db->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP");
        }

        foreach ($input as $key => $val) {
            $stmt->execute([$key, is_array($val) ? json_encode($val) : strval($val)]);
        }

        $this->getSettings();
    }

    public function uploadBackground(): void {
        if (!isset($_FILES['background_image']) || $_FILES['background_image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Background image file required']);
            return;
        }

        $file = $_FILES['background_image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($ext, $allowed)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Invalid image format. Supported: JPG, PNG, WEBP']);
            return;
        }

        $uploadDir = dirname(__DIR__, 2) . '/storage/uploads';
        @mkdir($uploadDir, 0777, true);

        $savedName = 'bg_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
        $dest = $uploadDir . '/' . $savedName;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to save background image']);
            return;
        }

        $relPath = '/storage/uploads/' . $savedName;
        
        // Update setting
        if (Database::getDriver() === 'mysql') {
            $stmt = $this->db->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('background_image', ?) 
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        } else {
            $stmt = $this->db->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('background_image', ?) 
                ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value");
        }
        $stmt->execute([$relPath]);

        echo json_encode(['success' => true, 'background_image' => $relPath]);
    }
}
