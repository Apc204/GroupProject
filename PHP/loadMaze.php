<?php
session_start();
$error = "";
$mazeLabels = [];

if (isset($_SESSION['username']))
{
	$counter = 0;
	$username = $_SESSION['username'];
	$select = $_POST['select'];
	if (isset($_POST['label'])){$label = $_POST['label'];} // If 'label' POST variable is set, save it.

	$mysqli = new mysqli("localhost", "root","", "CS118");

	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}

	// If looking for maze names.
	if ($select == "label")
	{
		$res = $mysqli->query("SELECT $select FROM mazes WHERE username='$username'");
	}
	// If looking for maze states
	else if ($select == "maze")
	{
		$res = $res = $mysqli->query("SELECT $select FROM mazes WHERE label='$label'");
	}

	// If query failed
	if(!$res)
	{
		$error = mysqli_error($mysqli);
		//$error = "A maze with this name already exists.";
	}
	else
	{
		// Loop through results and store them in an array.
		while ($row = $res->fetch_assoc())
		{
			$mazeLabels[$counter++] = $row[$select];
		}
	}
}
else
{
	$error = "Please log in to load mazes.";
}

echo json_encode(array('mazeLabels' => $mazeLabels, 'Error' => $error));

?>