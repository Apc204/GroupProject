#!/usr/bin/python

from IRobot import IRobot

class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return str((self.x, self.y))
    def __repr__(self):
        return str((self.x, self.y))
    def __eq__(self,p):
        return (self.x == p.x and self.y == p.y)
    def __ne__(self,p):
        return not(self.x == p.x and self.y == p.y)

class Maze(object):
    def __init__(self, mazeCol, rows=None):
        if rows != None:
            self.maze = [[IRobot.WALL for row in range(rows)] for column in range(mazeCol)]
            self.height = rows
            self.width = mazeCol
        else:
            self.maze = mazeCol
            self.height = len(mazeCol[0])
            self.width = len(mazeCol)
        self.start = Point(1,1)
        self.location = Point(1,1)
        self.target = Point(self.width - 2, self.height - 2)
        self.heading = IRobot.EAST


    def __str__(self):
        return str(self.maze)+str((self.start, self.target, self.location, self.heading))

    def __repr__(self):
        result = ""
        for row in range(self.height):
            for column in self.maze:
                if column[row] == IRobot.PASSAGE:
                    result += "-"
                else:
                    result += "X"
            result += '\n'
        result += "Start: "+str(self.start)+"\n"
        result += "Target: "+str(self.target)+"\n"
        result += "Location: "+str(self.location)+"\n"  
        result += "Heading: "+str(self.heading)
        return result

    def getWidth(self):
        return self.width

    def getHeight(self):
        return self.height

    def getTileType(self, px, py=None):
        if(py != None):
            return self.maze[px][py]
        else:
            return self.maze[px.x][px.y]

    def setTile(self, tile, px, py=None):
        if(py!=None):
            self.maze[px][py] = tile
        else:
            self.maze[px.x][px.y] = tile

    def getStart(self):
        return self.start
    def setStart(self,px,py=None):
        if (py != None):
            self.start = Point(px,py)
        else:
            self.start = px

    def getLocation(self):
        return self.location
    def setLocation(self,px,py=None):
        if (py!=None):
            self.location = Point(px,py)
        else:
            self.location = px

    def getFinish(self):
        return self.target
    def setFinish(self,px,py=None):
        if (py!=None):
            self.target = Point(px,py)
        else:
            self.target = px

    def getHeading(self):
        return self.heading
    def setHeading(self, newHeading):
        if(newHeading < IRobot.NORTH or newHeading > IRobot.WEST):
            raise RuntimeError("The robot's heading can only be NORTH, SOUTH, EAST or WEST.")
        self.heading = newHeading

if __name__ == "__main__":
    maze = Maze(5,3)
    print(repr(maze))
