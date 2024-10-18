<?php
header('Content-Type: application/json');

// Read tags from JSON file
function getTags() {
    $jsonContent = file_get_contents('data/tags.json');
    $data = json_decode($jsonContent, true);
    return $data['tags'];
}

$tags = getTags();
echo json_encode($tags);
?>