<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Login</title>
	<link rel="stylesheet" href="login-styles.css">
    <style>
        
    </style>
</head>
<body id="login-body">
    <div class="login-container">
        <h1>Dashboard Login</h1>
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
        <form action="dashboard.php">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
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