<?php
session_start();
$error = "";


if (isset($_SESSION['username']))
{
	$username = $_SESSION['username'];
	if (isset($_POST['label'])){$label = $_POST['label'];} // If 'label' POST variable is set, save it.

	// Connect to database.
	$mysqli = new mysqli("localhost", "root","", "CS118");

	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}

	// Delete maze
	$res = $mysqli->query("DELETE  FROM mazes WHERE username='$username' AND label='$label'");

	// If query failed
	if(!$res)
	{
		$error = mysqli_error($mysqli);
		//$error = "A maze with this name already exists.";
	}

}
else
{
	$error = "Please log in to delete mazes.";
}

echo json_encode(array('Error' => $error));

?>