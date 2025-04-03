<?php
session_start();
require_once "config.php";

if (!isset($_SESSION["user_id"])) {
    die("❌ Niste prijavljeni!");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task_id = $_POST["task_id"];

    $stmt = $conn->prepare("UPDATE tasks SET status = 'completed' WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$task_id, $_SESSION["user_id"]])) {
        echo "✅ Zadatak označen kao završen!";
    } else {
        echo "❌ Greška pri ažuriranju zadatka!";
    }
}
?>
