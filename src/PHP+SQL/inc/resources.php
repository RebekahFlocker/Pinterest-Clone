<?php
	// these 3 lines basiclly drag data from the db on localhost through dbconnect.php page
	include_once ('dbconnect.php');	// include data from dbconnect.php
	$stmt = $pdo->query ("SELECT * FROM resources"); // ask the pdo to select all from the resource db
	$resources = $stmt->fetchAll(); // fetch and organize the code into the resources page section
?>

<div id="Resources">
	<h4>Manage Resources</h4>
	<div class="resources-container">

		<?php
		for($i = 0; $i < count($resources); $i++)
		{
		?>	
		<div id="resource-0" class="resource-item">
			<img src="<?php echo $resources[$i]['image']?>" alt="Resource Image 0">
			<h3><?php echo $resources[$i]['title']?></h3>
			<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus nisl nunc, ac eleifend enim ultrices quis. Proin posuere, ex quis sollicitudin tempus, felis nulla condimentum ex, vel tempor felis dolor non quam.</span>
			<a href="#">Read More</a>
		</div>
		<?php
		}
		?>
	</div>
</div>