#!/usr/bin/python
from IRobot import IRobot
from random import choice

class NoCollisions(object):
    def controlRobot(self,robot):
        # Loop infinitely
        while True:
            # Select a random direction
            direction = choice([IRobot.AHEAD, IRobot.RIGHT, IRobot.BEHIND, IRobot.LEFT])
            robot.face(direction)  # Face the robot in this direction

            # If there is not a wall ahead then break out of the loop
            if robot.look(IRobot.AHEAD) != IRobot.WALL:
                break

        robot.advance()        # and move the robot