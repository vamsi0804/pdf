<?php
// backend/public/index.php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

require_once dirname(__DIR__) . '/src/Middleware/CorsMiddleware.php';
require_once dirname(__DIR__) . '/src/Middleware/AuthMiddleware.php';
require_once dirname(__DIR__) . '/src/Controllers/CategoryController.php';
require_once dirname(__DIR__) . '/src/Controllers/ChapterController.php';
require_once dirname(__DIR__) . '/src/Controllers/SubtopicController.php';
require_once dirname(__DIR__) . '/src/Controllers/DocumentController.php';
require_once dirname(__DIR__) . '/src/Controllers/SettingsController.php';
require_once dirname(__DIR__) . '/src/Controllers/AdminController.php';

// Handle CORS
CorsMiddleware::handle();

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Serve static uploaded files if requested
if (str_starts_with($requestUri, '/storage/')) {
    $filePath = dirname(__DIR__) . $requestUri;
    if (file_exists($filePath) && is_file($filePath)) {
        $mime = mime_content_type($filePath);
        header("Content-Type: {$mime}");
        readfile($filePath);
        exit;
    }
}

// Serve assets
if (str_starts_with($requestUri, '/assets/')) {
    $filePath = dirname(__DIR__, 2) . $requestUri;
    if (file_exists($filePath) && is_file($filePath)) {
        $mime = mime_content_type($filePath);
        header("Content-Type: {$mime}");
        readfile($filePath);
        exit;
    }
}

// Serve static JS files (pdf.min.js, pdf.worker.min.js)
if (str_starts_with($requestUri, '/js/')) {
    $filePath = __DIR__ . $requestUri;
    if (file_exists($filePath) && is_file($filePath)) {
        header("Content-Type: application/javascript; charset=utf-8");
        header("Access-Control-Allow-Origin: *");
        readfile($filePath);
        exit;
    }
}

// Serve viewer.php directly
if ($requestUri === '/viewer.php') {
    require __DIR__ . '/viewer.php';
    exit;
}

// Root redirect to /admin/
if ($requestUri === '/' || $requestUri === '') {
    header('Location: /admin/');
    exit;
}

// Serve Admin Dashboard (Static built React SPA - No Node.js required)
if ($requestUri === '/admin' || $requestUri === '/admin/') {
    $adminIndex = __DIR__ . '/admin/index.html';
    if (file_exists($adminIndex)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($adminIndex);
        exit;
    }
}

if (str_starts_with($requestUri, '/admin/')) {
    $filePath = __DIR__ . $requestUri;
    if (file_exists($filePath) && is_file($filePath)) {
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimes = [
            'js' => 'application/javascript; charset=utf-8',
            'css' => 'text/css; charset=utf-8',
            'html' => 'text/html; charset=utf-8',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'json' => 'application/json',
            'ico' => 'image/x-icon',
        ];
        header("Content-Type: " . ($mimes[$ext] ?? 'application/octet-stream'));
        readfile($filePath);
        exit;
    }
    // SPA fallback for deep /admin routes
    $adminIndex = __DIR__ . '/admin/index.html';
    if (file_exists($adminIndex)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($adminIndex);
        exit;
    }
}

// Ensure API endpoints return JSON except for stream and view
if (!str_contains($requestUri, '/stream') && !str_contains($requestUri, '/view') && !str_contains($requestUri, 'viewer.php')) {
    header('Content-Type: application/json; charset=utf-8');
}

// Router
try {
    // Categories
    if ($requestUri === '/api/categories') {
        $controller = new CategoryController();
        if ($method === 'GET') {
            $controller->index();
        } elseif ($method === 'POST') {
            AuthMiddleware::authenticate();
            $controller->store();
        } else {
            methodNotAllowed();
        }
        exit;
    }

    if ($requestUri === '/api/categories/reorder' && $method === 'POST') {
        AuthMiddleware::authenticate();
        (new CategoryController())->reorder();
        exit;
    }

    if (preg_match('#^/api/categories/(\d+)$#', $requestUri, $matches)) {
        $controller = new CategoryController();
        $id = intval($matches[1]);
        if ($method === 'GET') {
            $controller->show($id);
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            AuthMiddleware::authenticate();
            $controller->update($id);
        } elseif ($method === 'DELETE') {
            AuthMiddleware::authenticate();
            $controller->delete($id);
        } else {
            methodNotAllowed();
        }
        exit;
    }

    // Chapters
    if ($requestUri === '/api/chapters') {
        $controller = new ChapterController();
        if ($method === 'GET') {
            $controller->index();
        } elseif ($method === 'POST') {
            AuthMiddleware::authenticate();
            $controller->store();
        } else {
            methodNotAllowed();
        }
        exit;
    }

    if ($requestUri === '/api/chapters/reorder' && $method === 'POST') {
        AuthMiddleware::authenticate();
        (new ChapterController())->reorder();
        exit;
    }

    if (preg_match('#^/api/chapters/(\d+)$#', $requestUri, $matches)) {
        $controller = new ChapterController();
        $id = intval($matches[1]);
        if ($method === 'GET') {
            $controller->show($id);
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            AuthMiddleware::authenticate();
            $controller->update($id);
        } elseif ($method === 'DELETE') {
            AuthMiddleware::authenticate();
            $controller->delete($id);
        } else {
            methodNotAllowed();
        }
        exit;
    }

    // Subtopics
    if ($requestUri === '/api/subtopics') {
        $controller = new SubtopicController();
        if ($method === 'GET') {
            $controller->index();
        } elseif ($method === 'POST') {
            AuthMiddleware::authenticate();
            $controller->store();
        } else {
            methodNotAllowed();
        }
        exit;
    }

    if ($requestUri === '/api/subtopics/reorder' && $method === 'POST') {
        AuthMiddleware::authenticate();
        (new SubtopicController())->reorder();
        exit;
    }

    if (preg_match('#^/api/subtopics/(\d+)$#', $requestUri, $matches)) {
        $controller = new SubtopicController();
        $id = intval($matches[1]);
        if ($method === 'GET') {
            $controller->show($id);
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            AuthMiddleware::authenticate();
            $controller->update($id);
        } elseif ($method === 'DELETE') {
            AuthMiddleware::authenticate();
            $controller->delete($id);
        } else {
            methodNotAllowed();
        }
        exit;
    }

    // Documents
    if ($requestUri === '/api/documents') {
        $controller = new DocumentController();
        if ($method === 'GET') {
            $controller->index();
        } else {
            methodNotAllowed();
        }
        exit;
    }

    if (preg_match('#^/api/documents/subtopic/(\d+)$#', $requestUri, $matches)) {
        (new DocumentController())->getBySubtopic(intval($matches[1]));
        exit;
    }

    if (preg_match('#^/api/documents/(\d+)/stream$#', $requestUri, $matches)) {
        (new DocumentController())->stream(intval($matches[1]));
        exit;
    }

    if (preg_match('#^/api/documents/(\d+)/view$#', $requestUri, $matches)) {
        $_GET['id'] = $matches[1];
        require __DIR__ . '/viewer.php';
        exit;
    }

    if ($requestUri === '/api/documents/upload' && $method === 'POST') {
        AuthMiddleware::authenticate();
        (new DocumentController())->upload();
        exit;
    }

    if (preg_match('#^/api/documents/(\d+)$#', $requestUri, $matches)) {
        $controller = new DocumentController();
        $id = intval($matches[1]);
        if ($method === 'GET') {
            $controller->show($id);
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            AuthMiddleware::authenticate();
            $controller->update($id);
        } elseif ($method === 'DELETE') {
            AuthMiddleware::authenticate();
            $controller->delete($id);
        } else {
            methodNotAllowed();
        }
        exit;
    }

    // Settings
    if ($requestUri === '/api/settings') {
        $controller = new SettingsController();
        if ($method === 'GET') {
            $controller->getSettings();
        } elseif ($method === 'POST') {
            AuthMiddleware::authenticate();
            $controller->updateSettings();
        } else {
            methodNotAllowed();
        }
        exit;
    }

    if ($requestUri === '/api/settings/upload-background' && $method === 'POST') {
        AuthMiddleware::authenticate();
        (new SettingsController())->uploadBackground();
        exit;
    }

    // Admin Auth & Stats
    if ($requestUri === '/api/admin/login' && $method === 'POST') {
        (new AdminController())->login();
        exit;
    }

    if ($requestUri === '/api/admin/stats' && $method === 'GET') {
        AuthMiddleware::authenticate();
        (new AdminController())->stats();
        exit;
    }

    // Health check endpoint
    if ($requestUri === '/' || $requestUri === '/api/health') {
        echo json_encode([
            'success' => true,
            'app' => 'Traditional Telugu Knowledge & PDF Reader API',
            'status' => 'operational',
            'version' => '1.0.0',
            'driver' => Database::getDriver(),
            'timestamp' => date('c')
        ]);
        exit;
    }

    // 404 Not Found
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found', 'path' => $requestUri]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}

function methodNotAllowed(): void {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
