<?php

$allowedOrigins = ['http://localhost:8081', 'http://example.com'];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$conn = mysqli_connect("localhost", "root", "", "student_management", "3306");


if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Handle PUT request (for updating student data)
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Get the raw POST data (in JSON format)
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required data is provided
    if (isset($data['id']) && isset($data['name']) && isset($data['age']) && isset($data['grade'])) {
        $id = mysqli_real_escape_string($conn, $data['id']);
        $name = mysqli_real_escape_string($conn, $data['name']);
        $age = mysqli_real_escape_string($conn, $data['age']);
        $grade = mysqli_real_escape_string($conn, $data['grade']);

        // Prepare the SQL UPDATE query
        $sql = "UPDATE students SET name = '$name', age = '$age', grade = '$grade' WHERE id = '$id'";

        // Execute the query
        if (mysqli_query($conn, $sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Student information updated successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update student information.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters.']);
    }
}

// Close the connection
mysqli_close($conn);

?>
