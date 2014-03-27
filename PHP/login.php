<?php
session_start();
unset($_SESSION['username']);
if (!isset($_SESSION['username']))
{
	$username = $_POST['username'];
	$password = $_POST['password'];
	$passwordHash = sha1($password);
	$success = false;

	// Connect to database.
	$mysqli = new mysqli("localhost", "root", "" ,"CS118");
	if ($mysqli->connect_errno){
		//echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}

	$res = $mysqli -> query("SELECT * FROM users WHERE username='$username' AND password='$passwordHash'");
	//print_r($res);

	while($obj = $res->fetch_object())
	{ 
        //print_r($obj); 
    }

	if(!$res)
	{
		echo "Query Failed";
	}

	if ($res->num_rows == 1)
	{
		$_SESSION['username'] = $username;
		$success = true;
	}

	echo json_encode(array('Succeeded' => $success));
}


?>