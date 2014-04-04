#!/usr/bin/python

from random import choice
from IRobot import IRobot
from IRobotController import IRobotController
from Point import Point

class TestController(IRobotController,object):
    def __init__(self):
        self.robot = IRobot()

    def start(self):
        self.robot.jsondump()
        print(self.robot.look(IRobot.AHEAD))
        self.robot.advance()
        print(self.robot.look(IRobot.AHEAD))
        self.robot.face(IRobot.RIGHT)
        print(self.robot.look(IRobot.AHEAD))
        self.robot.advance()
        self.robot.face(IRobot.LEFT)
        self.robot.advance()
        print(self.robot.getLocation()==self.robot.getTargetLocation())

    def setRobot(self, robot):
        self.robot = robot
    
    def reset(self):
        self.robot.reset()

    def getDescription(self):
        return "test"

        # XXXXX
        # X=-XX
        # XX--X
        # XXXXX