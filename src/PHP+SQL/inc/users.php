<?php 
	include_once ('dbconnect.php');	
	$stmt = $pdo->query ("SELECT * FROM users");
	$users = $stmt->fetchAll();
?>		
<div id="users">
	<h4>Manage Users</h4>
	<table>
		<tbody>
			<tr>
				<th>User ID</th>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Username</th>
				<th>Email</th>
				<th></th>
				<th></th>
			</tr>
			<?php
				for ($i = 0; $i < count($users); $i++)
					{
					//echo users[$i]["firstName"];
			?>		
				<tr>
					<td><?php echo $users[$i] ["id"]?></td>
					<td><?php echo $users[$i] ["first_name"]?></td>
					<td><?php echo $users[$i] ["last_name"]?></td>
					<td><?php echo $users[$i] ["username"]?></td>
					<td><?php echo $users[$i] ["email"]?></td>
					<td><button id="edit-1" class="edit">Edit</button></td>
					<td><button id="delete-1" class="delete">Delete</button></td>
				</tr>
			<?php
					}
			?>
		</tbody>
	</table>
</div>