#!/usr/bin/python
from IRobot import IRobot
from random import choice

class OnlySouth(object):
    def controlRobot(self,robot):
        # Face the robot SOUTH
        if robot.getHeading() == IRobot.NORTH:
            robot.face(IRobot.BEHIND)
        elif robot.getHeading() == IRobot.EAST:
            robot.face(IRobot.RIGHT)
        elif robot.getHeading() == IRobot.SOUTH:
            robot.face(IRobot.AHEAD)
        elif robot.getHeading() == IRobot.WEST:
            robot.face(IRobot.LEFT)
            
        robot.advance()        # and move the robot