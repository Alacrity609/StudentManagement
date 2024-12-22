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


$EncodedData =  file_get_contents('php://input');
$DecodedData = json_decode($EncodedData, true);

if(isset($DecodedData)){

     //checking field if are not empty   
    if(empty($DecodedData['name']) || empty($DecodedData['grade']) || empty($DecodedData['grade']) ){
        $message = "All Fields are required";
        http_response_code(422);
        echo json_encode($message);
        exit(); 
    }
    $name = $DecodedData['name'];
    $age = (int) $DecodedData['age'];
    $grade = (float) $DecodedData['grade'];


    //handle add the data to the database

    $insert_Query = "INSERT INTO students( name, age, grade) VALUES('$name','$age', '$grade')";
    
    if(mysqli_query($conn, $insert_Query))
    {
        $Message = "Contact saved successfully";
        http_response_code(200);
        echo json_encode($Message);
    }
    else
    {
        $Message = "Saving unsuccessful. Please try again";
        http_response_code(422);
        $JSONMessage = json_encode($Message);
        echo $JSONMessage;
        exit();
    }
    

}
else {
    echo "No data pass";
}

mysqli_close($conn);

?>