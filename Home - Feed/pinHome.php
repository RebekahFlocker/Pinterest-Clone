<?php 
	//http://localhost/dashboard/dashboard.php?user=Rebekah&id=900393809
	//var_dump ($_GET);


	$users = 
		[ 
			["id" => 0, "firstName" => "Macrae", "lastName" => "Cain", "userName" => "mcain", "password" => "123", "eMail" => "mcain@gwinnetttech.edu"], 
			["id" => 1, "firstName" => "Bob", "lastName" => "Smith", "userName" => "bsmith681", "password" => "123", "eMail" => "bsmith681@gmail"], 
			["id" => 2, "firstName" => "Sally", "lastName" => "Sue", "userName" => "ssue1986", "password" => "123", "eMail" => "ssue1986@yahoo"],
			["id" => 3, "firstName" => "Jenn", "lastName" => "Jones", "userName" => "jjones1975", "password" => "123", "eMail" => "jjones@gwinnetttech.edu"],
			["id" => 4, "firstName" => "Olivia", "lastName" => "Cain", "userName" => "occain2015", "password" => "123", "eMail" => "occain@gwinnetttech.edu"],
			["id" => 900393809, "firstName" => "Rebekah", "lastName" => "Flocker", "userName" => "rflock", "password" => "305", "eMail" => "rFlocke3809@student.gwinnetttech.edu"]
		];
if ($_GET ['username'] == 'rflock') 
{ 
?>
<pre>
<?php 
//var_dump ($users); 
?>
</pre>

<!DOCTYPE html>
<html lang="en">
    <head>
		<link rel="stylesheet" href="styles.css">
	</head>
	
	<body>
        
        <section id="dashboard">
            <h1>Dashbaord</h1>
            <div>ID: <?php echo $users [5] ["id"]  ?> </div>
			<div>Name: <?php echo $users [5] ["firstName"] ." ". $users [5] ["lastName"] ?> </div>
            <div>Username: <?php echo $users [5] ["userName"] ?> </div>
            <div>Email: <?php echo $users [5] ["eMail"] ?> </div>
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
							<td><?php echo $users[$i] ["firstName"]?></td>
							<td><?php echo $users[$i] ["lastName"]?></td>
							<td><?php echo $users[$i] ["userName"]?></td>
							<td><?php echo $users[$i] ["eMail"]?></td>
							<td><button id="edit-1" class="edit">Edit</button></td>
							<td><button id="delete-1" class="delete">Delete</button></td>
						</tr>
					<?php
							}
					?>
                    
                    </tbody>
                </table>
            </div>
            
           
        </section>
    </body>
</html>

<?php
}
else { 
//echo "Not Granted Access!";
header ("Location: login.php?error");
}
?>
