<?php
session_start();
$results = [];
$error = "";
$x = 0;

if (isset($_SESSION['username']))
{
	$query = $_POST['Query'];

	$username = $_SESSION['username'];
	$mysqli = new mysqli("localhost", "root","", "CS118");
	if ($mysqli->connect_errno){
		echo "Failed to connect to MySQL: (".$mysql->connect_errno.") ".$mysqli->connect_error;
	}

	$res = $mysqli->query($query);
	$error = $res;
	if(!$res)
	{
		//echo "Query Failed";
		$error = "Query Error: ".mysqli_error($mysqli);
	}
	else
	{
		// Loop through results and store them in an array.
		if ($res !== true)
		{
			while ($row = $res->fetch_assoc())
			{
				$results[$x++] = $row;
			}
		}
	}
		
}
else
{
	$error = "Please log in to save mazes.";
}

echo json_encode(array('Results' => $results, 'Error' => $error));

?>