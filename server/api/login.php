<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
$host = 'localhost';
$db = 'geo_rides';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Email and password are required']);
        exit;
    }

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];

    // Get user from database
    $stmt = $pdo->prepare('SELECT id, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid email or password']);
        exit;
    }

    // Generate JWT token (simple implementation)
    $token = bin2hex(random_bytes(32));

    // Store token in database
    $stmt = $pdo->prepare('UPDATE users SET api_token = ? WHERE id = ?');
    $stmt->execute([$token, $user['id']]);

    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful',
        'token' => $token,
        'userId' => $user['id']
    ]);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
