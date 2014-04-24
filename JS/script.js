justLoaded = true;

// On load, generate and draw a maze, then connect to the middlware websocket.
window.onload = function()
{
	running = false;
	generator = new Generator();
	generator.generate();
	generator.updateJSON();
	generator.loadImages();
	connectToSocket();
}


function connectToSocket()
{
	 // Open the web socket
	 ws = new WebSocket("ws://localhost:8080");
	 ws.onopen = function()
	 {
	 	// Code executed when the socket is first opened.
	 };

	 // Function executed every time a message is received.
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
	    else // If the data wasn't any of the previous, it is a new maze state. The maze is updated and the new state drawn.
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

// Check if a string starts with another string.
function startswith (string, prefix)
{
	return string.indexOf(prefix) == 0;
}

// Continually send steps until paused or stopped.
function sendSteps()
{
	if (!paused && running)
	{
		setTimeout(function(){
			if (!paused && running)
			{
				ws.send("STEP");
				sendSteps();
			}
		}, setSpeed);
	}
	
}



