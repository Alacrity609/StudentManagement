<?php

$allowedOrigins = ['http://localhost:8081', 'http://example.com'];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$conn = mysqli_connect("localhost", "root", "", "student_management", "3306");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Function to register a new admin user
function registerAdmin($conn, $username, $password, $email) {
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $query = "INSERT INTO admin (username, password, email) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sss", $username, $passwordHash, $email);
    
    if (mysqli_stmt_execute($stmt)) {
        return true;
    }
    return false;
}

$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';
$email = $input['email'] ?? '';

if (!$username || !$password || !$email) {
    echo json_encode(['status' => 'error', 'message' => 'Username, password, and email are required.']);
    exit;
}

$registrationSuccess = registerAdmin($conn, $username, $password, $email);
if ($registrationSuccess) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'admin' => [
            'username' => $username,
        ],
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
}

mysqli_close($conn);
?>
