<?php
include_once('inc/session.php');

if (!isset($_SESSION['user_id'])) {
	header("Location: index.php?error");
	exit();
}

include_once('dbconnect.php');
$stmt = $pdo->prepare("SELECT id, first_name, last_name, username, email FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch();

if (!$currentUser) {
	unset($_SESSION['user_id']);
	header("Location: index.php?error");
	exit();
}
?>

	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8"> // changes the according to device size
			<link rel="stylesheet" href="css/styles.css">
		</head>
		
		<body>
			
			<section id="dashboard">
				<h1>Dashboard</h1>
				<div>ID: <?php echo htmlspecialchars($currentUser['id'], ENT_QUOTES, 'UTF-8'); ?></div>
				<div>Name: <?php echo htmlspecialchars($currentUser['first_name'] . ' ' . $currentUser['last_name'], ENT_QUOTES, 'UTF-8'); ?></div>
				<div>Username: <?php echo htmlspecialchars($currentUser['username'], ENT_QUOTES, 'UTF-8'); ?></div>
				<div>Email: <?php echo htmlspecialchars($currentUser['email'], ENT_QUOTES, 'UTF-8'); ?></div>
				<?php 	include_once('inc/users.php'); ?>
				<?php 	include_once('inc/resources.php'); ?>			   
			</section>
		</body>
	</html>