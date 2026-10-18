<?php
// backend/src/Middleware/AuthMiddleware.php
require_once dirname(__DIR__) . '/Services/AuthService.php';

class AuthMiddleware {
    public static function authenticate(): ?array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized: Token required']);
            exit;
        }

        $token = $matches[1];
        $payload = AuthService::validateToken($token);

        if (!$payload) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized: Invalid or expired token']);
            exit;
        }

        return $payload;
    }
}
