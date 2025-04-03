<?php
session_start();
require_once "config.php"; // Konekcija sa bazom

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    // Provera da li su polja prazna
    if (empty($email) || empty($password)) {
        die("❌ Email i lozinka su obavezni!");
    }

    // Provera da li korisnik postoji u bazi
    $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["user_name"] = $user["full_name"];

        // **Pravilna redirekcija na todo.php**
        header("Location: todo.php");
        exit(); 
    } else {
        echo "❌ Neispravan email ili lozinka!";
    }
}
?>
