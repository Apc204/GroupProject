var setWidth = 10;
var setHeight = 10;
var setSpeed = 500;
var largeCanvasWidth = 0;
var largeCanvasHeight = 0;
var prims = true;
var running = false;
var paused = false;
var code;

function uploadCode(num, file) {
	var reader = new FileReader();			
	reader.readAsText(file);
	reader.onload = function(e) {
		code = reader.result;
		$('#upload-code-'+num).show();
		$('#upload-text-'+num).val(file.name);
	}	
}

$().ready(function () {
	$('.upload-code').hide();
	$(".question").popover();
	$('#logout-button').hide();
	
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
	fullScreen = false;

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
	$('.slider').slider().on('slide', function(ev){
		//get the slider value
		var val = ev.value;
		//get the name of the question we're working with
		var name = $(this).attr('id');
		//assign this value to the correct value box
		$(".val-"+name).val(val);

		//set variables
		if (name == 'width') {
			setWidth = val;
		} else if (name == 'height') {
			setHeight = val;
		} else if (name == 'speed') {
			setSpeed = val;
		}
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

		//set variables
		if (name == 'speed')
		{
			if (paused == true || (running == false && paused == false))
			{
				setSpeed = val;
			}
			else
			{
				alert("Pause or stop the run to update robot speed.");
			}
		}
		if (name == 'width' || name == 'height')
		{
			if (running == false)
			{
				if (name == 'width') {
					setWidth = val;
				} else if (name == 'height') {
					setHeight = val;
				}
			}
			else
			{
				alert("Stop the run to update maze dimensions.");
			}
		}
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

$(document).on('change', '.btn-file :file', function() {
    // var file = document.form1.uploadBox.value;
    var file = $('#uploadBox').val().substring(12);
    $('#upload-box-init').val(file);    
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
		generator.fullUpdate(Maze,robotposX, robotposY, orientation);
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
	generator.fullUpdate(Maze,robotposX, robotposY, orientation);
});

$('#shrink').click(function() {
	$('#large-canvas-div').hide();
	$('#hide-full-screen').show();
	fullScreen = false;
	var generator = new Generator();
	generator.fullUpdate(Maze,robotposX, robotposY, orientation);
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
    	console.log(response);
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