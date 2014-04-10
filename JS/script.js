justLoaded = true;
window.onload = function()
{
	running = false;
	generateAndDraw();
	connectToSocket();
}

function generateAndDraw()
{
	mazeType = "Loopy";
	console.log("1");
	var generator = new Generator();
	generator.clearCanvas();
	if (prims == false)
		generator.generateLoopy();
	else
		generator.generatePrims();

	generator.updateJSON();

	if (justLoaded)
	{
		generator.loadImages();
		//generator.drawRobot(robotposX, robotposY, orientation);
		//generator.drawRobot(1,1,1001);
		//setTimeout(function() { generator.drawMaze(Maze); generator.drawRobot(1,1,1001);}, 1000);
		justLoaded = false;
	}
	else
	{
		generator.fullUpdate(); 
		//generator.drawRobot(1,1,1001);
	}
	
}

function connectToSocket()
{
	 //alert("WebSocket is supported by your Browser!");
	 // Let us open a web socket
	 ws = new WebSocket("ws://localhost:8080");
	 ws.onopen = function()
	 {
	    // Web Socket is connected, send data using send()
	 };
	 ws.onmessage = function (evt) 
	 { 
	 	
	    var received_msg = evt.data;
	    if (received_msg == "READY")
	    {
		   	//sendSteps(ws);
	    }
	    else if (received_msg == "CONNECTED")
	    {
	    	//alert("Connected");
	    }
	    else if (received_msg == "NO_DATA")
	    {
	    	console.log("no data for this step");
	    }
	    else if (startswith(received_msg, "[CONSOLE]") )
	    {
	    	$('#console-code').text($('#console-code').text()+"\n"+received_msg.substring(9));
	    	var psconsole = $('#thisConsole');
            psconsole.scrollTop(
                psconsole[0].scrollHeight - psconsole.height()
            );

	    }
	    else
	    {
	    	var fixedJSON = evt.data.replace(/\'/g,"\"");
	    	var fixedJSON = fixedJSON.replace(/False/g,"false");
	    	console.log(fixedJSON);
	    	//var oldposy = robotposY;
	 		//var oldposx = robotposX;
	 		oldCollisions = collisions;
	    	//alert("Message is received... " + evt.data);
		    var newMaze = JSON.parse(fixedJSON);
		    Maze = newMaze.layout;
		    robotposY = newMaze.robot_pos.y;
		    robotposX = newMaze.robot_pos.x;
		    orientation = newMaze.robot_orientation;
		    collisions = newMaze.collisions;
		    //generator.quickUpdate(Maze,robotposX, robotposY, oldposx, oldposy, newMaze.robot_orientation);
		    generator = new Generator();
		    generator.fullUpdate();
	    }
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    //alert("Connection is closed..."); 
	 };
}

function startswith (string, prefix)
{
	return string.indexOf(prefix) == 0;
}

function sendSteps()
{
	console.log("Sending Step");
	var interval = setInterval(
		function() { 
			if(!paused && running)
			{
				ws.send("STEP"); 
				console.log("sending step ")
			}
			else
			{
				clearInterval(interval)
			}
		}, setSpeed);
}



