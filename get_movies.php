<?php
header('Content-Type: application/json');

// Read movies from JSON file
function getMovies() {
    try {
        $jsonContent = file_get_contents('data/movies.json');
        if ($jsonContent === false) {
            throw new Exception('Unable to read movies data');
        }
        
        $data = json_decode($jsonContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON format');
        }
        
        return $data['movies'] ?? [];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Get tags from POST request
$requestTags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];
$movies = getMovies();

if (empty($requestTags)) {
    echo json_encode($movies);
} else {
    // Filter movies by tags
    $filteredMovies = array_filter($movies, function($movie) use ($requestTags) {
        if (!isset($movie['tags']) || !is_array($movie['tags'])) {
            return false;
        }
        $movieTags = array_map('strtolower', $movie['tags']);
        $requestTags = array_map('strtolower', $requestTags);
        return count(array_intersect($requestTags, $movieTags)) === count($requestTags);
    });
    
    echo json_encode(array_values($filteredMovies));
}
?>