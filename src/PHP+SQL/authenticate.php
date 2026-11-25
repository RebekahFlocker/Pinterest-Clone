<?php
	include_once('inc/session.php');
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		header("Location: /php-auth/index.php?error");
		exit();
	}

	include_once ('dbconnect.php');
	if (isset ($_POST['userName']) && isset ($_POST['password']))
	{
		$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND password = ?");
		$stmt->execute([$_POST['userName'], $_POST['password']]);
		$authenticatedUser = $stmt->fetch();

		if ($authenticatedUser !== false)
		{
			session_regenerate_id(true);
			$_SESSION['user_id'] = $authenticatedUser['id'];
			header ("Location: /");
			exit();
		}
		else
		{
			header ("Location: /php-auth/index.php?error");
			exit();
		}
	}
	else
	{
		header ("Location: /php-auth/index.php?error");
		exit();
	}
?>