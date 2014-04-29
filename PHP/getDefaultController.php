<?php

// Load and echo the example controller
$lines = file('../backend/python/DumboControllerReset.py');
$code = "";

foreach($lines as $line_num => $line)
{
	$code = $code.$line;
}

echo $code;
	
?>