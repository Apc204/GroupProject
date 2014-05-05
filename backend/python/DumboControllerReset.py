#!/usr/bin/python
from IRobot import IRobot
from random import choice

class DumboControllerReset(object):
    def controlRobot(self,robot):
        # Select a random direction
        #direction = choice([IRobot.AHEAD, IRobot.RIGHT, IRobot.BEHIND, IRobot.LEFT])
          # Face the robot in this direction

        if robot.getHeading()==IRobot.NORTH:
        	robot.face(IRobot.BEHIND)
        elif robot.getHeading()==IRobot.EAST:
        	robot.face(IRobot.RIGHT)
        elif robot.getHeading()==IRobot.SOUTH:
        	robot.face(IRobot.AHEAD)
        elif robot.getHeading()==IRobot.WEST:
        	robot.face(IRobot.LEFT)

        robot.advance()        # and move the robot

    def reset(self):
        print("Resetting the controller")