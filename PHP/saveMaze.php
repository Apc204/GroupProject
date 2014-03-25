<?php
session_start()
if (isset($_SESSION['username']))
{
	$success = false;
	$maze = $_POST['maze'];
	$mazehash = sha1($_POST['maze']);
	$mysqli = new mysqli("localhost", "root", "contentFilter");
	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error
	}
	$res = $mysqli->query("INSERT INTO mazes VALUES ('username', $maze, $mazehash)");
	if(!$res)
	{
		echo "Query Failed";
	}
	else
	{
		$success = true;
	}
	return $success;
}


?>