<?php
session_start();

if (isset($_SESSION['username']))
{
	$logged = true;
}
else
{
	$logged = false;
}

echo json_encode(array('logged' => $logged));

?>