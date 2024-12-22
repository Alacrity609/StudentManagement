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

$query = "SELECT * FROM students";
$result = mysqli_query($conn, $query);
$data = [];

if($result){
    $index = 1;
    while($row = mysqli_fetch_assoc($result)){
        $data[] = [
            'id' => $index++,
            'name' => $row['name'],
            'age' => $row['age'],
            'grade' => $row['grade'],
        ];
    }

    echo json_encode($data);

}

mysqli_close($conn);
?>  