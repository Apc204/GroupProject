#!/usr/bin/python
from IRobot import IRobot
from random import choice

class DumboControllerReset(object):
    step = 0
    
    def controlRobot(self,robot):

        # Select a random number

        randno = choice(range(0,3))

        # Convert this to a direction

        if randno == 0:
            direction = IRobot.LEFT
        elif randno == 1:
            direction = IRobot.RIGHT
        elif randno == 2:
            direction = IRobot.BEHIND
        else:
            direction = IRobot.AHEAD
         
        robot.face(direction)  # Face the robot in this direction */   

        robot.advance()        # and move the robot */

        self.step += 1
        print("STEP "+self.step)

    def reset(self):
        print("ASASASASASASASASASASASA")

    def anotherFunction(self):
        return "FUNCTION CALLED"