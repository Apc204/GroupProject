#!/usr/bin/python

from maze import Point,Maze
from IRobot import IRobot
from RobotImpl import RobotImpl
from IRobotController import IRobotController
import json
import sys
import os
from RandomRobotController import RandomRobotController

testmaze = [[3000,3000,3000,3000,3000],
            [3000,3001,3000,3000,3000],
            [3000,3001,3001,3001,3000],
            [3000,3000,3000,3001,3000],
            [3000,3000,3000,3000,3000]]
            
class MazeLogic(object):
    def __init__(self, jsonfile, sourcefile):
        self.maze = self.loadMaze(jsonfile)
        self.robot = RobotImpl(self.maze)
        r = self.loadController(sourcefile)
        self.setController(r)

    def startController(self):
        self.controller.start()

    def setController(self,irc):
        self.controller = irc
        self.controller.setRobot(self.robot)

    def resetController(self):
        self.controller.reset()

    def loadMaze(self,jsonfile):
        with open(jsonfile) as jsondata:
            data = json.load(jsondata)
            maze = data["layout"]
            heading = data["robot_orientation"]
            start = Point(data["start_pos"]["x"],data["start_pos"]["y"])
            location = Point(data["robot_pos"]["x"],data["robot_pos"]["y"])
            finish = Point(data["finish_pos"]["x"],data["finish_pos"]["y"])
            m = Maze(maze)
            m.setStart(start)
            m.setFinish(finish)
            m.setLocation(location)
            m.setHeading(heading)
        return m


    def loadController(self, filename):
        fName = os.path.splitext(filename)
        if(fName[1] == ".py"):
            execfile(filename)
            #print(filter(lambda x: isinstance(eval(x),type) and issubclass(eval(x),IRobotController) and x!="IRobotController",dir()))
            for x in dir():
                if(isinstance(eval(x),type)):
                    if(issubclass(eval(x),IRobotController) and x != "IRobotController"):
                        #print x
                        r = globals()[x]()
                        return r
        else:
            raise RuntimeError("File given is not a Python file")

if __name__ == '__main__':
    ml = MazeLogic(sys.argv[1],sys.argv[2])
    #ml.loadController("RandomRobotController.py")
    #ml.setController(RandomRobotController())
    ml.startController()
    #ml.robot.jsondump()