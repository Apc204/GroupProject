<!DOCTYPE html>
<html>
	<head>
		<title>Maze Visualisation</title>
		<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet">
		<link href="../CSS/styles.css" rel="stylesheet">
    <link href="../CSS/slider.css" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/default.css">
	</head>

	<body>
		<nav class="navbar navbar-default" role="navigation">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="home.html">Robot Maze</a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse test" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li><a href="home.html">Home</a></li>
        	<li class="active"><a href="mazevisualisation.html">Maze Visualisation</a></li>
          <li><a href="onlinetests.html">Online Tests</a></li>
          <li><a href="marker-home.html">Marking Tools</a></li>
          <li><a href="http://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs118/" target="_blank">Coursework Page <span class="glyphicon glyphicon-new-window"></span></a></li> 
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href='#' id="login-button" data-toggle="modal" data-target="#myModal">Login</a></li>
          <li><a href='#' id="logout-button">Logout</a></li>
          <li><a href='#' id="help-button">Help</a></l>
        </ul>
      </div><!-- /.navbar-collapse -->
    </nav>

    <div id="pop-up" class="well">
      <div class="help-title">Help</div>
      <br />
      This page is where you can test and submit your code. To view full instructions on how to use it, click the 'Instructions' tab on the left, or click <a id="show-instructions">here</a>
      to display the tab.
    </div>

  	<img src="../jpgs/banner1.jpg" class="img-test">
		<div class="maindiv">
      
			<h1 class="white-text">Maze Visualisation</h1>

      <!-- Login Modal -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" id="myModalLabel">Login</h4>
            </div>
            <div class="modal-body">
              <p>Login using your ITS username and password.</p>
                <div class="input-group login-input">
                  <span class="input-group-addon span-label">Username: </span> 
                  <input type="text" class="login-input form-control login-username" name="username">
                </div><br />

                <div class="input-group login-input">
                  <span class="input-group-addon span-label">Password: </span>
                  <input type="password" class="login-input form-control login-password" name="password">
                </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary login">Login</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load Maze Modal -->
      <div class="modal fade" id="maze-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title">Choose Maze</h4>
            </div>
            <div class="modal-body">
               <div id="maze-list-div">
                  Loading mazes...
               </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>

      <div id="large-canvas-div">

        <div id="console-code-div">
          <div class="inner-left" id="large-console-div">
            <ul class="nav nav-tabs" id="tabs" data-tabs="tabs">
              <li class="active"><a href="#instructions" data-toggle="tab">Instructions</a></li>
              <li><a href="#console" data-toggle="tab">Console</a></li>
              <li><a href="#code" data-toggle="tab" id="code-tab-title">Code - Random Controller</a></li>
            </ul>
            <div id="my-tab-content" class="tab-content">
              
              <div class="tab-pane active" id="instructions">
                  <h1>Instructions</h1>

                  <p>This page is for you to test and submit your code. If you haven't written a controller yet and just want to test the page, the random controller is 
                    already loaded in - just click 'Play' to run it.<p>

                  <h3>Uploading Code</h3>

                  <p>You can upload code using the buttons on the right under 'Code Options'. Click 'Choose File' and navigate to the file you want to upload. 
                    When you've chosen the right file a submit button will appear, clicking it will submit your code. </p>

                  <p>When your code has been submitted you will be able to view the console printout in the console tab above. The code tab will display your code. </p>

                  <h3>Running the Robot</h3>

                  <p>You can run the robot and edit the maze using the controls on the right. Everything under 'Robot Controls' will allow you to run the robot:</p> 
                  <ul>
                    <li>'Play' will run the robot at the speed specified by the robot delay. </li>
                    <li>'Pause' will stop the robot where it is in the maze, and clicking 'play' again will resume it from where it stopped. </li>
                    <li>'Stop' will bring the robot back to the start of the maze and restart the run. </li>
                    <li>'Next step' can be used when the robot is paused to carry out one command, this can be useful for debugging to see exactly what the robot is doing.</li>
                  </ul>

                  <p>The robot delay is the number of miliseconds between each move - a lower delay will mean the robot runs faster. </p>

                  <h3>Editing the Maze</h3>

                  <h4>Maze Layout</h4>

                    <p>You can change the maze by clicking on the maze to add and remove walls. The robot can also be dragged to different start locations. The maze cannot be 
                      changed while the robot is currently in a run, even if the robot is paused - you must click 'Stop' first to restart the run.

                  <h4>Maze Size</h4>

                    <p>You can control the size of the maze either by using the sliders or manually entering a number in each box. To generate a new maze when you've chosen a 
                      size, click 'Update'. The maze size cannot be changed while a robot is in a run - if the robot is running, you must click 'Stop' before being able to
                      generate a new maze.</p>

                  <h4>Maze Type</h4>

                    <p>You can choose whether the maze is a Prim's or loopy maze - Prim's mazes only have one route to the end, whereas loopy mazes can have multiple routes. 
                      After changing the maze type, click 'Update' to generate a new maze. Similar to maze size, the robot must be stopped before a new maze can be generated.</p>

                  <h3>Saving and Loading Mazes</h3>

                    <p>If you've made a maze that you want to use again, you can save it by clicking 'Save Maze' and giving it a name. You can then load it again later by 
                      clicking 'Load Maze' and choosing it from your list of saved mazes.</p>

                  <h3>Submitting an Exercise</h3>

                  <p>If you want to submit the currently uploaded code as your solution to one of the exercises, select that exercise from the 'Choose Exercise' dropdown, 
                    then click 'Submit'. </p>

                  <!-- <div class="input-group bottom-upload">
                    <span class="input-group-addon btn-file" name="2">Choose File <input type="file" id="uploadBox2"></span>
                    <input type="text" class="form-control" placeholder="No file chosen" class="upload-text" id="upload-text-2">
                  </div><br>
                  <a class="btn btn-primary upload-code" id="upload-code-2">Upload code</a><br><br> -->
              </div>

              <div class="tab-pane" id="console">
                  <h1>Console</h1>
                <div id="console-preview">
                  The printout from the console will display here when you upload some code. 
                </div>
                <div class="display-div" id="thisConsole"><pre class="display-pre"><code id="console-code"></code></pre></div>
              </div>

              <div class="tab-pane" id="code">
                <h1>Code</h1>
                <div id="code-preview">
                  Your code will display here when you upload some code. 
                </div>
                <div class="display-div"><pre class="display-pre"><code id="code-code"></code></pre></div>
              </div>

            </div>
          </div>
        </div>

        <div class="inner-left">
          <canvas id="large-canvas" style="border:1px solid #000000;"></canvas>
        </div>
        <div class="inner-left full-size-options">

          <p id="title-no-top">Robot Controls</p>

           <div class="maze-option-block-btn">

              <div class="btn-group">
                <button type="button" class="btn btn-default play"><span class="glyphicon glyphicon-play"></span> Play</button>
                <button type="button" class="btn btn-default pause"><span class="glyphicon glyphicon-pause"></span> Pause</button>
                <button type="button" class="btn btn-default stop"><span class="glyphicon glyphicon-stop"></span> Stop</button>
              </div>
              <a class="btn btn-default next"><span class="glyphicon glyphicon-step-forward"></span> Next step</a>

          </div>


              <div  id="right-option">

                <h4>
                  Robot delay: 
                  <a href='#' class="question" name="maze-type" rel="popover" data-content="Milisecond delay on the robot between moves.">
                    <span class="glyphicon glyphicon-question-sign"></span>
                  </a>
                </h4>
                
                <input type="text" id="speed" class="span2 slider slider-long" value="" data-slider-min="1" data-slider-max="1000" data-slider-step="1" data-slider-value="500" data-slider-orientation="horizontal" data-slider-selection="none" data-slider-tooltip="hide"> 

                <input type="text" class="speedBox val-speed val" name="speed" value="500"><br />

              </div>

          <h3>Maze Options</h3>
            <!-- Maze controls -->
            <h4>Maze size in blocks: </h4>

            <div class="option-row">
            
              <div class="inner-left" id="left-option">

                Width: <br />
                <input type="text" id="width" class="span2 slider size-slider" value="" data-slider-min="1" data-slider-max="200" data-slider-step="1" data-slider-value="10" data-slider-orientation="horizontal" data-slider-selection="none" data-slider-tooltip="hide"> 

                <input type="text" class="val val-width" name="width" value="10"><br /><br />

              </div>

              <div class="inner-left" id="right-option">

                Height: <br />
                <input type="text" id="height" class="span2 slider size-slider" value="" data-slider-min="1" data-slider-max="200" data-slider-step="1" data-slider-value="10" data-slider-orientation="horizontal" data-slider-selection="none" data-slider-tooltip="hide"> 

                <input type="text" class="val val-height" name="height" value="10"><br /><br />

              </div>

            </div>

                <h4>
                  Maze type: 
                  <a href='#' class="question" name="maze-type" rel="popover" data-content="Prim's mazes are trees: they can't have any loops in the paths, only branches. Loopy mazes can have loops, which means there can be more than one way to get to the destination.">
                    <span class="glyphicon glyphicon-question-sign"></span>
                  </a>
                </h4>

                <div class="btn-group">
                  <button type="button" class="btn btn-default active prims">Prim's</button>
                  <button type="button" class="btn btn-default loopy">Loopy</button>
                </div><br />


            <br /><br />

            <a class="btn btn-primary update-maze maze-button">Update</a>
            <a class="btn btn-primary save-maze maze-button">Save maze</a>
            <a class="btn btn-primary load-maze maze-button" data-toggle="modal" data-target="#maze-modal" id="load-maze">Load maze</a>

            <h3>Code Options</h3>

            <div class="code-options-div">
              <h4>Upload Code</h4>
              <form name="form2">
                <div class="below-maze-div">
                  <div class="input-group bottom-upload">
                    <span class="input-group-addon btn-file">Choose File <input type="file" id="uploadBox"></span>
                    <input type="text" class="form-control" placeholder="No file chosen" class="upload-text" id="upload-text-1">
                  </div>
                </div>
                <div class="inner-right">
                  <a class="btn btn-primary upload-code" id="upload-code-1">Upload</a>
                </div>
              </form>
            </div>

            <!-- <div class="code-options-div"> -->
              <h4>Submit Exercise</h4>
              <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="choose-exercise-dropdown">
                  Choose Exercise 
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                  <li><a href="#" class="exercise">Exercise 1</a></li>
                  <li><a href="#" class="exercise">Exercise 2</a></li>
                </ul>
              </div>
              <a class="btn btn-primary" id="submit-exercise">Submit</a>

            <!-- </div> -->
        </div>
      </div>

	</body>

	<script src="http://code.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
  
  <script src="../JS/initialiseDefaultController.js"></script>
  <script src="../JS/highlight.pack.js"></script>
  <script src="../JS/generator.js"></script>
  <script src="../JS/script.js"></script>
  <script src="../JS/bootstrap-slider.js"></script>
  <script src="../JS/mazevisualisation.js"></script>

</html>
