
var haveReceived = false;
window.onload = function()
{
	
	var generator = generateAndDraw();
	//console.log(maze);
	var jsonMaze = generator.toJSON(Maze);
	console.log(jsonMaze);
	//var parsed = JSON.parse(JSON.stringify(jsonMaze));
	//console.log(parsed.startpos.x);



	var prefix = "[MAZE]";
	var json = prefix.concat(JSON.stringify(jsonMaze));

	//console.log(json);
	connectToSocket(json, generator);
}

function generateAndDraw()
{
	mazeType = "Loopy";
	console.log("1");
	var generator = new Generator();
	if (mazeType == "Loopy")
		Maze = generator.generateLoopy();
	else
		Maze = generator.generatePrims();

	startX = generator.startX;
	startY = generator.startY;
	endX = generator.endX;
	endY = generator.endY;
	generator.drawMaze(Maze);
	return generator;
}



function connectToSocket(jsonMaze, generator)
{
	 alert("WebSocket is supported by your Browser!");
	 // Let us open a web socket
	 var ws = new WebSocket("ws://192.168.0.6:8080");
	 ws.onopen = function()
	 {
	    // Web Socket is connected, send data using send()
	    ws.send(jsonMaze);    	
    	//alert("Message is sent...");
	 };
	 ws.onmessage = function (evt) 
	 { 
	 	
	    var received_msg = evt.data;
	    if (received_msg == "READY")
	    {
	    	alert("Ready");
		   	sendSteps(ws)
	    }
	    else if (received_msg == "CONNECTED")
	    {
	    	alert("Connected");
	    }
	    else if (received_msg == "NO_DATA")
	    {
	    	console.log("no data for this step");
	    }
	    else
	    {
	    	
	    	fixedJSON = evt.data.replace(/\'/g,"\"");
	    	fixedJSON = fixedJSON.replace(/False/g,"false");
	    	console.log(fixedJSON);
	    	oldposy = robotposY;
	 		oldposx = robotposX;
	 		oldOrientation = 
	    	//alert("Message is received... " + evt.data);
		    newMaze = JSON.parse(fixedJSON);
		    Maze = newMaze.layout;
		    robotposY = newMaze.robot_pos.y;
		    robotposX = newMaze.robot_pos.x;
		    generator.update(Maze,robotposX, robotposY, oldposx, oldposy, newMaze.robot_orientation);
		    haveReceived = true;
	    }
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    alert("Connection is closed..."); 
	 };
}

function sendSteps(ws)
{
	console.log("Sending Step");
	setInterval(function() { ws.send("STEP"); }, setSpeed);
			
}



