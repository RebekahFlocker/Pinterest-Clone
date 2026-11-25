<?php
include_once('inc/session.php');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!isset($_SESSION['user_id'])) {
	echo json_encode(['authenticated' => false]);
	exit();
}

include_once('dbconnect.php');
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);

if (!$stmt->fetch()) {
	unset($_SESSION['user_id']);
	echo json_encode(['authenticated' => false]);
	exit();
}

echo json_encode(['authenticated' => true]);
?>
