<?php
// backend/src/Controllers/DocumentController.php
require_once dirname(__DIR__, 2) . '/config/Database.php';

class DocumentController {
    private PDO $db;
    private string $storageDir;

    public function __construct() {
        $this->db = Database::getConnection();
        $this->storageDir = dirname(__DIR__, 2) . '/storage/pdfs';
        if (!is_dir($this->storageDir)) {
            @mkdir($this->storageDir, 0777, true);
        }
    }

    public function index(): void {
        $subtopicId = isset($_GET['subtopic_id']) ? intval($_GET['subtopic_id']) : null;
        $includeUnpublished = isset($_GET['all']) && $_GET['all'] === 'true';

        $sql = "SELECT d.*, 
                s.title as subtopic_title,
                ch.id as chapter_id,
                ch.title as chapter_title,
                c.id as category_id,
                c.title as category_title
                FROM documents d
                JOIN subtopics s ON s.id = d.subtopic_id
                JOIN chapters ch ON ch.id = s.chapter_id
                JOIN categories c ON c.id = ch.category_id ";

        $where = [];
        $params = [];

        if ($subtopicId !== null) {
            $where[] = "d.subtopic_id = ?";
            $params[] = $subtopicId;
        }

        if (!$includeUnpublished) {
            $where[] = "d.is_published = 1";
        }

        if (!empty($where)) {
            $sql .= "WHERE " . implode(' AND ', $where) . " ";
        }

        $sql .= "ORDER BY d.created_at DESC, d.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $documents = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $documents]);
    }

    public function show(int $id): void {
        $stmt = $this->db->prepare("SELECT d.*, 
            s.title as subtopic_title,
            ch.id as chapter_id,
            ch.title as chapter_title,
            c.id as category_id,
            c.title as category_title
            FROM documents d
            JOIN subtopics s ON s.id = d.subtopic_id
            JOIN chapters ch ON ch.id = s.chapter_id
            JOIN categories c ON c.id = ch.category_id
            WHERE d.id = ?");
        $stmt->execute([$id]);
        $document = $stmt->fetch();

        if (!$document) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Document not found']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $document]);
    }

    public function getBySubtopic(int $subtopicId): void {
        $stmt = $this->db->prepare("SELECT d.*, 
            s.title as subtopic_title,
            ch.id as chapter_id,
            ch.title as chapter_title,
            c.id as category_id,
            c.title as category_title
            FROM documents d
            JOIN subtopics s ON s.id = d.subtopic_id
            JOIN chapters ch ON ch.id = s.chapter_id
            JOIN categories c ON c.id = ch.category_id
            WHERE d.subtopic_id = ? AND d.is_published = 1");
        $stmt->execute([$subtopicId]);
        $document = $stmt->fetch();

        if (!$document) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'No active document for this subtopic']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $document]);
    }

    public function stream(int $id): void {
        $stmt = $this->db->prepare("SELECT * FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $doc = $stmt->fetch();

        if (!$doc) {
            http_response_code(404);
            echo "Document not found";
            exit;
        }

        $filePath = dirname(__DIR__, 2) . '/' . ltrim($doc['storage_path'], '/');
        if (!file_exists($filePath)) {
            // Also check directly inside storageDir
            $altPath = $this->storageDir . '/' . basename($doc['storage_path']);
            if (file_exists($altPath)) {
                $filePath = $altPath;
            } else {
                http_response_code(404);
                echo "Physical file missing on server";
                exit;
            }
        }

        $fileSize = filesize($filePath);
        $fileName = $doc['original_filename'];
        $isDownload = isset($_GET['download']) && $_GET['download'] === '1';

        // Clear output buffering
        while (ob_get_level()) {
            ob_end_clean();
        }

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS");
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges");
        header('Content-Type: application/pdf');
        header('Accept-Ranges: bytes');
        header('Cache-Control: public, max-age=86400');

        if ($isDownload && $doc['allow_download'] == 1) {
            header('Content-Disposition: attachment; filename="' . addslashes($fileName) . '"');
        } else {
            header('Content-Disposition: inline; filename="' . addslashes($fileName) . '"');
        }

        // Support HTTP Range requests for fast PDF viewing & jumping
        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            if (preg_match('/bytes=(\d+)-(\d*)/', $range, $matches)) {
                $start = intval($matches[1]);
                $end = !empty($matches[2]) ? intval($matches[2]) : ($fileSize - 1);

                if ($start >= $fileSize || $end >= $fileSize || $start > $end) {
                    http_response_code(416);
                    header("Content-Range: bytes */{$fileSize}");
                    exit;
                }

                $length = $end - $start + 1;
                http_response_code(206);
                header("Content-Range: bytes {$start}-{$end}/{$fileSize}");
                header("Content-Length: {$length}");

                $fp = fopen($filePath, 'rb');
                fseek($fp, $start);
                echo fread($fp, $length);
                fclose($fp);
                exit;
            }
        }

        header("Content-Length: {$fileSize}");
        readfile($filePath);
        exit;
    }

    public function upload(): void {
        if (!isset($_FILES['pdf_file']) || $_FILES['pdf_file']['error'] !== UPLOAD_ERR_OK) {
            $errCode = $_FILES['pdf_file']['error'] ?? 'no_file';
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "File upload error: {$errCode}"]);
            return;
        }

        $subtopicId = isset($_POST['subtopic_id']) ? intval($_POST['subtopic_id']) : null;
        if (!$subtopicId) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'subtopic_id is required']);
            return;
        }

        // Check if subtopic exists
        $checkStmt = $this->db->prepare("SELECT id, title FROM subtopics WHERE id = ?");
        $checkStmt->execute([$subtopicId]);
        $subtopic = $checkStmt->fetch();
        if (!$subtopic) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Subtopic does not exist']);
            return;
        }

        $file = $_FILES['pdf_file'];
        $originalName = basename($file['name']);
        $fileSize = $file['size'];
        $tmpPath = $file['tmp_name'];

        // Maximum 50MB
        if ($fileSize > 50 * 1024 * 1024) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'File size exceeds 50MB limit']);
            return;
        }

        // Validate PDF extension & Magic Bytes
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if ($ext !== 'pdf') {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Invalid file extension. Only .pdf files allowed']);
            return;
        }

        $handle = fopen($tmpPath, 'rb');
        $magicBytes = fread($handle, 4);
        fclose($handle);
        if ($magicBytes !== '%PDF') {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Invalid PDF file content. Magic header %PDF not found']);
            return;
        }

        // Generate sanitized unique filename
        $safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
        $savedFilename = 'doc_' . $subtopicId . '_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.pdf';
        $destination = $this->storageDir . '/' . $savedFilename;
        $storagePath = 'storage/pdfs/' . $savedFilename;

        if (!move_uploaded_file($tmpPath, $destination)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to save uploaded file']);
            return;
        }

        $title = !empty($_POST['title']) ? trim($_POST['title']) : ($subtopic['title'] . ' - దస్త్రం');
        $allowDownload = isset($_POST['allow_download']) ? (int)$_POST['allow_download'] : 1;
        $isPublished = isset($_POST['is_published']) ? (int)$_POST['is_published'] : 1;

        // Check if an existing document was attached to this subtopic
        $existStmt = $this->db->prepare("SELECT id, storage_path FROM documents WHERE subtopic_id = ?");
        $existStmt->execute([$subtopicId]);
        $existing = $existStmt->fetch();

        if ($existing) {
            // Unlink old file if exists
            $oldPath = dirname(__DIR__, 2) . '/' . ltrim($existing['storage_path'], '/');
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }

            $updateStmt = $this->db->prepare("UPDATE documents SET title = ?, storage_path = ?, original_filename = ?, file_size = ?, mime_type = 'application/pdf', allow_download = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$title, $storagePath, $originalName, $fileSize, $allowDownload, $isPublished, $existing['id']]);
            $docId = $existing['id'];
        } else {
            $insertStmt = $this->db->prepare("INSERT INTO documents (subtopic_id, title, storage_path, original_filename, file_size, mime_type, allow_download, is_published) VALUES (?, ?, ?, ?, ?, 'application/pdf', ?, ?)");
            $insertStmt->execute([$subtopicId, $title, $storagePath, $originalName, $fileSize, $allowDownload, $isPublished]);
            $docId = $this->db->lastInsertId();
        }

        $this->show((int)$docId);
    }

    public function update(int $id): void {
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $this->db->prepare("SELECT * FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $doc = $stmt->fetch();
        if (!$doc) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Document not found']);
            return;
        }

        $title = isset($input['title']) ? trim($input['title']) : $doc['title'];
        $allowDownload = isset($input['allow_download']) ? (int)$input['allow_download'] : $doc['allow_download'];
        $isPublished = isset($input['is_published']) ? (int)$input['is_published'] : $doc['is_published'];

        $upStmt = $this->db->prepare("UPDATE documents SET title = ?, allow_download = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upStmt->execute([$title, $allowDownload, $isPublished, $id]);

        $this->show($id);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare("SELECT * FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $doc = $stmt->fetch();
        if (!$doc) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Document not found']);
            return;
        }

        $filePath = dirname(__DIR__, 2) . '/' . ltrim($doc['storage_path'], '/');
        if (file_exists($filePath)) {
            @unlink($filePath);
        }

        $delStmt = $this->db->prepare("DELETE FROM documents WHERE id = ?");
        $delStmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Document deleted successfully']);
    }
}
