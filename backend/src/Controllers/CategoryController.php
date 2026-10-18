<?php
// backend/src/Controllers/CategoryController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';

class CategoryController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        $includeInactive = isset($_GET['all']) && $_GET['all'] === 'true';
        $sql = "SELECT c.*, 
                (SELECT COUNT(*) FROM chapters ch WHERE ch.category_id = c.id) as chapters_count
                FROM categories c ";
        
        if (!$includeInactive) {
            $sql .= "WHERE c.is_active = 1 ";
        }
        $sql .= "ORDER BY c.display_order ASC, c.id ASC";

        $stmt = $this->db->query($sql);
        $categories = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $categories]);
    }

    public function show(int $id): void {
        $stmt = $this->db->prepare("SELECT c.*, 
            (SELECT COUNT(*) FROM chapters ch WHERE ch.category_id = c.id) as chapters_count
            FROM categories c WHERE c.id = ?");
        $stmt->execute([$id]);
        $category = $stmt->fetch();

        if (!$category) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Category not found']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $category]);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['title'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Title is required']);
            return;
        }

        $title = trim($input['title']);
        $description = trim($input['description'] ?? '');
        $icon = trim($input['icon'] ?? 'book');
        $displayOrder = intval($input['display_order'] ?? 1);
        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;

        $stmt = $this->db->prepare("INSERT INTO categories (title, description, icon, display_order, is_active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $icon, $displayOrder, $isActive]);
        $id = $this->db->lastInsertId();

        $this->show((int)$id);
    }

    public function update(int $id): void {
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $category = $stmt->fetch();
        if (!$category) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Category not found']);
            return;
        }

        $title = isset($input['title']) ? trim($input['title']) : $category['title'];
        $description = isset($input['description']) ? trim($input['description']) : $category['description'];
        $icon = isset($input['icon']) ? trim($input['icon']) : $category['icon'];
        $displayOrder = isset($input['display_order']) ? intval($input['display_order']) : $category['display_order'];
        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : $category['is_active'];

        $updateStmt = $this->db->prepare("UPDATE categories SET title = ?, description = ?, icon = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $updateStmt->execute([$title, $description, $icon, $displayOrder, $isActive, $id]);

        $this->show($id);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Category not found']);
            return;
        }

        $delStmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
        $delStmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
    }

    public function reorder(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['orders']) || !is_array($input['orders'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Orders array required']);
            return;
        }

        $stmt = $this->db->prepare("UPDATE categories SET display_order = ? WHERE id = ?");
        foreach ($input['orders'] as $item) {
            if (isset($item['id']) && isset($item['display_order'])) {
                $stmt->execute([intval($item['display_order']), intval($item['id'])]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Categories reordered successfully']);
    }
}
