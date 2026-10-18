<?php
// backend/src/Controllers/SubtopicController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';

class SubtopicController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        $chapterId = isset($_GET['chapter_id']) ? intval($_GET['chapter_id']) : null;
        $includeUnpublished = isset($_GET['all']) && $_GET['all'] === 'true';

        $sql = "SELECT s.*, 
                ch.title as chapter_title,
                ch.category_id as category_id,
                d.id as document_id,
                d.title as document_title,
                d.file_size as document_file_size,
                d.allow_download as document_allow_download,
                CASE WHEN d.id IS NOT NULL THEN 1 ELSE 0 END as has_document
                FROM subtopics s
                JOIN chapters ch ON ch.id = s.chapter_id
                LEFT JOIN documents d ON d.subtopic_id = s.id AND (d.is_published = 1 OR :all = 1) ";

        $where = [];
        $params = [':all' => $includeUnpublished ? 1 : 0];

        if ($chapterId !== null) {
            $where[] = "s.chapter_id = :chapter_id";
            $params[':chapter_id'] = $chapterId;
        }

        if (!$includeUnpublished) {
            $where[] = "s.is_published = 1";
        }

        if (!empty($where)) {
            $sql .= "WHERE " . implode(' AND ', $where) . " ";
        }

        $sql .= "ORDER BY s.display_order ASC, s.id ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $subtopics = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $subtopics]);
    }

    public function show(int $id): void {
        $stmt = $this->db->prepare("SELECT s.*, 
            ch.title as chapter_title,
            ch.category_id as category_id,
            d.id as document_id,
            d.title as document_title,
            d.file_size as document_file_size,
            d.allow_download as document_allow_download,
            CASE WHEN d.id IS NOT NULL THEN 1 ELSE 0 END as has_document
            FROM subtopics s
            JOIN chapters ch ON ch.id = s.chapter_id
            LEFT JOIN documents d ON d.subtopic_id = s.id
            WHERE s.id = ?");
        $stmt->execute([$id]);
        $subtopic = $stmt->fetch();

        if (!$subtopic) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Subtopic not found']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $subtopic]);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['title']) || empty($input['chapter_id'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Title and chapter_id are required']);
            return;
        }

        $chapterId = intval($input['chapter_id']);
        $title = trim($input['title']);
        $description = trim($input['description'] ?? '');
        $displayOrder = intval($input['display_order'] ?? 1);
        $isPublished = isset($input['is_published']) ? (int)$input['is_published'] : 1;

        $stmt = $this->db->prepare("INSERT INTO subtopics (chapter_id, title, description, display_order, is_published) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$chapterId, $title, $description, $displayOrder, $isPublished]);
        $id = $this->db->lastInsertId();

        $this->show((int)$id);
    }

    public function update(int $id): void {
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $this->db->prepare("SELECT * FROM subtopics WHERE id = ?");
        $stmt->execute([$id]);
        $subtopic = $stmt->fetch();
        if (!$subtopic) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Subtopic not found']);
            return;
        }

        $chapterId = isset($input['chapter_id']) ? intval($input['chapter_id']) : $subtopic['chapter_id'];
        $title = isset($input['title']) ? trim($input['title']) : $subtopic['title'];
        $description = isset($input['description']) ? trim($input['description']) : $subtopic['description'];
        $displayOrder = isset($input['display_order']) ? intval($input['display_order']) : $subtopic['display_order'];
        $isPublished = isset($input['is_published']) ? (int)$input['is_published'] : $subtopic['is_published'];

        $updateStmt = $this->db->prepare("UPDATE subtopics SET chapter_id = ?, title = ?, description = ?, display_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $updateStmt->execute([$chapterId, $title, $description, $displayOrder, $isPublished, $id]);

        $this->show($id);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare("SELECT * FROM subtopics WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Subtopic not found']);
            return;
        }

        $delStmt = $this->db->prepare("DELETE FROM subtopics WHERE id = ?");
        $delStmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Subtopic deleted successfully']);
    }

    public function reorder(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['orders']) || !is_array($input['orders'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Orders array required']);
            return;
        }

        $stmt = $this->db->prepare("UPDATE subtopics SET display_order = ? WHERE id = ?");
        foreach ($input['orders'] as $item) {
            if (isset($item['id']) && isset($item['display_order'])) {
                $stmt->execute([intval($item['display_order']), intval($item['id'])]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Subtopics reordered successfully']);
    }
}
