#!/usr/bin/python

class IRobot(object):
    NORTH = 1000
    EAST = 1001
    SOUTH = 1002
    WEST = 1003

    AHEAD = 2000
    RIGHT = 2001
    BEHIND = 2002
    LEFT = 2003
    CENTRE = 2004
    
    WALL = 3000
    PASSAGE = 3001
    BEENBEFORE = 4000

    # Returns the number of times the robot has attempted to complete a maze
    #  and then been reset using a particular controller.
    #
    def getRuns(self):
        raise NotImplementedError
    
    # The robot looks at one of the 4 squares around it, and returns the state
    #  of that square.
    #  @param direction The direction of the square relative to the robot's position.
    #
    ##@staticmethod
    #def look(self, direction):
    #    raise NotImplementedError

    
    def look(self, direction):
        raise NotImplementedError
    
    # Gets the robot to turn in a particular direction relative to its current
    #  heading.
    #  @param direction The direction relative to the robot's heading.
    #
    #@staticmethod
    def face(self, direction):
        raise NotImplementedError
    
    # Sets the robot's heading using absolute directions (ie N/S/E/W)
    #  @param heading The robot's heading in absolute coordinates.
    #
    #@staticmethod
    def setHeading(self, heading):
        raise NotImplementedError
    
    # Returns the robot's absolute heading #
    #@staticmethod
    def getHeading(self):
        raise NotImplementedError
    
    # Returns the X and Y coordinates of the robot's current location.
    #  In the robot coordinate system, (0,0) is top left. The X coordinate
    #  increases as the robot moves East, and the Y coordinate as it moves South.
    #
    #@staticmethod
    def getLocation(self):
        raise NotImplementedError
    # Returns the X coordinate (column number) of the robot's current location.
    #  In the robot coordinate system, (0,0) is top left. The X coordinate
    #  increases as the robot moves East, and the Y coordinate as it moves South.
    #
    #@staticmethod
    def getLocationX(self):
        raise NotImplementedError
    # Returns the Y coordinate (row number) of the robot's current location.
    #  In the robot coordinate system, (0,0) is top left. The X coordinate
    #  increases as the robot moves East, and the Y coordinate as it moves South.
    #
    #@staticmethod
    def getLocationY(self):
        raise NotImplementedError
    # Makes the robot attempt to move forward one square. The robot cannot
    # move off the edge of the maze, or move into a wall square.
    #
    #@staticmethod
    def advance(self):
        raise NotImplementedError
    # Returns the location of the target square
    #  In the robot coordinate system, (0,0) is top left. The X coordinate
    #  increases as the robot moves East, and the Y coordinate as it moves South.
    #
    #@staticmethod
    def getTargetLocation(self):
        raise NotImplementedError

    # Pauses for the specified number of milliseconds #
    #@staticmethod
    def sleep(self, millis):
        raise NotImplementedError