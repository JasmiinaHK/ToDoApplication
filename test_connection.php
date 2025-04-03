<?php
require_once "config.php";

try {
    $stmt = $conn->query("SELECT 1");
    echo "✅ Konekcija sa bazom je uspešna!";
} catch (PDOException $e) {
    die("❌ Greška sa bazom: " . $e->getMessage());
}
?>
