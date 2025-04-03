<?php
session_start();
require_once "config.php"; // Konekcija sa bazom

// Debugging: Prikaz POST podataka
echo "<pre>";
print_r($_POST);
echo "</pre>";

// Proveri da li je metod POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = trim($_POST['full_name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    // Provera da li su polja prazna
    if (empty($full_name) || empty($email) || empty($password) || empty($confirm_password)) {
        die("❌ Sva polja su obavezna!");
    }

    // Provera da li se lozinke poklapaju
    if ($password !== $confirm_password) {
        die("❌ Lozinke se ne poklapaju!");
    }

    // Provera da li je email validan
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("❌ Email nije validan!");
    }

    // Provera dužine lozinke
    if (strlen($password) < 6) {
        die("❌ Lozinka mora imati najmanje 6 karaktera!");
    }

    // Provera da li email već postoji u bazi
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        die("❌ Email je već registrovan!");
    }

    // Šifrovanje lozinke pomoću `password_hash`
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Ubacivanje korisnika u bazu
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$full_name, $email, $hashed_password])) {
        echo "✅ Registracija uspešna!";
    } else {
        die("❌ Greška pri unosu u bazu!");
    }
}
?>
