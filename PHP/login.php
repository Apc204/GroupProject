<?php
session_start();
$success = false;

if (!isset($_SESSION['username']))
{
	$username = $_POST['username'];
	$password = $_POST['password'];
	$passwordHash = sha1($password);

	// Connect to database.
	$mysqli = new mysqli("localhost", "root", "" ,"CS118");
	if ($mysqli->connect_errno){
		//echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}

	$res = $mysqli -> query("SELECT * FROM users WHERE username='$username' AND password='$passwordHash'");

	if(!$res)
	{
		echo "Query Failed";
	}

	if ($res->num_rows == 1)
	{
		$row = $res->fetch_assoc();
		$clearance = $row['clearance'];

		$_SESSION['username'] = $username;
		$_SESSION['clearance'] = $clearance;
		$success = true;
	}

}
else
{
	unset($_SESSION['username']);
	unset($_SESSION['clearance']);
	$success = true;
}

echo json_encode(array('Succeeded' => $success));

?>