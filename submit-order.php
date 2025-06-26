<?php
// Enable error reporting [[3]]
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS headers [[4]]
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Log incoming data [[5]]
file_put_contents('debug.log', "Raw POST Data:\n" . file_get_contents('php://input') . "\n\n", FILE_APPEND);

// Process data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields [[6]]
if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['address']) || empty($data['cart'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Validate email format [[7]]
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Validate phone number format [[8]]
if (!preg_match('/^[6-9]\d{9}$/', $data['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
    exit();
}

// Simulate order saving [[9]]
echo json_encode(['success' => true, 'message' => 'Order submitted successfully']);
?>