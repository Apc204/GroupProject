#!/usr/bin/python
from IRobot import IRobot
from random import choice

class DumboControllerReset(object):
    def controlRobot(self,robot):
        # Select a random direction
        direction = choice([IRobot.AHEAD, IRobot.RIGHT, IRobot.BEHIND, IRobot.LEFT])
        robot.face(direction)  # Face the robot in this direction
        robot.advance()        # and move the robot

    def reset(self):
        print("Resetting the controller")