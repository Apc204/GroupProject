
window.onload = function()
{
	mazeType = "Loopy";
	console.log("1");
	if (mazeType == "Loopy")
	{
		var generator = new PrimGenerator();
		var maze = generator.generateLoopy();
	}
	//LoopyGenerator.prototype = new PrimGenerator();
	//var generator = new LoopyGenerator();
	//console.log(generator.PASSAGE);
	//console.log(PrimGenerator.prototype);
	//LoopyGenerator.prototype = new PrimGenerator();
	//console.log(LoopyGenerator.prototype);
	//var maze = generator.generateMaze();
	startX = generator.startX;
	startY = generator.startY;
	endX = generator.endX;
	endY = generator.endY;
	generator.drawMaze(maze);

	//console.log(maze);
	var jsonLayout = JSON.stringify(maze);
	var jsonMaze = {
		"layout": jsonLayout,
		"startpos" : {
			"x": startX,
			"y": startY
		},
		"robotpos" : {
			"x":startX,
			"y": startY
		},
		"robot-orientation":"NORTH",
		"finishpos" : {
			"x" : endX,
			"y" : endY
		} 
	};
	var prefix = "[MAZE]";
	var json = prefix.concat(JSON.stringify(jsonMaze));

	console.log(json);
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
	    ws.send("STEP");
	    alert("Message is sent...");
	 };
	 ws.onmessage = function (evt) 
	 { 
	    var received_msg = evt.data;
	    alert("Message is received... " + evt.data);
	 };
	 ws.onclose = function()
	 { 
	    // websocket is closed.
	    alert("Connection is closed..."); 
	 };
}



