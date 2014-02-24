$().ready(function () {
	var width = $(document).width();
	var height = $(document).height();
	// var codeWidth = parseInt($('#code-div').css("width")) - 40;
	var codeWidth = 420;
	// $('#code-div').css("width", width-470); //400 from the canvas, 25 from the padding, 5 because for some reason it won't work without it
	// $('#code-textarea').css("width", width-470); //extra 20 px on either side of the text area in the code-div
	$('#code-textarea').css("width", codeWidth);
	$('#code-textarea').css("height", height-220);
	$('.console').css("height", height-220);
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