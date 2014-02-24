
function LoopyGenerator () {
	this.PASSAGE = 'O';
	this.WALL = 'X';
}


LoopyGenerator.prototype.generateMaze = function() {
		console.log("Calling correct generateMaze");
		var maze = PrimGenerator.prototype.generateMaze.call(this);
		for (var i = 1; i < maze.getWidth() - 1; i++)
		{
			for (var j = 1; j < maze.getHeight() - 1; j++)
			{
				console.log("Doing Loopy Stuff ...")
				if (isValid(maze,i,j) && getWalls(maze,i,j) < 3 && Math.random() > 0.5)
					maze.setCellType(i, j, PASSAGE);
			}
		}

	centerTarget(maze);
	return maze;

}

LoopyGenerator.prototype.isValid = function(m, x, y) {
		for(var i = x - 1; i <= x; i++) {
			for(var j = y - 1; j <= y; j++) {
			
				var invalidSquare = true;
				for(var a = i; a <= i+1; a++) {
					for(var b = j; b <= j+1; b++) {
						if (m.getCellType(a, b) == WALL && !((x == a) && (y == b)))
							invalidSquare = false;
					}
				}
				if (invalidSquare) return false;
				
			}
		}
		return true;
}


LoopyGenerator.prototype.getWalls = function(m, x, y) {
		var count = 0;
		for (var i = x - 1; i <= x+1; i+=2) {
			if(m.getCellType(i, y) == WALL) count++;
		}
		
		for (var i = y - 1; i <= y+1; i+=2) {
			if(m.getCellType(x, i) == WALL) count++;
		}
		return count;
}


LoopyGenerator.prototype.centerTarget = function(m) {
		var x = m.getWidth() / 2;
		var y = m.getHeight() / 2;

		while (true)
		{
			if(m.getCellType(x, y) == PASSAGE)
			{
				m.setFinish(x, y);
				return;
			}
			if(Math.random() > 0.5)
			{
				x = (x+1) % m.getWidth();
			} else {
				y = (y+1) % m.getHeight();
			}
		}
}
