<?php
include_once('inc/session.php');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed.']);
	exit();
}

$_SESSION = [];
session_destroy();
setcookie(session_name(), '', [
	'expires' => time() - 3600,
	'path' => '/',
	'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
	'httponly' => true,
	'samesite' => 'Lax',
]);

echo json_encode(['authenticated' => false]);
?>
