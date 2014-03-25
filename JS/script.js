justLoaded = true;
window.onload = function()
{
	running = false;
	generateAndDraw();
	connectToSocket();
}

function updateJson(generator)
{
	
}

function generateAndDraw()
{
	mazeType = "Loopy";
	console.log("1");
	var generator = new Generator();
	generator.clearCanvas();
	if (prims == false)
		Maze = generator.generateLoopy();
	else
		Maze = generator.generatePrims();
	var jsonMaze = generator.toJSON(Maze);
	var prefix = "[MAZE]";
	json = prefix.concat(JSON.stringify(jsonMaze));
	if (justLoaded)
	{
		setTimeout(function() { generator.drawMaze(Maze); generator.drawRobot(1,1,1001);}, 1000);
		justLoaded = false;
	}
	else
	{
		generator.drawMaze(Maze); 
		generator.drawRobot(1,1,1001);
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
	    else
	    {
	    	fixedJSON = evt.data.replace(/\'/g,"\"");
	    	fixedJSON = fixedJSON.replace(/False/g,"false");
	    	//console.log(fixedJSON);
	    	oldposy = robotposY;
	 		oldposx = robotposX;
	    	//alert("Message is received... " + evt.data);
		    newMaze = JSON.parse(fixedJSON);
		    Maze = newMaze.layout;
		    robotposY = newMaze.robot_pos.y;
		    robotposX = newMaze.robot_pos.x;
		    orientation = newMaze.robot_orientation;
		    //generator.quickUpdate(Maze,robotposX, robotposY, oldposx, oldposy, newMaze.robot_orientation);
		    generator = new Generator();
		    generator.fullUpdate(Maze,robotposX, robotposY, orientation);
	    }
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    //alert("Connection is closed..."); 
	 };
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



