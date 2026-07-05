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
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['fullName']) || !isset($data['phone'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];
    $fullName = htmlspecialchars($data['fullName']);
    $phone = htmlspecialchars($data['phone']);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid email address']);
        exit;
    }

    // Check if user exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Email already registered']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    try {
        $stmt = $pdo->prepare('INSERT INTO users (full_name, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$fullName, $email, $phone, $hashedPassword]);

        http_response_code(201);
        echo json_encode([
            'message' => 'User registered successfully',
            'userId' => $pdo->lastInsertId()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Registration failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
