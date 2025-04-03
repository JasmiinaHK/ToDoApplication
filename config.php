<?php
// Prikazivanje svih PHP grešaka
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Konekcija sa bazom
$host = "localhost";
$dbname = "todo_app"; // Proveri da li je ovo ime tvoje baze
$username = "root"; // Ako koristiš XAMPP, ovo ostaje "root"
$password = ""; // Ako nemaš šifru, ostavi prazno

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ Konekcija sa bazom nije uspela: " . $e->getMessage());
}
?>
