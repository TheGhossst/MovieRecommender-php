<?php
header('Content-Type: application/json');

$moviesJson = file_get_contents('data/movies.json');
$tagsJson = file_get_contents('data/tags.json');

echo json_encode([
    'movies' => json_decode($moviesJson, true),
    'tags' => json_decode($tagsJson, true),
    'php_version' => PHP_VERSION,
    'json_last_error' => json_last_error(),
    'json_last_error_msg' => json_last_error_msg()
]);
?>