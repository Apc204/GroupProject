#!/usr/bin/python

from Maze import Point,Maze
from IRobot import IRobot
from RobotImpl import RobotImpl
from IRobotController import IRobotController
from Reset import ResetException
import json
import sys
import os
import inspect
#from RandomRobotController import RandomRobotController

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
        #print(r.getDescription())
        self.setController(r)

    def startController(self):
        #try:
        self.controller.start()
        #except ResetException:
        #    return

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
        #print(filename)
        fName = os.path.splitext(filename)
        if(fName[1] == ".py"):
            self.execfile(filename)
            #print(filter(lambda x: isinstance(eval(x),type) and issubclass(eval(x),IRobotController) and x!="IRobotController",dir()))
            for x in dir():
                if(isinstance(eval(x),type)):
                    if(issubclass(eval(x),IRobotController) and x != "IRobotController"):
                        #print(x)
                        for i in inspect.getmembers(__import__(x)):
                            if inspect.isclass(i[1]):
                                if (issubclass(i[1],IRobotController) and i[0]!="IRobotController"):
                                    r = i[1]()
                                    #print(r.getDescription())
                        #r = globals()[x]()
                                    return r
        else:
            raise RuntimeError("File given is not a Python file")

    def execfile(self,filename,globals=None,locals=None):
        if globals is None:
            globals = sys._getframe(1).f_globals
        if locals is None:
            locals = sys._getframe(1).f_locals
        with open(filename,"r") as fh:
            exec(fh.read()+"\n",globals,locals)

if __name__ == '__main__':
    ml = MazeLogic(sys.argv[1],sys.argv[2])
    #ml.loadController("RandomRobotController.py")
    #ml.setController(RandomRobotController())
    try:
        ml.startController()
        print("END OF EXECUTION")
    except ResetException as re:
        print(re)
    line=""
    while line != "stop\n":
        if line == "rerun\n":
            ml.resetController()
            try:
                ml.startController()
                print("END OF EXECUTION")
            except ResetException as re:
                print(re)
        line = sys.stdin.readline()
    #ml.robot.jsondump()