#!/usr/bin/python

from random import choice
from IRobot import IRobot
from IRobotController import IRobotController
from maze import Point

class RandomRobotController(IRobotController,object):
    def __init__(self):
        self.robot = IRobot()

    def start(self):
        while (self.robot.getLocation() != self.robot.getTargetLocation()):
            direction = choice([IRobot.LEFT, IRobot.RIGHT, IRobot.AHEAD, IRobot.BEHIND])
            self.robot.face(direction)
            self.robot.advance()
            #print(self.robot.getLocation())
        #print("Steps: "+str(self.robot.getSteps()))
        #print("Collisions: "+str(self.robot.getCollisions()))

    def setRobot(self, robot):
        self.robot = robot
    
    def reset(self):
        self.active = false

    def getDescription(self):
        return "Random controller (pretty useless)"