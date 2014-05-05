// Initialise global variables and user settings.
var setWidth = 10;
var setHeight = 10;
var setSpeed = 500;
var largeCanvasWidth = 0;
var largeCanvasHeight = 0;
var prims = true;
var running = false;
var paused = false;
var code = "";
var fullScreen = true;
var dragging = false;
var ex = 0;
var mattLeeke = false;
var loggedIn = false;
var username = false;
var clearance = "marker";
var filename = "";
var $codeTab = $('[data-toggle="tab"][href="#code"]');
var $instructionsTab = $('[data-toggle="tab"][href="#instructions"]');
var fileUploaded = false;
var langChosen = false;
var lang = "python";

$codeTab.click(function(e) {      
    e.preventDefault();
    $codeTab.codeTab('show');
});

$instructionsTab.click(function(e) {      
    e.preventDefault();
    $codeTab.codeTab('show');
});

$('#show-instructions').click(function() {
	$instructionsTab.show();
	$instructionsTab.tab("show");
	$('#pop-up').toggle();
})

function uploadCode(file) {
	var reader = new FileReader();			
	reader.readAsText(file);
	reader.onload = function(e) {
		code = reader.result;		
		console.log(code);
		$('#upload-text').val(file.name);
		filename = file.name;
		fileUploaded = true;
		if (langChosen) {
			displaySubmit();
		}
	}
}

// When the document loads.
$().ready(function () {
	$('.upload-code').hide();
	$(".question").popover();

	// Check whether user is logged in and change page settings.
	checkLoginStatus();
	
	console.log(clearance);
	if (clearance == "student") {
		console.log("Show student div");
		$('#submit-mark-div').hide();
		console.log("Student div shown");
	} else if (clearance == "marker") {
		console.log("Show marker div");
		getStudents();
		$('#submit-exercise-div').hide();
		$('#choose-exercise-dropdown-marker').hide();
		$('#submit-mark').hide();
		$('#mark-text').hide();
	}

	$('#submit-mark').click(function() {
		//when the marker submits a mark.
		mark = $('#mark-text').val();
		//ex = $('#exercise-dropdown').text();
		if ($.isNumeric(mark)) 
		{
			var conf = confirm("Submitting mark '" + mark + "' for exercise '" + ex + "' for student '" + student + "'.");
			if (conf) // Send AJAX to add the mark.
			{
				request = $.ajax({
				async: "false",
	        	url: "../PHP/executeQuery.php",
	       		type: "post",
	        	data: {Query : "REPLACE INTO marks VALUES('"+student+"', '"+ex+"', '"+mark+"')"}
	   			 });

	   			request.done(function(response, textStatus, jqXHR){
	   			alert("Mark Saved");
	    		console.log("Response: "+response);
	    		console.log("Status: "+textStatus);
	    		console.log("jqXHR: "+jqXHR);
	    		var parsedResponse = JSON.parse(response);
	    		console.log(response);
			
    			});
	   		}
		} 
		else 
		{
			alert("Please enter a number for the mark.");
		}
	});

	// Set the default robot controller.
	$.ajax({
		'async':false,
		'global':false,
		'url':'../PHP/getDefaultController.php',
		'success':function(resp){
			code = resp;
			console.log(code);
			$('.display-div').show();
			$('#code-preview').hide();
			$('#code-code').text(code);
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
	
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		uploadCode(file);
	});

	var width = $(window).innerWidth();
	var height = $(window).innerHeight();

	//Calculate div sizes
	var mazeOptionsWidth = 400;
	var bothWidth = width - mazeOptionsWidth - 200 // -400 for the maze options, -40 for 20px padding everywhere

	$('#console-div').css("width", bothWidth/2);
	$('.console').css("width", bothWidth/2);
	$('.console').css("height", height-300);
	$('#instructions').css("height", height-300);
	$('.display-pre').css("max-height", height-320);

	//Initialise sliders
	$('.slider').slider().on('slide', function(ev){
		//get the slider value
		var val = ev.value;
		//get the name of the question we're working with
		var name = $(this).attr('id');
		//assign this value to the correct value box
	
		updateVariable(name, val);
	});

	//Set full-screen div size for canvas
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

function getStudents()
{
	var students;
	request = $.ajax({
		async: "false",
        url: "../PHP/executeQuery.php",
        type: "post",
        data: {Query : "SELECT username FROM users"}
    });

    request.done(function(response, textStatus, jqXHR){
    	console.log("Response: "+response);
    	console.log("Status: "+textStatus);
    	console.log("jqXHR: "+jqXHR);
    	var parsedResponse = JSON.parse(response);
    	console.log(response);
    	students = parsedResponse.Results;
		for (var i = 0; i < students.length; i++)
		{
			$("#student-dropdown").append("<li><a href='#' class='student'>"+students[i].username+"</a></li>");
		}

		$('.student').click(function() {
		console.log("student click");
		student = $(this).text();
		console.log(student);
		getExercises(student);
		$('#choose-student-dropdown').text(student);
		$('#choose-student-dropdown').append(" <span class='caret'></span>");
		$('#choose-exercise-dropdown-marker').show();
		});

    });
}

function getExercises(student)
{
	var exercises;
	request = $.ajax({
		async: "false",
        url: "../PHP/executeQuery.php",
        type: "post",
        data: {Query : "SELECT * FROM solutions WHERE username='"+student+"'"}
    });

    request.done(function(response, textStatus, jqXHR){
    	console.log("Response: "+response);
    	console.log("Status: "+textStatus);
    	console.log("jqXHR: "+jqXHR);
    	var parsedResponse = JSON.parse(response);
    	var x = 0;
    	console.log(response);
    	console.log(parsedResponse.Results[1].username);
    	exercises = parsedResponse.Results;
    	$("#exercise-dropdown-marker").empty();
		for (var i = 0; i < exercises.length; i++)
		{
			console.log(exercises[i].exercise);
			//$("#exercise-dropdown").append("<li><a href='#' class='exercise'>"+exercises[i].exercise+"</a></li>");
			$("#exercise-dropdown-marker").append("<li><a href='#' class='exercise'>"+exercises[i].exercise+"</a></li>");
		}

		// Select an exercise to submit after loading exercises.
		$('.exercise').click(function() {
			ex = $(this).text();
			for (var i = 0; i < exercises.length; i++)
				if (exercises[i].exercise == ex)
					x = i;
			code = exercises[x].code;
			$('#submit-exercise').show();
			$('#choose-exercise-dropdown').text(ex);
			$('#choose-exercise-dropdown').append(" <span class='caret'></span>");
			$('#choose-exercise-dropdown-marker').text(ex);
			$('#choose-exercise-dropdown-marker').append(" <span class='caret'></span>");

			$('#mark-text').show();
			$('#submit-mark').show();

			// Update console etc
			$('#code-tab-title').text("Code - " + exercises[x].username +" Exercise: "+ exercises[x].exercise);
			$codeTab.show();
		    $codeTab.tab('show');
			$('#code-code').text(code);
			$('.display-div').show();
			$('#code-preview').hide();
			$('#console-preview').hide();
			$('#upload-text-1').val("");
			$('pre code').each(function(i, e) {hljs.highlightBlock(e)});	
			$('#code-tab-title').text("Code - " + exercises[x].username +" "+ exercises[x].exercise);
			$('.upload-code').hide();
		});
    });
}

function checkLoginStatus()
{
	// Display either login or logout button based on results of ajax request which checks if a user is logged in.
	$.ajax({
		'async':false,
		'global':false,
		'url':'../PHP/isLogged.php',
		'success':function(resp){
			parsed = JSON.parse(resp);
			if (parsed.logged == true && parsed.clearance != false)
			{
				loggedIn = true;
				username = parsed.username;
				clearance = parsed.clearance;
				$('#login-button').hide();
				$('#logout-button').show();
			}
			else
			{
				loggedIn = false;
				username = false;
				clearance = false;
				$('#login-button').show();
				$('#logout-button').hide();
			}
		}
	});

	console.log(clearance);
}

function mouseDown(event)
{
	if (!running)
	{
		// Find co-ordinates of the click position on the canvas.
		mazeCoords = findMazeCoordinates(event);
		var generator = new Generator();
		var mazePosX = mazeCoords.x;
		var mazePosY = mazeCoords.y;
		console.log(mazePosX);
		console.log(mazePosY);
		console.log(Maze[0].length);
		console.log(Maze.length);

		if ((robotposY != mazePosX || robotposX != mazePosY) && (endposY != mazePosX || endposX != mazePosY)) // If editing maze layout and not moving robot.
		{
			if (mazePosX != 0 && mazePosY != 0 && mazePosX != Maze.length-1 && mazePosY != Maze[0].length-1)
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
		}
		else if (robotposY == mazePosX && robotposX == mazePosY) // If clicking the robot to move it.
		{
			dragging = true;
		}
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

// Find the coordinates of the click and convert into canvas coordinates
function findMazeCoordinates(event)
{
	// Get coordinates of the click
	var x = event.x;
	var y = event.y;

	var returnObject = new Object();
	var generator = new Generator();
	var adjustments = generator.getBlockSize();
	var blockSize = adjustments.blockSize;
	var canvas = generator.findCanvasProperties();
	// Convert to canvas coordinates using the canvas offset from the left and top of the screen.
	x = (x-canvas.offsetLeft)-adjustments.yOffset;
  	y = (y-canvas.offsetTop)-adjustments.xOffset;
  	var mazePosX = Math.ceil(x/blockSize)-1;
  	var mazePosY = Math.ceil(y/blockSize)-1;
	//console.log(mazePosX);
	//console.log(mazePosY);
	//console.log(Maze[mazePosX][mazePosY]);
	returnObject.x = mazePosY;
	returnObject.y = mazePosX;
	return returnObject;
}

// Updates the correct variable based on the name parameter.
function updateVariable(name, val)
{
	if (name == 'speed')
	{
		setSpeed = val;
		$('.val-speed').val(setSpeed);
	}
	else if (name == 'width')
	{
		setWidth = val;
		$('.val-width').val(setWidth);

	}
	else if (name == 'height')
	{
		setHeight = val;
		$('.val-height').val(setHeight);
	}
}

$(document).on('change', '.btn-file :file', function() {
    // var file = document.form1.uploadBox.value;
    var file = $('#uploadBox').val().substring(12);
    $('#upload-box-init').val(file);    
});

// Display maze names given as parameters
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
			// Create buttons for each of the names given.
			titlesDiv.append("<button type='button' class='btn btn-default maze-choice' name=\""+titles[i]+"\">"+titles[i]+"</button>&nbsp");
			titlesDiv.append("<a class='btn btn-danger remove-choice' name=\""+titles[i]+"\"> Remove <span class='glyphicon glyphicon-remove'></span></a><br><br>");
		}

		// Create handler for when the choices are clicked.
		$('.maze-choice').click(function(){
			loadMaze($(this).attr('name'));
		});

		$('.remove-choice').click(function(){
			console.log("removing");
			$('#maze-modal').modal('hide')
			var label = $(this).attr('name');
			request = $.ajax({
		        url: "../PHP/deleteMaze.php",
		        type: "post",
		        data: {label: label}
		    });

		    request.done(function(response, textStatus, jqXHR){
		    	console.log(response);
		    	var res = JSON.parse(response);
		    	console.log(res.Error)
		    });
		});

	}
}

// Send AJAX request to find mazes the user saved.
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

// Find the maze layout of the given label using AJAX.

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
    	// Draw the new maze to the canvas.
    	generator.updateJSON();
		generator.clearCanvas();
    	generator.fullUpdate();

    	console.log(Maze);
    });
}

// Show the uploaded code when the tab is clicked
$('#upload-code').click(function() {

	$('#code-tab-title').text("Code - " + filename);
	$codeTab.show();
    $codeTab.tab('show');
	$('#code-code').text(code);
	$('.display-div').show();
	$('#code-preview').hide();
	$('#console-preview').hide();
	$('#upload-text-1').val("");
	// $('#console-code').text("This will display the console printout.");
	$('pre code').each(function(i, e) {hljs.highlightBlock(e)});	
	$('#code-tab-title').text("Code - " + filename);
	$('.upload-code').hide();
});

// Show the help popup.
$('#help-button').click(function () {
	$('#pop-up').toggle();
});

// Generate a new maze and draw it to the canvas.
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

// Show the large canvas div and layout.
$('#full-screen').click(function() {
	$('#hide-full-screen').hide();
	$('#large-canvas-div').show();
	fullScreen = true;
	var generator = new Generator();
	generator.clearCanvas();
	generator.fullUpdate();
});

// Show the smaller canvas layout.
$('#shrink').click(function() {
	$('#large-canvas-div').hide();
	$('#hide-full-screen').show();
	fullScreen = false;
	var generator = new Generator();
	generator.fullUpdate();
});

// Set the prims variable to true when the user clicks "Prims".
$('.prims').click(function() {
	prims = true;
	$('.prims').addClass("active");
	$('.loopy').removeClass("active");
});

// Set the prims variable to false when the user clicks "Loopy".
$('.loopy').click(function() {
	prims = false;
	$('.loopy').addClass("active");
	$('.prims').removeClass("active");
});

// When the user clicks the play button resume or start a new run.
$('.play').click(function() {
	console.log("clicked play");
	if (running == false || paused == true)
	{
		if(!paused) // If not paused, send the code and maze, and begin a new run.
		{
			console.log("Starting with new Maze");
		   	ws.send(json);
		   	console.log("[CODE]["+lang+"]"+code);
		   	//ws.send("[CODE]"+code);
		   	ws.send("[CODE]["+lang.toLowerCase()+"]"+code);
		   	running = true;
		   	paused = false;
		   	//sendSteps();
		}
		else // If paused, resume sending steps.
		{
			console.log("Resuming.");
			running = true;
			paused = false;
			sendSteps();
		}
	}
});

// When pause is clicked, set pause variable to true.
$('.pause').click(function() {
	console.log("clicked pause");
	paused = true;
});

// When stop is clicked, stop the run and send RESET to middleware.
$('.stop').click(function(){
	running = false;
	ws.send("RESET");
});

// Send the given username and password to the database for verification when the user logs in.
$('.login').click(function(){
	var username = $('.login-username').val();
	var password = $('.login-password').val();
	
	// Send an AJAX request to verify the details.
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
    		//$('#login-button').hide();
    		//$('#logout-button').show();
    		$('#myModal').modal('hide')
    		checkLoginStatus();
    	}
    	else
    	{
    		alert("Wrong username and/or password.");
    	}
    	
    	//$('#help-button').show();

    });

});

// Send an AJAX request to log the user out when "logout" is clicked.
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


// Send the current maze layout to the database via AJAX to be saved.
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

// Choose a language
$('.language').click(function() {
	lang = $(this).text();
	$('#choose-language-dropdown').text(lang);
	$('#choose-language-dropdown').append(" <span class='caret'></span>");
	langChosen = true;
	if (fileUploaded) {
		displaySubmit();
	}
});



function displaySubmit() {
	$('#upload-code').show();
}

// Send an AJAX request to save the user's code as an exercise submission
$('#submit-exercise').click(function() {
	if (ex == 0) {
		alert("Please choose an exercise. I don't quite know how you clicked that button.");
	} else {
		var ok = confirm("Submitting exercise " + ex + " are you absolutely sure?");
		if (ok == true)
		{
			request = $.ajax({
		        url: "../PHP/submitExercise.php",
		        type: "post",
		        data: {username: username, exercise: ex, code: code}
		    });

		    request.done(function(response, textStatus, jqXHR){
		    	console.log(response);
		    	console.log(JSON.parse(response));
		    });
		}
	}
});

// Send a single STEP when the "next step" button is clicked.
$('.next').click(function(){
	ws.send("STEP");
})

$('#leekify').click(function() {
	if (mattLeeke) {
		//Normal
		mattLeeke = false;
		updateVariable("width", 10);
		updateVariable("height", 10);
		$(this).text("Matt Leekify");
		$(this).removeClass("btn-default");
		$(this).addClass("btn-danger");
		$("#banner").attr("src","../jpgs/banner1.jpg");
		imgLocation = "";
	} else {
		//Leekify
		mattLeeke = true;
		updateVariable("width", 3);
		updateVariable("height", 3);
		$(this).text("Back to normal :(");
		$(this).removeClass("btn-danger");
		$(this).addClass("btn-default");
		$("#banner").attr("src","../jpgs/banner2.jpg");
		imgLocation = "";
	}
	$('.update-maze').trigger("click");
});

