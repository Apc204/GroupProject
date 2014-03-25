<?php
session_start()
if (!isset($_SESSION['username']))
{
	$username = $_POST['username'];
	$password = $_POST['password'];
	$passwordHash = sha1($password);
	$success = false;

	// Connect to database.
	$mysqli = new mysqli("localhost", "root", "contentFilter");
	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error
	}

	$res = $mysqli -> query("SELECT * FROM users WHERE username='$username' AND password='$passwordHash'");
	
	if(!$res)
	{
		echo "Query Failed";
	}

	if ($res->numrows == 1)
	{
		$_SESSION['username'] = $username;
		$success = true;
	}

	return $success;
	
}


?>