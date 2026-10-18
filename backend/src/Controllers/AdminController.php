<?php
// backend/src/Controllers/AdminController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';
require_once dirname(__DIR__) . '/Services/AuthService.php';

class AdminController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function login(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($email) || empty($password)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Email and password are required']);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
            return;
        }

        $token = AuthService::generateToken([
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role']
        ]);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    }

    public function stats(): void {
        $cats = $this->db->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        $chaps = $this->db->query("SELECT COUNT(*) FROM chapters")->fetchColumn();
        $subs = $this->db->query("SELECT COUNT(*) FROM subtopics")->fetchColumn();
        $docs = $this->db->query("SELECT COUNT(*) FROM documents")->fetchColumn();
        $storage = $this->db->query("SELECT COALESCE(SUM(file_size), 0) FROM documents")->fetchColumn();

        echo json_encode([
            'success' => true,
            'data' => [
                'categories_count' => (int)$cats,
                'chapters_count' => (int)$chaps,
                'subtopics_count' => (int)$subs,
                'documents_count' => (int)$docs,
                'total_storage_bytes' => (int)$storage
            ]
        ]);
    }
}
