function Generator () {

	this.IN = 1;
	this.FRONTIER = 2;
	this.OUT = 3;
	this.NORTH = 10;
	this.EAST = 11;
	this.SOUTH = 12;
	this.WEST = 13;

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

	this.PASSAGE = 'O';
	this.WALL = 'X';

	this.toJSON = function(maze)
	{
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
		},
		"steps":0,
		"collisions":0,
		"goal_reached":"false",
		"runs":0 
		};
		return jsonMaze;
	}

	this.update = function(maze)
	{
		
	}

	this.draw= function(imgtag, x, y, height, width)
	{
			var imgObj = new Image();
			imgObj.src = "../jpgs/Maze-parts/"+imgtag+".jpg";
			imgObj.onload = function()
			{
				//var img=document.getElementById(imgtag);
				console.log("Drawing size "+height+" by "+width+" block.");
				ctx.drawImage(imgObj,x,y,height,width);
			}
	}

	this.findCanvasProperties = function()
	{
		if(fullScreen == true)
		{
			var c=document.getElementById("large-canvas");
			canvasWidth = largeCanvasWidth;
			canvasHeight = largeCanvasHeight;
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
			
		
		
		console.log(canvasHeight);
		console.log(canvasWidth);
		return c;
	}

	this.clearCanvas = function()
	{
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	this.draw3neighbours = function(x,y,height,width,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.EAST) != -1){
			this.draw("TTop", x, y, height, width);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TLeft", x, y, height, width);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TRight", x, y, height, width);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 && neighbours.indexOf(this.SOUTH) != -1){
			this.draw("TBottom", x, y, height, width);
		}
	}

	this.draw2neighbours = function(x,y,height,width,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.SOUTH) != -1 ){
			this.draw("TopAndBottom",x,y,height,width);
		}
		else if (neighbours.indexOf(this.EAST) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("LeftAndRight",x,y,height,width);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("BottomRightCorner",x,y,height,width);
		}
		else if (neighbours.indexOf(this.NORTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("BottomLeftCorner",x,y,height,width);
		}
		else if (neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.WEST) != -1 ){
			this.draw("TopRightCorner",x,y,height,width);
		}
		else if(neighbours.indexOf(this.SOUTH) != -1 && neighbours.indexOf(this.EAST) != -1 ){
			this.draw("TopLeftCorner",x,y,height,width);
		}
	}

	this.drawSingleNeighbour = function (x,y,height,width,maze,neighbours)
	{
		if (neighbours.indexOf(this.NORTH) != -1)
			this.draw ("Top",x,y,height,width);
		else if (neighbours.indexOf(this.EAST) != -1)
			this.draw ("Right",x,y,height,width);
		else if (neighbours.indexOf(this.WEST) != -1)
			this.draw ("Left",x,y,height,width);
		else if(neighbours.indexOf(this.SOUTH) != -1)
			this.draw ("Bottom",x,y,height,width);
	}

	this.drawBlock = function (x,y,height,width,maze,neighbours)
	{
		this.draw("Single",x,y,height,width);
	}

	this.drawMiddleBlock = function (x,y,height, width,maze,neighbours)
	{
		this.draw("AllSides",x,y,height,width);
	}

	this.checkTile = function(x,y, height, width, maze)
	{
		var i = 0;
		var neighbourWalls = [];
		if (y < height-1  && maze[x][y+1] == 'X')
			neighbourWalls[i++] = this.SOUTH;
		if (y != 0 && maze[x][y-1] == 'X')
			neighbourWalls[i++] = this.NORTH;
		if (x < width-1 && maze[x+1][y] == 'X')
			neighbourWalls[i++] = this.EAST;
		if (x != 0 && maze[x-1][y] == 'X')
			neighbourWalls[i++] = this.WEST;
		return neighbourWalls;
	}

	this.drawMaze = function(maze)
	{
		console.log("drawing maze");
		c=this.findCanvasProperties();
		var neighbours = [];
		blockWidth = canvasWidth/this.newWidth;
		blockHeight = canvasHeight/this.newHeight+1;

		

		for (var i=0; i<this.newHeight; i++)
		{
			for (var j=0; j<this.newWidth; j++)
			{
				posi = i*canvasWidth/this.newWidth;
				posj = j*canvasHeight/this.newHeight;
				neighbours=[];
				if (this.startY == i && this.startX == j)
				{
					ctx.fillStyle="#00FF00";
					console.log("Canvas Height: "+canvasHeight);
					console.log("Canvas : "+canvasWidth);
					console.log("Dividing by (height): "+this.newHeight);
					console.log("Dividing by (width): "+this.newWidth);

					console.log("size of block:"+canvasWidth/this.newWidth);
					console.log("size of block:"+canvasHeight/this.newHeight);
					ctx.fillRect(j*canvasHeight/this.newHeight,i*canvasWidth/this.newWidth,canvasHeight/this.newHeight+1,canvasWidth/this.newWidth);
				}
				else if(this.endY == i && this.endX == j)
				{
					ctx.fillStyle="#FF0000";
					ctx.fillRect(j*canvasHeight/this.newHeight,i*canvasWidth/this.newWidth,canvasHeight/this.newHeight+1,canvasWidth/this.newWidth);
				}
				else if (maze[j][i] == 'X')
				{
					neighbours = this.checkTile(j,i, this.newHeight, this.newWidth, maze);
					//console.log(neighbours.length);
					if (neighbours.length == 4){
						this.drawMiddleBlock(posj,posi,canvasHeight/this.newHeight,canvasWidth/this.newWidth,maze,neighbours);
					}
					else if (neighbours.length== 3){
						this.draw3neighbours(posj,posi,canvasHeight/this.newHeight,canvasWidth/this.newWidth,maze,neighbours);
					}
					else if (neighbours.length == 2){
						this.draw2neighbours(posj,posi,canvasHeight/this.newHeight,canvasWidth/this.newWidth,maze,neighbours);
					}
					else if (neighbours.length == 1){
						this.drawSingleNeighbour(posj,posi,canvasHeight/this.newHeight,canvasWidth/this.newWidth,maze,neighbours);
					}
					else {
						this.drawBlock(posj,posi,canvasHeight/this.newHeight,canvasWidth/this.newWidth,maze,neighbours);
					}
					//(maze)ctx.fillStyle="#0080FF";
					//ctx.fillRect(j*400/newHeight,i*400/newWidth,400/newHeight+1,400/newWidth);
				}
			}
		}
		console.log("done");
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


	this.generateLoopy = function()
	{	
		var maze = this.generatePrim();
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
		console.log("done generating");
		//maze = this.centerTarget(maze);
		Maze = maze;
		return maze;
	}

	this.generatePrim = function()
	{
		console.log("Calling incorrect generateMaze");
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

}