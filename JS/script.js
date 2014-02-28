
window.onload = function()
{
	hello();
	mazeType = "Loopy";
	console.log("1");
	if (mazeType == "Loopy")
	{
		var generator = new PrimGenerator();
		var maze = generator.generateLoopy();
	}

	startX = generator.startX;
	startY = generator.startY;
	endX = generator.endX;
	endY = generator.endY;
	generator.drawMaze(maze);

	//console.log(maze);
	var jsonMaze = generator.toJSON(maze);
	console.log(jsonMaze);
	var parsed = JSON.parse(jsonMaze);
	console.log(parsed);



	//var prefix = "[MAZE]";
	//var json = prefix.concat(JSON.stringify(jsonMaze));

	//console.log(json);
	//connectToSocket(json);
}



function connectToSocket(jsonMaze)
{
	 alert("WebSocket is supported by your Browser!");
	 // Let us open a web socket
	 var ws = new WebSocket("ws://192.168.0.8:8080");
	 ws.onopen = function()
	 {
	    // Web Socket is connected, send data using send()
	    ws.send(jsonMaze);
	    	//while (recievedMaze[])
	    	ws.send("STEP");
	    	//alert("Message is sent...");
	 };
	 ws.onmessage = function (evt) 
	 { 
	    var received_msg = evt.data;
	    alert("Message is received... " + evt.data);
	    receivedMaze = JSON.parse(evt.data);
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    alert("Connection is closed..."); 
	 };
}



