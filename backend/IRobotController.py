#!/usr/bin/python

from random import choice
from IRobot import IRobot
from maze import Point

class IRobotController(object):

   def setRobot(self, robot):
        raise NotImplementedError
   
   def start(self):
        raise NotImplementedError
   
   def reset(self):
        raise NotImplementedError
   
   def getDescription(self):
        raise NotImplementedError