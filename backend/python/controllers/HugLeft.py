#!/usr/bin/python
from IRobot import IRobot
from random import choice
#import queue
from numbers import Real

class DumboController(object):

	def controlRobot(self,robot):
		if robot.look(IRobot.LEFT) != IRobot.WALL:
			robot.face(IRobot.LEFT)
		elif robot.look(IRobot.AHEAD) == IRobot.WALL:
			robot.face(IRobot.RIGHT)
		
		robot.advance()