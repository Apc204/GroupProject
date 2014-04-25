#!/usr/bin/python

from IRobot import IRobot
from Maze import Maze
from Point import Point
from Reset import ResetException
import sys

class RobotImpl(object):
    start = Point(0,0)
    location = Point(1,1)
    target = Point(2,2)
    heading = IRobot.EAST

    def __init__(self, maze, prefix):
        self.prefix = prefix
        self.steps = 0
        self.collisions = 0
        self.setMaze(maze)

    def setMaze(self,maze):
        self.maze = maze
        self.width = maze.getWidth()
        self.height = maze.getHeight()
        self.start = self.maze.start
        self.target = self.maze.target
        self.location = self.maze.location
        self.maze.setTile(IRobot.BEENBEFORE, self.maze.location)
        self.heading = self.maze.heading
        self.runs = 0

    # Getter and Setter methods

    def getLocationX(self):
        return self.location.x
    def getLocationY(self):
        return self.location.y
    def getLocation(self):
        return self.location

    def getTargetLocation(self):
        return self.target
   
    def setTargetLocation(self, px, py=None):
        if(py!=None):
            self.target = Point(px,py)
        else:
            self.target = px

    def getHeading(self):
        return self.heading
    def setHeading(self, newHeading):
        if(newHeading < IRobot.NORTH or newHeading > IRobot.WEST):
            raise RuntimeError("The robot's heading can only be NORTH, SOUTH, EAST or WEST.")
        self.heading = newHeading

    def getSteps(self):
        return self.steps
    def getCollisions(self):
        return self.collisions
    def getRuns(self):
        return self.runs

    # Turn the robot to face a new direction
    def face(self, newdir):
        if(newdir < IRobot.AHEAD or newdir > IRobot.LEFT):
            raise RuntimeError("The robot can only face AHEAD, BEHIND, LEFT and RIGHT.")
        if(newdir == IRobot.BEHIND):
            self.setHeading((self.heading + 2) % 4 + IRobot.NORTH)
        elif(newdir ==  IRobot.LEFT):
            self.setHeading((self.heading + 3) % 4 + IRobot.NORTH)
        elif(newdir ==  IRobot.RIGHT):
            self.setHeading((self.heading + 1) % 4 + IRobot.NORTH)

    # Inspect the adjecent tile in a given direction to find what type it is
    def look(self, direction):
        if(direction < IRobot.AHEAD or direction > IRobot.LEFT):
            raise RuntimeError("The robot can only look AHEAD, BEHIND, LEFT and RIGHT.")
        
        newHeading = (self.heading + direction) % 4
        if(newHeading == 0):
            point = Point(self.getLocationX(), self.getLocationY() - 1)
        elif(newHeading == 1):
            point = Point(self.getLocationX() + 1, self.getLocationY())
        elif(newHeading == 2):
            point = Point(self.getLocationX(), self.getLocationY() + 1)
        elif(newHeading == 3):
            point = Point(self.getLocationX() - 1, self.getLocationY())
        else:
            point = Point(self.getLocationX(), self.getLocationY())

        tileType = self.maze.getTileType(point)

        return tileType

    # Attempt to move the robot forwards
    def advance(self):
        x = self.location.x
        y = self.location.y

        if(self.heading == IRobot.NORTH):
            y = y-1
        elif(self.heading == IRobot.EAST):
            x = x+1
        elif(self.heading == IRobot.SOUTH):
            y = y+1
        elif(self.heading == IRobot.WEST):
            x = x-1

        if (x<0 or y<0 or x>=self.maze.getWidth() or y>=self.maze.getHeight()):
            raise RuntimeError("Robot cannot advance off the edge of the maze!")

        if(self.maze.getTileType(x,y) == IRobot.WALL):
            self.collisions = self.collisions+1
        else:
            self.steps = self.steps+1
            self.location = Point(x,y)

        self.maze.setTile(IRobot.BEENBEFORE,self.location)

    # Reset the robot and the maze to their original state
    def reset(self):
        for x in range(self.width):
            for y in range(self.height):
                if self.maze.getTileType(x,y) == IRobot.BEENBEFORE:
                    self.maze.setTile(IRobot.PASSAGE,x,y)
        self.location = self.start
        self.heading = IRobot.EAST
        self.maze.setTile(IRobot.BEENBEFORE,self.location)
        self.steps = 0
        self.collisions = 0
        self.runs += 1

    # Output JSON representing the current state of the robot and maze to stdout
    def jsondump(self):
        # Wait for instruction from the middleware
        line=""
        while (line != "step\n" and line != "reset\n"):
            line = sys.stdin.readline()
        
        data = ''

        # If a reset instruction was received, reset the robot and maze and add a reset prefix to the return string
        if line == "reset\n":
            self.reset()
            data += '[RESET]'

        # maze is transposed when input, so transpose back for outputting
        m = [[r[col] for r in self.maze.maze] for col in range(len(self.maze.maze[0]))]
        # Construct a string containing JSON representing the current state of the robot and maze
        data += '{ "layout":'+str(m)+','
        data += '"start_pos":{"x":'+str(self.start.x)+',"y":'+str(self.start.y)+'},'
        data += '"finish_pos":{"x":'+str(self.target.x)+',"y":'+str(self.target.y)+'},'
        data += '"robot_pos":{"x":'+str(self.location.x)+',"y":'+str(self.location.y)+'},'
        data += '"robot_orientation":'+str(self.heading)+','
        data += '"steps":'+str(self.steps)+','
        data += '"collisions":'+str(self.collisions)+','
        data += '"goal_reached":'+str(self.location == self.getTargetLocation()).lower()+','
        data += '"runs":'+str(self.runs)+'}'

        # Print the string prepended with the prefix
        print(self.prefix+data)

        # If a reset instruction was received, adjust the number of runs to avoid increasing twice
        # then throw a ResetException to halt execution of the current run
        if line == "reset\n":
            self.runs -= 1
            raise ResetException("RESET")