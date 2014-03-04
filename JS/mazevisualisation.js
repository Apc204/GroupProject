var setWidth = 3;
var setHeight = 3;
var setSpeed = 500;
var largeCanvasWidth = 0;
var largeCanvasHeight = 0;
var prims = true;

$().ready(function () {

	var width = $(document).width();
	var height = $(document).height();
	fullScreen = false;

	//Calculate div sizes
	var mazeDivWidth = 400;
	var bothWidth = width - mazeDivWidth - 80 // -400 for the maze, -40 for 20px padding everywhere

	$('#code-div').css("width", bothWidth/2);
	$('#code-textarea').css("width", bothWidth/2);
	$('#code-textarea').css("height", height-200);

	$('#console-div').css("width", bothWidth/2);
	$('.console').css("width", bothWidth/2);
	$('.console').css("height", height-200);

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
	canvas.style.width = height - 200+'px';
	canvas.style.height = height - 200+'px';
	largeCanvasHeight = height - 200;
	largeCanvasWidth = height - 200;
	$('#large-console-div').css("width", width - height - 290);

	//change the slider if the text box value is changed, and the slider & textbox on full screen/default screen
	$('.val').keyup(function() {
		//get the name of the question we're working with. Substring with 4 to remove the val- from the beginning.
		var name = $(this).attr('name');
		
		var val = $(this).val();
		$('#'+name).slider('setValue', val);
		$('.val-'+name).val(val);

		//set variables
		if (name == 'width') {
			setWidth = val;
		} else if (name == 'height') {
			setHeight = val;
		} else if (name == 'speed') {
			setSpeed = val;
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
	});
});

$(document).on('change', '.btn-file1 :file', function() {
    // var file = document.form1.uploadBox.value;
    var file = $('#uploadBox').val().substring(12);
    $('#upload-box-init').val(file);    
});

$(document).on('change', '.btn-file2 :file', function() {
    // var file = document.form1.uploadBox.value;
    var file = $('#uploadBox').val().substring(12);
    $('#upload-box-init').val(file);    
});

$('#upload-code-init').click(function() {
	var  file = document.form1.uploadBox.value;
	if (file == "") {
		alert("Please upload a file.");
	} else {
		$('#code-textarea').text("public class Scribble extends Applet {private int last_x = 0;\nprivate int last_y = 0;\nprivate Color current_color = Color.black;\nprivate Button clear_button;\nprivate Choice color_choices;\n// Called to initialize the applet.\npublic void init() {\n// Set the background color\nthis.setBackground(Color.white);\n// Create a button and add it to the applet.\n// Also, set the button's colors        this.add(color_choices);\n}\n\n// Called when the user clicks the button or chooses a color\npublic boolean action(Event event, Object arg) {\n// If the Clear button was clicked on, handle it.\nif (event.target == clear_button) {\nGraphics g = this.getGraphics();\nRectangle r = this.bounds();");

		$('.to-reveal').show();
		$('.to-hide').hide();
	}
});

$('#upload-code').click(function() {
	var  file = document.form2.uploadBox.value;
	if (file == "") {
		alert("Please upload a file.");
	} else {
		$('#code-textarea').text("SECOND CODE\npublic class Scribble extends Applet {private int last_x = 0;\nprivate int last_y = 0;\nprivate Color current_color = Color.black;\nprivate Button clear_button;\nprivate Choice color_choices;\n// Called to initialize the applet.\npublic void init() {\n// Set the background color\nthis.setBackground(Color.white);\n// Create a button and add it to the applet.\n// Also, set the button's colors        this.add(color_choices);\n}\n\n// Called when the user clicks the button or chooses a color\npublic boolean action(Event event, Object arg) {\n// If the Clear button was clicked on, handle it.\nif (event.target == clear_button) {\nGraphics g = this.getGraphics();\nRectangle r = this.bounds();");

		$('.to-reveal').show();
		$('.to-hide').hide();
	}
});

$('#help-button').click(function () {
	$('#pop-up').toggle();
});

$('.update-maze').click(function(){
	var generator = new Generator()
	var maze = generator.generateLoopy();
	generator.clearCanvas();
	generator.drawMaze(Maze);
})

$('#full-screen').click(function() {
	$('#hide-full-screen').hide();
	$('#large-canvas-div').show();
	fullScreen = true;
	var generator = new Generator();
	generator.clearCanvas();
	generator.drawMaze(Maze);
});

$('#shrink').click(function() {
	$('#large-canvas-div').hide();
	$('#hide-full-screen').show();
	fullScreen = true;
	var generator = new Generator();
	generator.drawMaze(Maze);
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


