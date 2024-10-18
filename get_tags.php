<?php
// get_tags.php

// Database connection (replace with your actual credentials)
$host = 'localhost';
$dbname = 'movie';
$user = 'root';
$pass = '';

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch tags
$sql = "SELECT * FROM tags";
$result = $conn->query($sql);

// Create an array to hold the tags
$tags = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $tags[] = $row['name'];  // Fetch only the 'name' column
    }
}

// Return tags as JSON
echo json_encode($tags);

// Close the connection
$conn->close();
?>
