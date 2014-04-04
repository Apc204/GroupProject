#!/usr/bin/python
from IRobot import IRobot
from random import choice
import queue
from numbers import Real

class DumboController(object):
    
    def controlRobot(self,robot):

        # Select a random number

        randno = choice(range(0,3))

        # Convert this to a direction

        if randno == 0:
            direction = IRobot.LEFT
        elif randno == 1:
            direction = IRobot.RIGHT
        elif randno == 2:
            direction = IRobot.BEHIND
        else:
            direction = IRobot.AHEAD
         
        robot.face(direction)  # Face the robot in this direction */   

        robot.advance()        # and move the robot */