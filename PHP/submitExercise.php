<?php
session_start();
$success = false;
$error = "";
if (isset($_SESSION['username']))
{
	$username = $_POST['username'];
	$exercise = $_POST['exercise'];
	$code = $_POST['code'];

	$mysqli = new mysqli("localhost", "root", "" ,"CS118");
	// Add the username, exercise and code to the database. Overwrite the existing extry if one exists.
	$res = $mysqli->query("REPLACE INTO solutions VALUES ('$username', '$exercise', '$code') ");
	if(!$res)
	{
		$error = mysqli_error($mysqli);
	}
	else
	{
		$success = true;
	}
}
else
{
	$error = "Not logged in.";
}

	
echo json_encode(array('Succeeded' => $success, 'Errors' => $error));

?>