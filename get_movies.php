<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$dbname = 'movie';
$user = 'root';
$pass = '';

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die(json_encode(['error' => $e->getMessage()]));
}

// Fetch all movies with tags
$sql = "
    SELECT m.id, m.title, m.year, m.rating, m.image, GROUP_CONCAT(t.name) AS tags
    FROM movies m
    LEFT JOIN movie_tags mt ON m.id = mt.movie_id
    LEFT JOIN tags t ON mt.tag_id = t.id
    GROUP BY m.id
";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$movies = $stmt->fetchAll();

// Get tags from POST request
$tags = json_decode($_POST['tags'] ?? '[]', true);

if (empty($tags)) {
    echo json_encode($movies);
} else {
    // Prepare the query to filter movies by tags
    $placeholders = str_repeat('?,', count($tags) - 1) . '?';
    $sql = "
        SELECT m.id, m.title, m.year, m.rating, m.image, GROUP_CONCAT(t.name) AS tags
        FROM movies m
        LEFT JOIN movie_tags mt ON m.id = mt.movie_id
        LEFT JOIN tags t ON mt.tag_id = t.id
        WHERE t.name IN ($placeholders)
        GROUP BY m.id
        HAVING COUNT(DISTINCT t.name) = ?
    ";
    
    // Add tag count for HAVING clause
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge($tags, [count($tags)]));
    $filteredMovies = $stmt->fetchAll();

    echo json_encode($filteredMovies);
}
?>
