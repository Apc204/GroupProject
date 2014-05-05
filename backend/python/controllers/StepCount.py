#!/usr/bin/python
from IRobot import IRobot
from random import choice

class StepCount(object):
    steps = 0
    def controlRobot(self,robot):
        # Select a random direction
        direction = choice([IRobot.AHEAD, IRobot.RIGHT, IRobot.BEHIND, IRobot.LEFT])
        robot.face(direction)  # Face the robot in this direction
        robot.advance()        # and move the robot
        self.steps += 1
        print("Step "+str(self.getSteps()))

    def reset(self):
        print("Resetting the controller")
        self.steps = 0

    def getSteps(self):
        return self.steps