var setWidth = 10;
var setHeight = 10;
var setSpeed = 500;
var largeCanvasWidth = 0;
var largeCanvasHeight = 0;
var prims = true;
var running = false;
var paused = false;
var code;
var fullScreen = true;
var dragging = false;
var ex = 0;

function uploadCode(num, file) {
	var reader = new FileReader();			
	reader.readAsText(file);
	reader.onload = function(e) {
		code = reader.result;
		console.log(code);
		$('#upload-code-'+num).show();
		$('#upload-text-'+num).val(file.name);
	}
}

$().ready(function () {
	$('.upload-code').hide();
	$(".question").popover();
	var loggedIn;

	// Display either login or logout button based on results of ajax request which checks if a user is logged in.
	$.ajax({
		'async':false,
		'global':false,
		'url':'../PHP/isLogged.php',
		'success':function(resp){
			parsed = JSON.parse(resp);
			if (parsed.logged == true)
			{
				loggedIn = true;
				$('#login-button').hide();
			}
			else
			{
				loggedIn = false;
				$('#logout-button').hide();
			}
		}
	});


	//Create canvas event listeners
	var generator = new Generator();
	canvas = generator.findCanvasProperties();
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	
	//Handle file upload
	var fileInput = document.getElementById('uploadBox');
	var fileInput2 = document.getElementById('uploadBox2');
	var fileInput3 = document.getElementById('uploadBox3');
	
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		uploadCode(1, file);
		// var textType = /text.*/;
		// if (file.type.match(textType)) {
	});

	fileInput2.addEventListener('change', function(e) {
		var file = fileInput2.files[0];
		uploadCode(2, file);
	});

	fileInput3.addEventListener('change', function(e) {
		var file = fileInput3.files[0];
		uploadCode(3, file);
	});

	var width = $(window).innerWidth();
	var height = $(window).innerHeight();


	//Calculate div sizes
	var mazeOptionsWidth = 400;
	var bothWidth = width - mazeOptionsWidth - 200 // -400 for the maze options, -40 for 20px padding everywhere

	// $('#code-div').css("width", bothWidth/2);
	// $('#code-textarea').css("width", bothWidth/2);
	// $('#code-textarea').css("height", height-200);

	$('#console-div').css("width", bothWidth/2);
	$('.console').css("width", bothWidth/2);
	$('.console').css("height", height-300);
	$('.display-pre').css("max-height", height-320);

	//Initialise sliders
	$('.slider').slider().on('slideStop', function(ev){
		//get the slider value
		var val = ev.value;
		//get the name of the question we're working with
		var name = $(this).attr('id');
		//assign this value to the correct value box
	
		updateVariable(name, val);
	});

	//Set full-screen div size for canvas
	//$('#large-canvas').css("height", height-200);
	//$('#large-canvas').css("width", height-200);
	var canvas = document.getElementById('large-canvas');
	canvas.width = height-200;
	canvas.height = height-200;

	largeCanvasHeight = height - 200;
	largeCanvasWidth = height - 200;

	//see if there's enough space left to display a console
	var spaceLeft = width - height - 300;

	if (spaceLeft > 200) {
		$('#large-console-div').css("width", spaceLeft);
	} else {	
		$('#large-console-div').hide();
	}

	//change the slider if the text box value is changed, and the slider & textbox on full screen/default screen
	$('.val').keyup(function() {
		//get the name of the question we're working with. Substring with 4 to remove the val- from the beginning.
		var name = $(this).attr('name');
		
		var val = $(this).val();
		$('#'+name).slider('setValue', val);
		$('.val-'+name).val(val);

		updateVariable(name, val);
	});

	//check the value if the user inputted something manually
	$('.val').focusout(function() {
		//get the name of the question we're working with. Substring with 4 to remove the val- from the beginning.
		var name = $(this).attr('name');

		//get the value
		var value = $(this).val();

		//Check it's a number
		if( Math.floor(value) != value || !$.isNumeric(value) || value == "") {
			$(this).val('');
			alert("Please enter an integer between 1 and 10.");
			$(this).focus();
		}

		//if it's greater than 10 round it down to 10, and round it up to 0 if it's negative
		if (value > 200) {
			$(this).val('200');
			value = 10;
		} else if (value < 0) {
			$(this).val('0');
			value = 0;
		}

		// Set the value of the text box to the old settings if the changes were not allowed, has no effect if the changes went through.
		if (name == 'width')
		{
			$(this).val(setWidth);
		}
		else if (name == 'height')
		{
			$(this).val(setHeight);
		}
		else if (name == 'speed')
		{
			$(this).val(setSpeed);
		}
	});
});

function mouseDown(event)
{
	// Find co-ordinates of the click position on the canvas.
	mazeCoords = findMazeCoordinates(event);
	var generator = new Generator();
	var mazePosX = mazeCoords.x;
	var mazePosY = mazeCoords.y;

	if ((robotposY != mazePosX || robotposX != mazePosY) && (endposY != mazePosX || endposX != mazePosY)) // If editing maze layout and not moving robot.
	{
		if (Maze[mazePosX][mazePosY] == 3000)
		{
			Maze[mazePosX][mazePosY] = 3001;
		}
		else
		{
			Maze[mazePosX][mazePosY] = 3000;
		}
		generator.updateJSON();
		generator.fullUpdate();
	}
	else if (robotposY == mazePosX && robotposX == mazePosY) // If clicking the robot to move it.
	{
		dragging = true;
	}
}

function mouseUp(event)
{
	dragging = false;
}

function mouseMove(event)
{
	
	if (dragging == true) // If dragging the robot
	{
		var generator = new Generator();
		var mazeCoords = findMazeCoordinates(event);
		var mazePosX = mazeCoords.x;
		var mazePosY = mazeCoords.y;

		if (Maze[mazePosX][mazePosY] == 3001)
		{
			
			if (robotposY != mazePosX || robotposX != mazePosY) // Only redraw if robot position has changed to reduce computation.
			{
				robotposY = mazePosX;
				robotposX = mazePosY;
				generator.updateJSON();
				generator.fullUpdate();
			}
			
		}

	}
}

function findMazeCoordinates(event)
{
	var x = event.x;
	var y = event.y;
	var returnObject = new Object();
	var generator = new Generator();
	var adjustments = generator.getBlockSize();
	var blockSize = adjustments.blockSize;
	var canvas = generator.findCanvasProperties();
	x = (x-canvas.offsetLeft)-adjustments.xOffset;
  	y = (y-canvas.offsetTop)-adjustments.yOffset;
  	var mazePosX = Math.ceil(x/blockSize)-1;
  	var mazePosY = Math.ceil(y/blockSize)-1;
	//console.log(mazePosX);
	//console.log(mazePosY);
	//console.log(Maze[mazePosX][mazePosY]);
	returnObject.x = mazePosX;
	returnObject.y = mazePosY;
	return returnObject;

}

function updateVariable(name, val)
{
	if (name == 'speed')
	{
		if (paused == true || (running == false && paused == false))
		{
			setSpeed = val;
			$('.val-speed').val(setSpeed)
		}
		else
		{
			alert("Pause or stop the run to update robot speed.");
			$('#speed').slider('setValue', setSpeed); // Return slider to original value.

		}
	}
	else if (name == 'width')
	{
		if (running == false)
		{
				setWidth = val;
				$('.val-width').val(setWidth)
		}
		else
		{
			alert("Stop the run to update maze width.");
			$('#width').slider('setValue', setWidth); // Return slider to original value.

		}
	}
	else if (name == 'height')
	{
		if (running == false)
		{
				setHeight = val;
				$('.val-height').val(setHeight)
		}
		else
		{
			alert("Stop the run to update maze height.");
			$('#height').slider('setValue', setHeight); // Return slider to original value.
		}
	}
}

$(document).on('change', '.btn-file :file', function() {
    // var file = document.form1.uploadBox.value;
    var file = $('#uploadBox').val().substring(12);
    $('#upload-box-init').val(file);    
});

function displayMazes(titles) {
	var titlesDiv = $('#maze-list-div');
	console.log(titles);
	if (titles.length == 0) 
	{
		titlesDiv.text("You have no saved mazes.");
	} 
	else 
	{
		titlesDiv.text("Choose a maze to load:");
		titlesDiv.append("<br><br>");
		for (var i = 0; i < titles.length; i++)
		{
			titlesDiv.append("<button type='button' class='btn btn-default maze-choice' name=\""+titles[i]+"\">"+titles[i]+"</button><br><br>");
		}

		// Create handler for when the choices are clicked.
		$('.maze-choice').click(function(){
			loadMaze($(this).attr('name'));
		});

	}
}

$('#load-maze').click(function() {
	request = $.ajax({
        url: "../PHP/loadMaze.php",
        type: "post",
        data: {select: "label"}
    });

    request.done(function(response, textStatus, jqXHR){
    	var mazes = JSON.parse(response);
    	displayMazes(mazes.mazeLabels);
    });
	//displayMazes();
});

// $('#upload-code').click(function() {
// 	var  file = document.form2.uploadBox.value;
// 	if (file == "") {
// 		alert("Please upload a file.");
// 	} else {
// 		$('#code-textarea').text("SECOND CODE\npublic class Scribble extends Applet {private int last_x = 0;\nprivate int last_y = 0;\nprivate Color current_color = Color.black;\nprivate Button clear_button;\nprivate Choice color_choices;\n// Called to initialize the applet.\npublic void init() {\n// Set the background color\nthis.setBackground(Color.white);\n// Create a button and add it to the applet.\n// Also, set the button's colors        this.add(color_choices);\n}\n\n// Called when the user clicks the button or chooses a color\npublic boolean action(Event event, Object arg) {\n// If the Clear button was clicked on, handle it.\nif (event.target == clear_button) {\nGraphics g = this.getGraphics();\nRectangle r = this.bounds();");

// 		$('.to-reveal').show();
// 		$('.to-hide').hide();
// 	}
// });

function loadMaze(label) {
	request = $.ajax({
        url: "../PHP/loadMaze.php",
        type: "post",
        data: {select: "maze", label: label}
    });

    request.done(function(response, textStatus, jqXHR){
    	var mazes = JSON.parse(response);
    	Maze = JSON.parse(mazes.mazeLabels[0]);
    	var generator = new Generator();
    	robotposX = 1;
    	robotposY = 1;
    	running = false;
    	paused = false;
    	generator.updateJSON();
		generator.clearCanvas();
    	generator.fullUpdate();

    	console.log(Maze);
    });
}

$('.upload-code').click(function() {
	$('#code-code').text(code);
	$('.display-div').show();
	$('#code-preview').hide();
	$('#console-preview').hide();
	$('#upload-text-1').val("");
	$('#console-code').text("This will display the console printout.");
	$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
});

$('#help-button').click(function () {
	$('#pop-up').toggle();
});

$('.update-maze').click(function(){
	if (running == false)
	{
		var generator = new Generator();
		generator.generate();
		generator.updateJSON();
		generator.clearCanvas();
		generator.fullUpdate();
	}
	else
	{
		alert("Please stop the run before generating a new maze.");
	}
});

$('#full-screen').click(function() {
	$('#hide-full-screen').hide();
	$('#large-canvas-div').show();
	fullScreen = true;
	var generator = new Generator();
	generator.clearCanvas();
	generator.fullUpdate();
});

$('#shrink').click(function() {
	$('#large-canvas-div').hide();
	$('#hide-full-screen').show();
	fullScreen = false;
	var generator = new Generator();
	generator.fullUpdate();
});

$('.prims').click(function() {
	prims = true;
	$('.prims').addClass("active");
	$('.loopy').removeClass("active");
});

$('.loopy').click(function() {
	prims = false;
	$('.loopy').addClass("active");
	$('.prims').removeClass("active");
});

$('.play').click(function() {
	console.log("clicked play");
	if (running == false || paused == true)
	{
		if(!paused)
		{
			console.log("Starting with new Maze");
		   	ws.send(json);
		   	ws.send("[CODE] "+code);
		   	sendSteps();
			running = true;
			paused = false;
		}
		else
		{
			console.log("Resuming.");
			sendSteps();
			running = true;
			paused = false;
		}
	}
});

$('.pause').click(function() {
	console.log("clicked pause");
	paused = true;
});

$('.stop').click(function(){
	running = false;
	ws.send("RESET");
});

$('.login').click(function(){
	var username = $('.login-username').val();
	var password = $('.login-password').val();
	
	request = $.ajax({
        url: "../PHP/login.php",
        type: "post",
        data: {username: username, password: password}
    });

    request.done(function(response, textStatus, jqXHR){
    	console.log("Response: "+response);
    	console.log("Status: "+textStatus);
    	console.log("jqXHR: "+jqXHR);
    	var parsedResponse = JSON.parse(response);
    	if (parsedResponse.Succeeded == true)
    	{
    		$('#login-button').hide();
    		$('#logout-button').show();
    		$('#myModal').modal('hide')
    	}
    	else
    	{
    		alert("Wrong username and/or password.");
    	}
    	
    	//$('#help-button').show();

    });

});

$('#logout-button').click(function(){
	request = $.ajax({
        url: "../PHP/login.php",
        type: "post",
        data: {}
    });

    request.done(function(response, textStatus, jqXHR){
    	console.log("Response: "+response);
    	console.log("Status: "+textStatus);
    	console.log("jqXHR: "+jqXHR);
    	var parsedResponse = JSON.parse(response);
    	if (parsedResponse.Succeeded == true)
    	{
    		alert("Logged out.");
    		$('#login-button').show();
    		$('#logout-button').hide();
    	}
    	else
    	{
    		alert("Something went wrong.");
    	}
    });
});

$('.save-maze').click(function(){
	var label = prompt("Enter a name to remember this maze by:");
	console.log(JSON.stringify(originalMaze));
	if (label.length != 0)
	{
		request = $.ajax({
        url: "../PHP/saveMaze.php",
        type: "post",
        data: {label: label, maze: JSON.stringify(originalMaze)}
	    });

	    request.done(function(response, textStatus, jqXHR){
	    	console.log(response);
	    	console.log("Response: "+response);
	    	console.log("Status: "+textStatus);
	    	console.log("jqXHR: "+jqXHR);
	    	var parsedResponse = JSON.parse(response);
	    	if (parsedResponse.Succeeded == true)
	    	{
	    		alert("Maze Saved");
	    	}
	    	else
	    	{
	    		alert(parsedResponse.Error);
	    	}

	    });
	}
	
});

$('.exercise').click(function() {
	ex = $(this).text();
	$('#submit-exercise').show();
	$('#choose-exercise-dropdown').text(ex);
	$('#choose-exercise-dropdown').append(" <span class='caret'></span>");
	ex = parseInt(ex.substring(9));
});

$('#submit-exercise').click(function() {
	if (ex == 0) {
		alert("Please choose an exercise. I don't quite know how you clicked that button.");
	} else {
		alert("Submitting exercise " + ex);
		//submit code as exercise ex
	}
});
