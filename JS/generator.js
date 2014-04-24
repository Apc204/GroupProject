function Generator () {

	this.IN = 1;
	this.FRONTIER = 2;
	this.OUT = 3;
	this.NORTH = 1000;
	this.EAST = 1001;
	this.SOUTH = 1002;
	this.WEST = 1003;

	this.mazeWidth = setWidth;
	this.mazeHeight = setHeight;


	this.newHeight = (this.mazeHeight*2)+1;
	this.newWidth = (this.mazeWidth*2)+1;
	this.startX = 1;
	this.startY = 1;

	this.start = [1,1];
	this.finish = [(2*this.mazeWidth)-1,(2*this.mazeHeight)-1];
	this.frontierList = [];
	this.primGrid = [];

	this.PASSAGE = 3001;
	this.WALL = 3000;

	imgLocation = "../jpgs/Maze-parts/";

	// Converts the global maze array to JSON format and returns it.
	this.toJSON = function()
	{
		var jsonLayout = Maze;
		//jsonLayout = jsonLayout.replace('"','');
		var jsonMaze = {
		"layout": jsonLayout,
		"start_pos" : {
			"x": this.startX,
			"y": this.startY
		},
		"robot_pos" : {
			"x": robotposX,
			"y": robotposY
		},
		"robot_orientation":1000,
		"finish_pos" : {
			"x" : endposY,
			"y" : endposX
		},
		"steps":0,
		"collisions":0,
		"goal_reached":false,
		"runs":0 
		};
		return jsonMaze;
	}

	// Converts the maze array to JSON, appends the [MAZE] tag and stores it in a global json variable.
	this.updateJSON = function()
	{
		var jsonMaze = this.toJSON(Maze);
		var prefix = "[MAZE]";
		//json = prefix.concat(jsonMaze);
		json = prefix.concat(JSON.stringify(jsonMaze));
	}

	// Fully updates the canvas by clearing the whole canvas and drawing the most recent maze and robot.
	this.fullUpdate = function()
	{
		var c = this.findCanvasProperties();
		this.clearCanvas();
		this.drawMaze();
		this.drawRobot();
	}

	// Draws the robot in it's current position, chooses the correct sprite depending on the orientation.
	this.drawRobot = function()
	{

		var c = this.findCanvasProperties();
		var adjustments = this.getBlockSize();
		var append = "";
		var blockSize = adjustments.blockSize;
		var gap = blockSize*0.1; 
		var xOffset = adjustments.xOffset;
		var yOffset = adjustments.yOffset

		// If there has been a collision, prepend "Red" to display the collision sprite.
		if (oldCollisions != collisions)
		{
			append = "Red";
		}
		if (mattLeeke == true)
		{
			append = append+"Matt";
		}
		// Clear square ready to draw robot
		ctx.clearRect(robotposY*blockSize+xOffset, robotposX*blockSize+yOffset, blockSize, blockSize)
		// Choose correct sprite depending on orientation
		if (orientation == '1000')
		{
			this.draw("RobotLeft"+append,robotposY*blockSize+xOffset+gap, robotposX*blockSize+yOffset+gap, blockSize-2*gap, blockSize-2*gap);
		}
		else if (orientation == '1001')
		{
			this.draw("RobotDown"+append,robotposY*blockSize+xOffset+gap, robotposX*blockSize+yOffset+gap, blockSize-2*gap, blockSize-2*gap);	
		}
		else if (orientation == '1002')
		{
			this.draw("RobotRight"+append,robotposY*blockSize+xOffset+gap, robotposX*blockSize+yOffset+gap, blockSize-2*gap, blockSize-2*gap);	
		}
		else if (orientation == '1003')
		{
			this.draw("RobotUp"+append,robotposY*blockSize+xOffset+gap, robotposX*blockSize+yOffset+gap, blockSize-2*gap, blockSize-2*gap);	
		}
	}

	// Finds the size of each tile by using the canvas size and maze dimensions. Creates and returns the correct offsets to deal with rectangle mazes.
	this.getBlockSize = function()
	{
		var returnArray = new Object;
		var positive = 0;
		if (Maze[0].length != Maze.length)
		{
			var difference = (Maze.length - Maze[0].length)/2;
			console.log("Difference: "+difference);
			if (difference >= 0) // Width is bigger
			{
				positive = Math.abs(difference);
				returnArray.blockSize = canvasWidth/this.newWidth;
				returnArray.yOffset = positive*returnArray.blockSize; // Create an offset so the maze can be drawn in correct proportions.
				returnArray.xOffset = 0;

			}
			else // Height is bigger
			{
				console.log("Height is BIGGER");
				positive = Math.abs(difference);
				returnArray.blockSize = canvasWidth/Maze[0].length;
				returnArray.xOffset = positive*returnArray.blockSize;
				returnArray.yOffset = 0;
			}
		}
		else
		{
			returnArray.blockSize = canvasWidth/Maze.length;
			returnArray.xOffset = 0;
			returnArray.yOffset = 0;
		}
		return returnArray;
	}

	// Draws the given image at the given position with the specified size.
	this.draw = function(imgtag, x, y, width, height)
	{
		ctx.drawImage(images[imgtag],x,y,width,height);
	}

	// Finds the current height and width of the canvas.
	this.findCanvasProperties = function()
	{
		if(fullScreen == true)
		{
			var c=document.getElementById("large-canvas");
			//console.log(c.width);
			//console.log(c.height);
			canvasWidth = c.width;
			canvasHeight = c.height;
			ctx=c.getContext("2d");
		}

		else
		{
			var c=document.getElementById("myCanvas");
			canvasWidth = c.width;
			canvasHeight = c.height;
			ctx=c.getContext("2d");
		}

		//console.log(canvasHeight);
		//console.log(canvasWidth);
		return c;
	}

	//Clears the whole canvas.
	this.clearCanvas = function()
	{
		var c = this.findCanvasProperties();
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	// Finds the correct sprite and draws it for a tile with 3 neighbours.
	this.draw3neighbours = function(x,y,width,height,neighbours)
	{
		append="";
		if (mattLeeke == true)
		{
			append = "Matt";
		}
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.EAST) != -1){
			this.draw("TTop"+append, x, y, width, height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TLeft"+append, x, y, width, height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TRight"+append, x, y, width, height);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TBottom"+append, x, y, width, height);
		}
	}

	// Finds the correct sprite and draws it for a tile with 2 neighbours.
	this.draw2neighbours = function(x,y,width,height,neighbours)
	{
		append="";
		if (mattLeeke == true)
		{
			append = "Matt";
		}
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.SOUTH) != -1 ){
			this.draw("TopAndBottom"+append,x,y,width,height);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("LeftAndRight"+append,x,y,width,height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("BottomRightCorner"+append,x,y,width,height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("BottomLeftCorner"+append,x,y,width,height);
		}
		else if (neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("TopRightCorner"+append,x,y,width,height);
		}
		else if(neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("TopLeftCorner"+append,x,y,width,height);
		}
	}

	// Finds the correct sprite and draws it for a tile with 1 neighbour.
	this.drawSingleNeighbour = function (x,y,width,height,neighbours)
	{
		append="";
		if (mattLeeke == true)
		{
			append = "Matt";
		}
		if (neighbours.indexOf(this.NORTH) != -1)
			this.draw ("Top"+append,x,y,width,height);
		else if (neighbours.indexOf(this.EAST) != -1)
			this.draw ("Right"+append,x,y,width,height);
		else if (neighbours.indexOf(this.WEST) != -1)
			this.draw ("Left"+append,x,y,width,height);
		else if(neighbours.indexOf(this.SOUTH) != -1)
			this.draw ("Bottom"+append,x,y,width,height);
	}

	// Finds the correct sprite and draws it for a tile with no neighbours.
	this.drawBlock = function (x,y,width,height,neighbours)
	{
		append="";
		if (mattLeeke == true)
		{
			append = "Matt";
		}
		this.draw("Single"+append,x,y,width,height);
	}

	// Finds the correct sprite and draws it for a tile with 4 neighbours.
	this.drawMiddleBlock = function (x,y,width,height,neighbours)
	{
		append="";
		if (mattLeeke == true)
		{
			append = "Matt";
		}
		this.draw("AllSides"+append,x,y,width,height);
	}

	// Checks around the given tile for neighbours that are walls.
	this.checkTile = function(x,y, height, width)
	{
		var i = 0;
		var neighbourWalls = [];
		if (y < height-1  && Maze[x][y+1] == '3000')
			neighbourWalls[i++] = this.SOUTH;
		if (y != 0 && Maze[x][y-1] == '3000')
			neighbourWalls[i++] = this.NORTH;
		if (x < width-1 && Maze[x+1][y] == '3000')
			neighbourWalls[i++] = this.EAST;
		if (x != 0 && Maze[x-1][y] == '3000')
			neighbourWalls[i++] = this.WEST;
		return neighbourWalls;
	}

	// Loop through the maze array and call functions to draw each tile.
	this.drawMaze = function()
	{

		c=this.findCanvasProperties();
		var neighbours = [];

		// Adjust block sizes and offset for when the maze isn't square.
		var adjustments = this.getBlockSize();
		var blockSize = adjustments.blockSize;
		var gap = blockSize*0.1; // Create gap between "been before" squares to create discretised maze effect.
		var xOffset = adjustments.xOffset;
		var yOffset = adjustments.yOffset;

		for (var i=0; i<Maze[0].length; i++)
		{
			for (var j=0; j<Maze.length; j++)
			{

				posi = i*blockSize+yOffset;
				posj = j*blockSize+xOffset;
				neighbours=[];
				if(endposY == i && endposX == j)
				{
					ctx.fillStyle="#FF0000";
					ctx.fillRect(posj,posi,blockSize,blockSize);
				}

				else if (Maze[j][i] == 3000)
				{
					// Check number of neighbours and call relevant function to draw it.
					neighbours = this.checkTile(j,i, Maze[0].length, Maze.length);
					if (neighbours.length == 4){
						this.drawMiddleBlock(posj,posi,blockSize,blockSize,neighbours);
					}
					else if (neighbours.length== 3){
						this.draw3neighbours(posj,posi,blockSize,blockSize,neighbours);
					}
					else if (neighbours.length == 2){
						this.draw2neighbours(posj,posi,blockSize,blockSize,neighbours);
					}
					else if (neighbours.length == 1){
						this.drawSingleNeighbour(posj,posi,blockSize,blockSize,neighbours);
					}
					else {
						this.drawBlock(posj,posi,blockSize,blockSize,neighbours);
					}
				}
				else if (Maze[j][i] == 4000)
				{
					ctx.fillStyle="#b5b5b5";
					ctx.fillRect(posj+gap,posi+gap,blockSize-2*gap,blockSize-2*gap,Maze,neighbours);
				}
			}
		}
	}

	// Checks whether a tile is valid for converting to a passage in the Loopy algorithm
	this.isValid = function(x, y)
	{
		for(var i = x - 1; i <= x; i++) {
			for(var j = y - 1; j <= y; j++) {

				var invalidSquare = true;
				for(var a = i; a <= i+1; a++) {
					for(var b = j; b <= j+1; b++) {
						if (Maze[a][b] == this.WALL && !((x == a) && (y == b)))
							invalidSquare = false;
					}
				}
				if (invalidSquare) return false;
			}
		}
		return true;
	}

	// Finds number of walls around a given tile.
	this.getWalls = function(x, y)
	{
		var count = 0;
		for (var i = x - 1; i <= x+1; i+=2) {
			if(Maze[i][y] == this.WALL) count++;
		}

		for (var i = y - 1; i <= y+1; i+=2) {
			if(Maze[x][i] == this.WALL) count++;
		}
		return count;
	}

	// Places the end position to the middle of the maze.
	this.centerTarget = function()
	{
		var x = this.mazeWidth;
		var y = this.mazeHeight;

		while (true)
		{
			if(Maze[x][y] == this.PASSAGE)
			{
				endX = x;
				endY = y;
				return;
			}
			if(Math.random() > 0.5)
			{
				x = (x+1) % this.mazeWidth;
			} else {
				y = (y+1) % this.mazeHeight;
			}
		}
		return Maze;
	}

	// Chooses which maze generation algorithm to use.
	this.generate = function()
	{
		if (prims == true)
		{
			this.generatePrims();
		}
		else
		{
			this.generateLoopy()
		}
	}

	// Generator for loopy mazes.
	this.generateLoopy = function()
	{	
		this.generatePrims(); // Generate a prims maze.
		var realWidth = (2*this.mazeWidth)+1;
		var realHeight = (2*this.mazeHeight)+1;

		// Loop through and randomly change walls to passages if they are valid.
		for (var i = 1; i < realWidth - 1; i++)
		{
			for (var j = 1; j < realHeight - 1; j++)
			{
				if (this.isValid(i,j) && this.getWalls(i,j) < 3 && Math.random() > 0.5)
				{
					Maze[i][j] = this.PASSAGE;
				}
			}
		}
		//maze = this.centerTarget(maze);
	}

	// Generator for Prims mazes.
	this.generatePrims = function()
	{
		// Initialise global variables.
		robotposX = 1;
		robotposY = 1;
		endposX = this.newWidth-2;
		endposY = this.newHeight-2;
		collisions = 0;
		oldCollisions = 0;
		orientation = 1001;

		if ((this.mazeWidth < 1) || (this.mazeHeight < 1))
			alert ("Invalid Maze Dimensions");

		var realWidth = (2*this.mazeWidth)+1;
		var realHeight = (2*this.mazeHeight)+1;

		// Initialise maze array.
		Maze = this.initialiseGrid(realWidth, realHeight);

		var neighbours = 0;

		for (var i=0; i<realWidth; i++)
		{
			this.primGrid[i] = [];
			for (var j=0; j<realHeight; j++)
				this.primGrid[i].push(this.OUT);
		}

		// select cell "randomly" from inside the outer walls
		var originX = realWidth - 2;
		var originY = realHeight - 2;

		Maze = this.setPrimCellType(originX, originY, this.IN);
		if (originX > 1)
			this.setPrimCellType(originX-2,originY,this.FRONTIER);
		if (originY > 1)
			this.setPrimCellType(originX,originY-2,this.FRONTIER);
		if (originX < this.primGrid.length-2)
	         this.setPrimCellType(originX+2,originY,this.FRONTIER);
	    if (originY > this.primGrid[0].length-2)
	         this.setPrimCellType(originX,originY+2,this.FRONTIER);		// change to less than if broken

		// start Prim's algorithm loop
		while (this.frontierList.length > 0)
		{	// choose frontier point at random
			frontierPosition = Math.floor(Math.random()*this.frontierList.length);
			frontier = this.frontierList[frontierPosition];
			// add point to path
			this.setPrimCellType(frontier[0], frontier[1], this.IN);
			if(frontier[0] > 1)
				if (this.primGrid[frontier[0]-2][frontier[1]] == this.OUT)
					this.setPrimCellType(frontier[0]-2, frontier[1], this.FRONTIER);
			if(frontier[1] > 1)
				if (this.primGrid[frontier[0]][frontier[1]-2] == this.OUT)
					this.setPrimCellType(frontier[0], frontier[1]-2, this.FRONTIER);
			if(frontier[0] < this.primGrid.length-2)
				if (this.primGrid[frontier[0]+2][frontier[1]] == this.OUT)
					this.setPrimCellType(frontier[0]+2, frontier[1], this.FRONTIER);
			if(frontier[1] > this.primGrid[0].length-2)											//change to less than if broken
				if (this.primGrid[frontier[0]][frontier[1+2]] == this.OUT)
					this.setPrimCellType(frontier[0], frontier[1]+2, this.FRONTIER);


			// find neighbours seperated by 1 WALL
			// max of 4
			var direction = [];
			var neighbours = 0;
			if (frontier[0]-2 > 0)
				if (this.primGrid[frontier[0]-2][frontier[1]] == this.IN)
					direction[neighbours++] = this.WEST;
			if (frontier[1]-2 > 0)
				if (this.primGrid[frontier[0]][frontier[1]-2] == this.IN)
					direction[neighbours++] = this.NORTH;
			if (frontier[0] < this.primGrid.length-2)
				if (this.primGrid[frontier[0]+2][frontier[1]] == this.IN)
				   direction[neighbours++] = this.EAST;
			if (frontier[1] < this.primGrid[0].length-2)
				if (this.primGrid[frontier[0]][frontier[1]+2] == this.IN)
				   direction[neighbours++] = this.SOUTH;

			// choose random neighbour
			var path = direction[Math.floor(Math.random()*neighbours)];	
			switch (path) {
					case this.NORTH: {   this.setPrimCellType(frontier[0],frontier[1]-1,this.IN);
								   break;
								}
					case this.EAST:  {   this.setPrimCellType(frontier[0]+1,frontier[1],this.IN);
								   break;
								}
					case this.SOUTH: {   this.setPrimCellType(frontier[0],frontier[1]+1,this.IN);
								   break;
								}
					case this.WEST:  {  this.setPrimCellType(frontier[0]-1,frontier[1],this.IN);
								}
				 }
			var removed = this.frontierList.splice(frontierPosition, 1);

		}
		originalMaze = Maze;
	}

	// Initialise the maze to have a wall on every tile.
	this.initialiseGrid = function (width, height)
	{
		var grid = [];
		for (var i=0; i< width; i++)
		{
			grid[i] = [];
			for (var j=0; j< height; j++)
				grid[i].push(this.WALL);
		}
		return grid;
	}

	// Edit the state of a tile.
	this.setPrimCellType = function(x, y, type)
	{
		if (type == this.IN)
			Maze[x][y] = this.PASSAGE;
		if (type == this.FRONTIER)
			this.frontierList.push([x,y]);
		this.primGrid[x][y] = type;

		return Maze;
	}

	// Images need to be preloaded to reduce computation
	this.loadImages = function()
	{
		numberLoaded = 0;
		var imageNames = new Array("AllSides.jpg","Bottom.jpg", "BottomRightCorner.jpg", "BottomLeftCorner.jpg", "Left.jpg", "LeftAndRight.jpg", "Right.jpg", "RobotDown.png", "RobotRight.png",
									"RobotLeft.png", "RobotUp.png", "Single.jpg", "TBottom.jpg", "TLeft.jpg", "Top.jpg", "TopAndBottom.jpg", "TopLeftCorner.jpg", "TopRightCorner.jpg", "TRight.jpg",
									"TTop.jpg", "RobotDownRed.png", "RobotLeftRed.png", "RobotRightRed.png","RobotUpRed.png");
		images = new Object();
		images["AllSides"] = this.loadSingleImage(false, "AllSides.jpg");
		images["Bottom"] = this.loadSingleImage(false, "Bottom.jpg");
		images["BottomRightCorner"] = this.loadSingleImage(false, "BottomRightCorner.jpg");
		images["BottomLeftCorner"] = this.loadSingleImage(false, "BottomLeftCorner.jpg");
		images["Left"] = this.loadSingleImage(false, "Left.jpg");
		images["LeftAndRight"] = this.loadSingleImage(false, "LeftAndRight.jpg");
		images["Right"] = this.loadSingleImage(false, "Right.jpg");
		images["RobotDown"] = this.loadSingleImage(false, "RobotDown.png");
		images["RobotUp"] = this.loadSingleImage(false, "RobotUp.png");
		images["RobotRight"] = this.loadSingleImage(false, "RobotRight.png");
		images["RobotLeft"] = this.loadSingleImage(false, "RobotLeft.png");
		images["Single"] = this.loadSingleImage(false, "Single.jpg");
		images["TBottom"] = this.loadSingleImage(false, "TBottom.jpg");
		images["TLeft"] = this.loadSingleImage(false, "TLeft.jpg");
		images["Top"] = this.loadSingleImage(false, "Top.jpg");
		images["TopAndBottom"] = this.loadSingleImage(false, "TopAndBottom.jpg");
		images["TopLeftCorner"] = this.loadSingleImage(false, "TopLeftCorner.jpg");
		images["TopRightCorner"] = this.loadSingleImage(false, "TopRightCorner.jpg");
		images["TRight"] = this.loadSingleImage(false, "TRight.jpg");
		images["TTop"] = this.loadSingleImage(false, "TTop.jpg");
		images["RobotDownRed"] = this.loadSingleImage(false, "RobotDownRed.png");
		images["RobotLeftRed"] = this.loadSingleImage(false, "RobotLeftRed.png");
		images["RobotUpRed"] = this.loadSingleImage(false, "RobotUpRed.png");
		images["RobotRightRed"] = this.loadSingleImage(false, "RobotRightRed.png");

		//Matt Leeke
		images["AllSidesMatt"] = this.loadSingleImage(true, "AllSides.jpg");
		images["BottomMatt"] = this.loadSingleImage(true, "Bottom.jpg");
		images["BottomRightCornerMatt"] = this.loadSingleImage(true, "BottomRightCorner.jpg");
		images["BottomLeftCornerMatt"] = this.loadSingleImage(true, "BottomLeftCorner.jpg");
		images["LeftMatt"] = this.loadSingleImage(true, "Left.jpg");
		images["LeftAndRightMatt"] = this.loadSingleImage(true, "LeftAndRight.jpg");
		images["RightMatt"] = this.loadSingleImage(true, "Right.jpg");
		images["RobotDownMatt"] = this.loadSingleImage(true, "RobotDown.png");
		images["RobotUpMatt"] = this.loadSingleImage(true, "RobotUp.png");
		images["RobotRightMatt"] = this.loadSingleImage(true, "RobotRight.png");
		images["RobotLeftMatt"] = this.loadSingleImage(true, "RobotLeft.png");
		images["SingleMatt"] = this.loadSingleImage(true, "Single.jpg");
		images["TBottomMatt"] = this.loadSingleImage(true, "TBottom.jpg");
		images["TLeftMatt"] = this.loadSingleImage(true, "TLeft.jpg");
		images["TopMatt"] = this.loadSingleImage(true, "Top.jpg");
		images["TopAndBottomMatt"] = this.loadSingleImage(true, "TopAndBottom.jpg");
		images["TopLeftCornerMatt"] = this.loadSingleImage(true, "TopLeftCorner.jpg");
		images["TopRightCornerMatt"] = this.loadSingleImage(true, "TopRightCorner.jpg");
		images["TRightMatt"] = this.loadSingleImage(true, "TRight.jpg");
		images["TTopMatt"] = this.loadSingleImage(true, "TTop.jpg");
		images["RobotDownRedMatt"] = this.loadSingleImage(true, "RobotDownRed.png");
		images["RobotLeftRedMatt"] = this.loadSingleImage(true, "RobotLeftRed.png");
		images["RobotUpRedMatt"] = this.loadSingleImage(true, "RobotUpRed.png");
		images["RobotRightRedMatt"] = this.loadLastImage(true, "RobotRightRed.png");
	}

	// Load the given image.
	this.loadSingleImage = function(matt, filename)
	{
		var imgObj = new Image();
		if (matt) {
			imgObj.src = imgLocation+"Pink"+filename;
		} else {
			imgObj.src = imgLocation+filename;
		}
		return imgObj;
	}

	this.loadLastImage = function(matt, filename) // When last image has loaded, call drawMaze()
	{
		var imgObj = new Image();
		if (matt) {
			imgObj.src = imgLocation+"Pink"+filename;
		} else {
			imgObj.src = imgLocation+filename;
		}
		
		imgObj.onload = function() {
			generator = new Generator();
			generator.fullUpdate();
		}
		return imgObj;

	}

}