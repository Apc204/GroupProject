#!/usr/bin/python

from IRobot import IRobot
from IRobotController import IRobotController
from Point import Point

class PolledControllerWrapper(IRobotController,object):
    def __init__(self,ctlr):
        self.controller = ctlr
        self.robot = IRobot()
        #print(self.controller,"\n",hasattr(self.controller,'controlRobot'))
        #print(self.controller.controlRobot)
        #self.controlRobot = None
        #self.ctlrReset = None
        #if hasattr(ctlr,'controlRobot'):
        #    self.controlRobot = getattr(ctlr,'controlRobot')
        #if hasattr(ctlr, 'reset'):
        #    self.ctlrReset = getattr(ctlr,'reset')

    def start(self):
        while (self.robot.getLocation() != self.robot.getTargetLocation()):
            #self.controlRobot(self.robot)
            self.controller.controlRobot(self.controller,self.robot)
            self.robot.jsondump()

    def setRobot(self, robot):
        self.robot = robot
    
    def reset(self):
        self.controller.reset(self.controller)
        self.robot.reset()

    def getDescription(self):
        return "Polled Controller"