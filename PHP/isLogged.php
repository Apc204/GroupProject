<?php
session_start();

// If logged in, return true.
if (isset($_SESSION['username']) && isset($_SESSION['clearance']))
{
	$logged = true;
	$clearance = $_SESSION['clearance'];
	$username = $_SESSION['username'];
}
// If not logged in, return false.
else
{
	$logged = false;
	$clearance = false;
	$username = false;
}

echo json_encode(array('logged' => $logged, 'clearance' => $clearance, 'username' => $username));

?>