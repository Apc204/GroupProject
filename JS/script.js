
window.onload = function()
{
	
	var generator = generateAndDraw();
	//console.log(maze);
	var jsonMaze = generator.toJSON(Maze);
	console.log(jsonMaze);
	var parsed = JSON.parse(JSON.stringify(jsonMaze));
	console.log(parsed.startpos.x);



	//var prefix = "[MAZE]";
	//var json = prefix.concat(JSON.stringify(jsonMaze));

	//console.log(json);
	//connectToSocket(json, generator);
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
	 var ws = new WebSocket("ws://192.168.0.8:8080");
	 ws.onopen = function()
	 {
	    // Web Socket is connected, send data using send()
	    ws.send(jsonMaze);
    	while (!(receivedMaze.endpos.x == recievedMaze.robotpos.x && receivedMaze.endpos.y == receivedMaze.robotpos.y))
    	{
    		setTimeout(function() { ws.send("STEP"); }, setSpeed)
    		
    	}
    	
    	//alert("Message is sent...");
	 };
	 ws.onmessage = function (evt) 
	 { 
	    var received_msg = evt.data;
	    alert("Message is received... " + evt.data);
	    Maze = JSON.parse(evt.data);
	    generator.drawMaze(receivedMaze);	
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    alert("Connection is closed..."); 
	 };
}



