<?php
session_start();
$success = false;
$error = "";
if (isset($_SESSION['username']))
{
	$maze = $_POST['maze'];
	$username = $_SESSION['username'];
	$mazehash = sha1($_POST['maze']);
	$label = $_POST['label'];
	$mysqli = new mysqli("localhost", "root","", "CS118");
	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}
	$res = $mysqli->query("INSERT INTO mazes VALUES ('$username', '$maze', '$mazehash', '$label')");
	if(!$res)
	{
		//echo "Query Failed";
		//$error = $mysqli->error();
	}
	else
	{
		$success = true;
	}
}
else
{
	$error = "Log In";
}

echo json_encode(array('Succeeded' => $success, 'Error' => $error));

?>