<?php
session_start();

if (isset($_SESSION['username']) && isset($_SESSION['clearance']))
{
	$logged = true;
	$clearance = $_SESSION['clearance'];
	$username = $_SESSION['username'];
}
else
{
	$logged = false;
	$clearance = false;
	$username = false;
}

echo json_encode(array('logged' => $logged, 'clearance' => $clearance, 'username' => $username));

?>