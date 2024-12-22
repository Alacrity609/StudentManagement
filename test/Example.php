<?php

$allowedOrigins = ['http://localhost:8081', 'http://example.com'];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection
$conn = mysqli_connect("localhost", "root", "", "student_management", "3306");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Get the JSON-encoded data from the request
$EncodedData = file_get_contents('php://input');
$DecodedData = json_decode($EncodedData, true);

if (isset($DecodedData)) {
    // Check if required fields are not empty
    if (empty($DecodedData['name']) || empty($DecodedData['grade']) || empty($DecodedData['age'])) {
        $message = "All fields (name, age, grade) are required";
        http_response_code(422);
        echo json_encode($message);
        exit();
    }

    $name = $DecodedData['name'];
    $age = (int) $DecodedData['age'];
    $grade = $DecodedData['grade'];
    $contact = isset($DecodedData['contact']) ? $DecodedData['contact'] : null;
    $address = isset($DecodedData['address']) ? $DecodedData['address'] : null;
    $image = isset($DecodedData['image']) ? base64_decode($DecodedData['image']) : null;

    // Prepare the SQL query to insert the data
    $insert_Query = "INSERT INTO students_data (name, age, grade, contact, address, image) 
                     VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $insert_Query);

    // Bind parameters to the prepared statement
    mysqli_stmt_bind_param($stmt, "sissss", $name, $age, $grade, $contact, $address, $image);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        $Message = "Student saved successfully";
        http_response_code(200);
        echo json_encode($Message);
    } else {
        $Message = "Saving unsuccessful. Please try again";
        http_response_code(422);
        echo json_encode($Message);
        exit();
    }

    // Close the statement
    mysqli_stmt_close($stmt);
} else {
    echo "No data passed";
}

// Close the database connection
mysqli_close($conn);

?>
