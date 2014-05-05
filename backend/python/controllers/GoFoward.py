#!/usr/bin/python
from IRobot import IRobot
from random import choice
#import queue
from numbers import Real

class DumboController(object):

	def controlRobot(self,robot):
		
		if robot.look(IRobot.AHEAD) == IRobot.WALL:
			if robot.look(IRobot.LEFT) == IRobot.PASSAGE:
				robot.face(IRobot.LEFT)
			elif robot.look(IRobot.RIGHT) == IRobot.PASSAGE:
				robot.face(IRobot.RIGHT)
			elif robot.look(IRobot.LEFT) == IRobot.BEENBEFORE:
				robot.face(IRobot.LEFT)
			elif robot.look(IRobot.RIGHT) == IRobot.BEENBEFORE:
				robot.face(IRobot.RIGHT)	
			else:
				robot.face(IRobot.BEHIND)				
		elif robot.look(IRobot.AHEAD) == IRobot.BEENBEFORE:
			if robot.look(IRobot.LEFT) == IRobot.PASSAGE:
				robot.face(IRobot.LEFT)
			elif robot.look(IRobot.RIGHT) == IRobot.PASSAGE:
				robot.face(IRobot.RIGHT)
		
		robot.advance()