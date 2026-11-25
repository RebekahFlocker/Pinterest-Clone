<?php
if (session_status() === PHP_SESSION_NONE) {
	session_set_cookie_params([
		'httponly' => true,
		'samesite' => 'Lax',
		'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
		'path' => '/',
	]);
	session_start();
}
?>
