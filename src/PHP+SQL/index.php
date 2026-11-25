<?php
include_once('inc/session.php');
if (isset($_SESSION['user_id'])) {
	header("Location: /");
	exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pinterest Login</title>
	<link rel="stylesheet" href="css/login-styles.css">
    <style>
        
    </style>
</head>
<body id="login-body">
    <div class="login-container">
        <h1>Pinterest Login</h1>
        <!-- Display error messages if necessary -->
    <?php
	if (isset($_GET ['error'])) {
	?>
		<div class="error-message">
            Invalid username or password.
        </div>
	<?php
	}
	?>
        <form action="/php-auth/authenticate.php" method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="userName" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="login-btn">Login</button>
        </form>
    </div>
</body>
</html>


