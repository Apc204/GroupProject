#!/usr/bin/python

from IRobot import IRobot
from Point import Point

class Maze(object):
    def __init__(self, mazeCol, rows=None):
        # If both rows and columns are given create a blank maze
        if rows != None:
            self.maze = [[IRobot.WALL for row in range(rows)] for column in range(mazeCol)]
            self.height = rows
            self.width = mazeCol
        # Else assume the single parameter is a 2D list
        else:
            # transpose incoming 2D list representation of maze
            # if maze = 123  then '6' should be maze[2][1]
            #           456
            # coming in as [[1,2,3],  would make maze[x][y] refer to row x, col y rather
            #               [4,5,6]]  than col x, row y as intended
            # therefore transpose incoming to [[1,4],  so that maze[x][y] refers to
            #                                  [2,5],  col x and row y
            #                                  [3,6]]
            
            self.maze = [[r[col] for r in mazeCol] for col in range(len(mazeCol[0]))]
            self.height = len(self.maze[0])
            self.width = len(self.maze)
        # Set default starting positions pending updates later
        self.start = Point(1,1)
        self.location = Point(1,1)
        self.target = Point(self.width - 2, self.height - 2)
        self.heading = IRobot.EAST

    # Define the behaviour of the print function on a Maze object
    def __str__(self):
        return str(self.maze)+str((self.start, self.target, self.location, self.heading))

    # Define the behaviour of the readable print function on a Maze object
    def __repr__(self):
        result = ""
        for row in range(self.height):
            for column in self.maze:
                if column[row] == IRobot.PASSAGE:
                    result += "-"
                elif column[row] == IRobot.BEENBEFORE:
                    result += "="
                else:
                    result += "X"
            result += '\n'
        result += "Start: "+str(self.start)+"\n"
        result += "Target: "+str(self.target)+"\n"
        result += "Location: "+str(self.location)+"\n"  
        result += "Heading: "+str(self.heading)
        return result

    # Getter and Setter methods

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
