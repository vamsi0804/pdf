<?php
// backend/src/Controllers/ChapterController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';

class ChapterController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
        $includeUnpublished = isset($_GET['all']) && $_GET['all'] === 'true';

        $sql = "SELECT ch.*, 
                c.title as category_title,
                (SELECT COUNT(*) FROM subtopics s WHERE s.chapter_id = ch.id) as subtopics_count
                FROM chapters ch
                JOIN categories c ON c.id = ch.category_id ";

        $where = [];
        $params = [];

        if ($categoryId !== null) {
            $where[] = "ch.category_id = ?";
            $params[] = $categoryId;
        }

        if (!$includeUnpublished) {
            $where[] = "ch.is_published = 1";
        }

        if (!empty($where)) {
            $sql .= "WHERE " . implode(' AND ', $where) . " ";
        }

        $sql .= "ORDER BY ch.display_order ASC, ch.chapter_number ASC, ch.id ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $chapters = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $chapters]);
    }

    public function show(int $id): void {
        $stmt = $this->db->prepare("SELECT ch.*, 
            c.title as category_title,
            (SELECT COUNT(*) FROM subtopics s WHERE s.chapter_id = ch.id) as subtopics_count
            FROM chapters ch
            JOIN categories c ON c.id = ch.category_id
            WHERE ch.id = ?");
        $stmt->execute([$id]);
        $chapter = $stmt->fetch();

        if (!$chapter) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Chapter not found']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $chapter]);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['title']) || empty($input['category_id'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Title and category_id are required']);
            return;
        }

        $categoryId = intval($input['category_id']);
        $title = trim($input['title']);
        $description = trim($input['description'] ?? '');
        $chapterNumber = intval($input['chapter_number'] ?? 1);
        $displayOrder = intval($input['display_order'] ?? 1);
        $isPublished = isset($input['is_published']) ? (int)$input['is_published'] : 1;

        $stmt = $this->db->prepare("INSERT INTO chapters (category_id, title, description, chapter_number, display_order, is_published) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$categoryId, $title, $description, $chapterNumber, $displayOrder, $isPublished]);
        $id = $this->db->lastInsertId();

        $this->show((int)$id);
    }

    public function update(int $id): void {
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $this->db->prepare("SELECT * FROM chapters WHERE id = ?");
        $stmt->execute([$id]);
        $chapter = $stmt->fetch();
        if (!$chapter) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Chapter not found']);
            return;
        }

        $categoryId = isset($input['category_id']) ? intval($input['category_id']) : $chapter['category_id'];
        $title = isset($input['title']) ? trim($input['title']) : $chapter['title'];
        $description = isset($input['description']) ? trim($input['description']) : $chapter['description'];
        $chapterNumber = isset($input['chapter_number']) ? intval($input['chapter_number']) : $chapter['chapter_number'];
        $displayOrder = isset($input['display_order']) ? intval($input['display_order']) : $chapter['display_order'];
        $isPublished = isset($input['is_published']) ? (int)$input['is_published'] : $chapter['is_published'];

        $updateStmt = $this->db->prepare("UPDATE chapters SET category_id = ?, title = ?, description = ?, chapter_number = ?, display_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $updateStmt->execute([$categoryId, $title, $description, $chapterNumber, $displayOrder, $isPublished, $id]);

        $this->show($id);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare("SELECT * FROM chapters WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Chapter not found']);
            return;
        }

        $delStmt = $this->db->prepare("DELETE FROM chapters WHERE id = ?");
        $delStmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Chapter deleted successfully']);
    }

    public function reorder(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['orders']) || !is_array($input['orders'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Orders array required']);
            return;
        }

        $stmt = $this->db->prepare("UPDATE chapters SET display_order = ? WHERE id = ?");
        foreach ($input['orders'] as $item) {
            if (isset($item['id']) && isset($item['display_order'])) {
                $stmt->execute([intval($item['display_order']), intval($item['id'])]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Chapters reordered successfully']);
    }
}
