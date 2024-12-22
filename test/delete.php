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

// Check if a DELETE request was made
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id > 0) {
        $delete_Query = "DELETE FROM students WHERE id = $id";
        
        if (mysqli_query($conn, $delete_Query)) {
            $message = "Student deleted successfully";
            http_response_code(200);
            echo json_encode($message);
        } else {
            $message = "Error deleting student";
            http_response_code(422);
            echo json_encode($message);
        }
    } else {
        $message = "Invalid student ID";
        http_response_code(400);
        echo json_encode($message);
    }
}

mysqli_close($conn);

?>
