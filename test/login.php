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

// Function to authenticate admin user
function authenticateAdmin($conn, $username, $password) {
    $query = "SELECT * FROM admin WHERE username = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $admin = mysqli_fetch_assoc($result);
    
    if ($admin && password_verify($password, $admin['password'])) {
        return $admin; // Return the admin details if authentication is successful
    }
    
    return false; // Return false if authentication fails
}

$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Username and password are required.']);
    exit;
}

$admin = authenticateAdmin($conn, $username, $password);
if ($admin) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'admin' => [
            'username' => $admin['username'],
        ],
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
}

mysqli_close($conn);
?>
