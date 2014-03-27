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
	this.endX = this.newWidth-2;
	this.endY = this.newHeight-2;
	this.start = [1,1];
	this.finish = [(2*this.mazeWidth)-1,(2*this.mazeHeight)-1];
	this.frontierList = [];
	this.primGrid = [];

	this.PASSAGE = 3001;
	this.WALL = 3000;


	this.toJSON = function(maze)
	{
		var jsonLayout = maze;
		//jsonLayout = jsonLayout.replace('"','');
		var jsonMaze = {
		"layout": jsonLayout,
		"start_pos" : {
			"x": this.startX,
			"y": this.startY
		},
		"robot_pos" : {
			"x": this.startX,
			"y": this.startY
		},
		"robot_orientation":1000,
		"finish_pos" : {
			"x" : this.endX,
			"y" : this.endY
		},
		"steps":0,
		"collisions":0,
		"goal_reached":false,
		"runs":0 
		};
		return jsonMaze;
	}

	this.updateJSON = function()
	{
		var jsonMaze = this.toJSON(Maze);
		var prefix = "[MAZE]";
		json = prefix.concat(JSON.stringify(jsonMaze));
	}

	this.quickUpdate = function(maze, robotposx, robotposy, oldposx, oldposy, orientation)
	{
		var c = this.findCanvasProperties();
		// Clear both old and new squares.
		this.drawRobot(c,robotposx,robotposy,orientation)
		
		//Fill old position as 'been before'
		//if (robotposx != oldposx && robotposy != oldposy)
		//{
			ctx.fillStyle="#b5b5b5";
			ctx.fillRect(oldposx*canvasWidth/this.newWidth,oldposy*canvasHeight/this.newHeight,canvasHeight/this.newHeight,canvasWidth/this.newWidth);
		//}
	}

	this.fullUpdate = function(maze, robotposx, robotposy, orientation, oldCollisions)
	{
		var c = this.findCanvasProperties();
		this.clearCanvas();
		this.drawMaze(maze);
		this.drawRobot(robotposx, robotposy, orientation, oldCollisions)
	}

	this.drawRobot = function(robotposy, robotposx, orientation, oldCollisions)
	{
		var c = this.findCanvasProperties();
		var append = "";
		var blockWidth = canvasWidth/this.newWidth;
		var blockHeight = canvasHeight/this.newHeight;
		// If there has been a collision, prepend "Red" to display the collision sprite.
		if (oldCollisions != collisions)
		{
			append = "Red";
		}
		// Clear square ready to draw robot
		ctx.clearRect(robotposx*canvasWidth/this.newWidth, robotposy*blockHeight, blockWidth, blockHeight)
		// Choose correct sprite depending on orientation
		if (orientation == '1000')
		{
			this.draw("RobotLeft"+append,robotposx*blockWidth+2, robotposy*blockHeight+2, blockWidth-4, blockHeight-4);
		}
		else if (orientation == '1001')
		{
			this.draw("RobotDown"+append,robotposx*blockWidth+2, robotposy*blockHeight+2, blockWidth-4, blockHeight-4);	
		}
		else if (orientation == '1002')
		{
			this.draw("RobotRight"+append,robotposx*blockWidth+2, robotposy*blockHeight+2, blockWidth-4, blockHeight-4);	
		}
		else if (orientation == '1003')
		{
			this.draw("RobotUp"+append,robotposx*blockWidth+2, robotposy*blockHeight+2, blockWidth-4, blockHeight-4);	
		}
	}


	this.draw = function(imgtag, x, y, width, height)
	{
		ctx.drawImage(images[imgtag],x,y,width,height);
	}

	this.findCanvasProperties = function()
	{
		if(fullScreen == true)
		{
			var c=document.getElementById("large-canvas");
			console.log(c.width);
			console.log(c.height);
			canvasWidth = c.width;
			canvasHeight = c.height;
			//canvasWidth = c.width;
			//canvasHeight = c.height;
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

	this.clearCanvas = function()
	{
		var c = this.findCanvasProperties();
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	this.draw3neighbours = function(x,y,width,height,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.EAST) != -1){
			this.draw("TTop", x, y, width, height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TLeft", x, y, width, height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TRight", x, y, width, height);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TBottom", x, y, width, height);
		}
	}

	this.draw2neighbours = function(x,y,width,height,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.SOUTH) != -1 ){
			this.draw("TopAndBottom",x,y,width,height);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("LeftAndRight",x,y,width,height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("BottomRightCorner",x,y,width,height);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("BottomLeftCorner",x,y,width,height);
		}
		else if (neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("TopRightCorner",x,y,width,height);
		}
		else if(neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("TopLeftCorner",x,y,width,height);
		}
	}

	this.drawSingleNeighbour = function (x,y,width,height,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1)
			this.draw ("Top",x,y,width,height);
		else if (neighbours.indexOf(this.EAST) != -1)
			this.draw ("Right",x,y,width,height);
		else if (neighbours.indexOf(this.WEST) != -1)
			this.draw ("Left",x,y,width,height);
		else if(neighbours.indexOf(this.SOUTH) != -1)
			this.draw ("Bottom",x,y,width,height);
	}

	this.drawBlock = function (x,y,width,height,maze,neighbours)
	{
		this.draw("Single",x,y,width,height);
	}

	this.drawMiddleBlock = function (x,y,width,height,maze,neighbours)
	{
		this.draw("AllSides",x,y,width,height);
	}

	this.checkTile = function(x,y, height, width, maze)
	{
		var i = 0;
		var neighbourWalls = [];
		if (y < height-1  && maze[x][y+1] == '3000')
			neighbourWalls[i++] = this.SOUTH;
		if (y != 0 && maze[x][y-1] == '3000')
			neighbourWalls[i++] = this.NORTH;
		if (x < width-1 && maze[x+1][y] == '3000')
			neighbourWalls[i++] = this.EAST;
		if (x != 0 && maze[x-1][y] == '3000')
			neighbourWalls[i++] = this.WEST;
		return neighbourWalls;
	}

	this.drawMaze = function(maze)
	{
		this.loadImages();
		c=this.findCanvasProperties();
		var neighbours = [];
		var blockWidth = canvasWidth/this.newWidth;
		var blockHeight = canvasHeight/this.newHeight;
		console.log("Block Width: "+blockWidth);
		console.log("Block Height: "+blockHeight);

		for (var i=0; i<this.newHeight; i++)
		{
			for (var j=0; j<this.newWidth; j++)
			{
				posi = i*canvasHeight/this.newHeight;
				posj = j*canvasWidth/this.newWidth;
				neighbours=[];

				if(this.endY == i && this.endX == j)
				{
					ctx.fillStyle="#FF0000";
					ctx.fillRect(j*blockHeight,i*blockWidth,blockWidth,blockHeight);
				}
				else if (maze[j][i] == 3000)
				{	
					neighbours = this.checkTile(j,i, this.newHeight, this.newWidth, maze);
					if (neighbours.length == 4){
						this.drawMiddleBlock(posj,posi,blockWidth,blockHeight,maze,neighbours);
					}
					else if (neighbours.length== 3){
						this.draw3neighbours(posj,posi,blockWidth,blockHeight,maze,neighbours);
					}
					else if (neighbours.length == 2){
						this.draw2neighbours(posj,posi,blockWidth,blockHeight,maze,neighbours);
					}
					else if (neighbours.length == 1){
						this.drawSingleNeighbour(posj,posi,blockWidth,blockHeight,maze,neighbours);
					}
					else {
						this.drawBlock(posj,posi,blockWidth,blockHeight,maze,neighbours);
					}
					//(maze)ctx.fillStyle="#0080FF";
					//ctx.fillRect(j*400/newHeight,i*400/newWidth,400/newHeight+1,400/newWidth);
				}
				else if (maze[j][i] == 4000)
				{
					ctx.fillStyle="#b5b5b5";
					ctx.fillRect(posj+2,posi+2,blockWidth-4,blockHeight-4,maze,neighbours);
				}
			}
		}
	}

	this.isValid = function(m, x, y)
	{
		for(var i = x - 1; i <= x; i++) {
			for(var j = y - 1; j <= y; j++) {
			
				var invalidSquare = true;
				for(var a = i; a <= i+1; a++) {
					for(var b = j; b <= j+1; b++) {
						if (m[a][b] == this.WALL && !((x == a) && (y == b)))
							invalidSquare = false;
					}
				}
				if (invalidSquare) return false;
			}
		}
		return true;
	}

	this.getWalls = function(m, x, y)
	{
		var count = 0;
		for (var i = x - 1; i <= x+1; i+=2) {
			if(m[i][y] == this.WALL) count++;
		}
		
		for (var i = y - 1; i <= y+1; i+=2) {
			if(m[x][i] == this.WALL) count++;
		}
		return count;
	}

	this.centerTarget = function(m)
	{
		var x = this.mazeWidth;
		var y = this.mazeHeight;

		while (true)
		{
			if(m[x][y] == this.PASSAGE)
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
		return m;
	}

	this.generate = function()
	{
		var maze;
		if (prims == true)
		{
			maze = this.generatePrims();
		}
		else
		{
			maze = this.generateLoopy()
		}
		return maze;
	}


	this.generateLoopy = function()
	{	
		var maze = this.generatePrims();
		var realWidth = (2*this.mazeWidth)+1;
		var realHeight = (2*this.mazeHeight)+1;

		for(var i = 0; i < realWidth; i++)
			for (var j = 0; j < realHeight; j++)
			{
				//console.log(maze[i][j]);
				//console.log(maze[i,j] == this.WALL);
			}

		for (var i = 1; i < realWidth - 1; i++)
		{
			for (var j = 1; j < realHeight - 1; j++)
			{
				if (this.isValid(maze,i,j) && this.getWalls(maze,i,j) < 3 && Math.random() > 0.5)
				{
					maze[i][j] = this.PASSAGE;
				}
			}
		}
		//maze = this.centerTarget(maze);
		Maze = maze;
		return maze;
	}

	this.generatePrims = function()
	{
		robotposX = 1; // Set initial robot positon, it is then updated with each maze recieved after a step.
		robotposY = 1;
		collisions = 0;
		orientation = 1001;
		if ((this.mazeWidth < 1) || (this.mazeHeight < 1))
			alert ("Invalid Maze Dimensions");
		
		var realWidth = (2*this.mazeWidth)+1;
		var realHeight = (2*this.mazeHeight)+1;
		
		mazeGrid = this.initialiseGrid(realWidth, realHeight);

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
		
		mazeGrid = this.setPrimCellType(mazeGrid, originX, originY, this.IN);
		if (originX > 1)
			this.setPrimCellType(mazeGrid,originX-2,originY,this.FRONTIER);
		if (originY > 1)
			this.setPrimCellType(mazeGrid,originX,originY-2,this.FRONTIER);
		if (originX < this.primGrid.length-2)
	         this.setPrimCellType(mazeGrid,originX+2,originY,this.FRONTIER);
	    if (originY > this.primGrid[0].length-2)
	         this.setPrimCellType(mazeGrid,originX,originY+2,this.FRONTIER);		// change to less than if broken
		
		// start Prim's algorithm loop
		while (this.frontierList.length > 0)
		{	// choose frontier point at random
			frontierPosition = Math.floor(Math.random()*this.frontierList.length);
			frontier = this.frontierList[frontierPosition];
			// add point to path
			this.setPrimCellType(mazeGrid, frontier[0], frontier[1], this.IN);
			if(frontier[0] > 1)
				if (this.primGrid[frontier[0]-2][frontier[1]] == this.OUT)
					this.setPrimCellType(mazeGrid, frontier[0]-2, frontier[1], this.FRONTIER);
			if(frontier[1] > 1)
				if (this.primGrid[frontier[0]][frontier[1]-2] == this.OUT)
					this.setPrimCellType(mazeGrid, frontier[0], frontier[1]-2, this.FRONTIER);
			if(frontier[0] < this.primGrid.length-2)
				if (this.primGrid[frontier[0]+2][frontier[1]] == this.OUT)
					this.setPrimCellType(mazeGrid,frontier[0]+2, frontier[1], this.FRONTIER);
			if(frontier[1] > this.primGrid[0].length-2)											//change to less than if broken
				if (this.primGrid[frontier[0]][frontier[1+2]] == this.OUT)
					this.setPrimCellType(mazeGrid, frontier[0], frontier[1]+2, this.FRONTIER);
		
			
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
					case this.NORTH: {   this.setPrimCellType(mazeGrid,frontier[0],frontier[1]-1,this.IN);
								   break;
								}
					case this.EAST:  {   this.setPrimCellType(mazeGrid,frontier[0]+1,frontier[1],this.IN);
								   break;
								}
					case this.SOUTH: {   this.setPrimCellType(mazeGrid,frontier[0],frontier[1]+1,this.IN);
								   break;
								}
					case this.WEST:  {  this.setPrimCellType(mazeGrid,frontier[0]-1,frontier[1],this.IN);
								}
				 }
			//console.log("Fronteier: + "+frontier[0]+" "+frontier[1]+ " removing: "+ frontierList[frontierPosition][0]+" "+frontierList[frontierPosition][1]);
			var removed = this.frontierList.splice(frontierPosition, 1);
			//console.log("Removed: "+ removed[0] +" "+removed[1]);
			//console.log(frontierList);
		}

		/*for (var i = 0; i<realWidth; i++)
		{
			for (var j = 0; j<realHeight; j++)
				document.write(mazeGrid[i][j] + "\t\t\t\t");
			document.write("<br>");
		}*/
		Maze = mazeGrid;
		return mazeGrid;
	}

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

	this.setPrimCellType = function(mazeGrid, x, y, type)
	{
		if (type == this.IN)
			mazeGrid[x][y] = this.PASSAGE;
		if (type == this.FRONTIER)
			this.frontierList.push([x,y]);
		this.primGrid[x][y] = type;
		
		return mazeGrid;
	}

	// Images need to be preloaded to reduce computation
	this.loadImages = function()
	{
		numberLoaded = 0;
		var imageNames = new Array("AllSides.jpg","Bottom.jpg", "BottomRightCorner.jpg", "BottomLeftCorner.jpg", "Left.jpg", "LeftAndRight.jpg", "Right.jpg", "RobotDown.png", "RobotRight.png",
									"RobotLeft.png", "RobotUp.png", "Single.jpg", "TBottom.jpg", "TLeft.jpg", "Top.jpg", "TopAndBottom.jpg", "TopLeftCorner.jpg", "TopRightCorner.jpg", "TRight.jpg",
									"TTop.jpg", "RobotDownRed.png", "RobotLeftRed.png", "RobotRightRed.png","RobotUpRed.png");
		images = new Object();
		images["AllSides"] = this.loadSingleImage("AllSides.jpg");
		images["Bottom"] = this.loadSingleImage("Bottom.jpg");
		images["BottomRightCorner"] = this.loadSingleImage("BottomRightCorner.jpg");
		images["BottomLeftCorner"] = this.loadSingleImage("BottomLeftCorner.jpg");
		images["Left"] = this.loadSingleImage("Left.jpg");
		images["LeftAndRight"] = this.loadSingleImage("LeftAndRight.jpg");
		images["Right"] = this.loadSingleImage("Right.jpg");
		images["RobotDown"] = this.loadSingleImage("RobotDown.png");
		images["RobotUp"] = this.loadSingleImage("RobotUp.png");
		images["RobotRight"] = this.loadSingleImage("RobotRight.png");
		images["RobotLeft"] = this.loadSingleImage("RobotLeft.png");
		images["Single"] = this.loadSingleImage("Single.jpg");
		images["TBottom"] = this.loadSingleImage("TBottom.jpg");
		images["TLeft"] = this.loadSingleImage("TLeft.jpg");
		images["Top"] = this.loadSingleImage("Top.jpg");
		images["TopAndBottom"] = this.loadSingleImage("TopAndBottom.jpg");
		images["TopLeftCorner"] = this.loadSingleImage("TopLeftCorner.jpg");
		images["TopRightCorner"] = this.loadSingleImage("TopRightCorner.jpg");
		images["TRight"] = this.loadSingleImage("TRight.jpg");
		images["TTop"] = this.loadSingleImage("TTop.jpg");
		images["RobotDownRed"] = this.loadSingleImage("RobotDownRed.png");
		images["RobotLeftRed"] = this.loadSingleImage("RobotLeftRed.png");
		images["RobotUpRed"] = this.loadSingleImage("RobotUpRed.png");
		images["RobotRightRed"] = this.loadSingleImage("RobotRightRed.png");
	}

	this.loadSingleImage = function(filename)
	{
		var imgObj = new Image();
		imgObj.src = "../jpgs/Maze-parts/"+filename;
		/*imgObj.onload = function() {
			numberLoaded++;
		}*/
		return imgObj;
	}


}