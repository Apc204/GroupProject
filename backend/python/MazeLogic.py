#!/usr/bin/python

from Point import Point
from Maze import Maze
from IRobot import IRobot
from RobotImpl import RobotImpl
from IRobotController import IRobotController
from PolledControllerWrapper import PolledControllerWrapper
from Reset import ResetException
import json
import sys
from os.path import splitext,dirname
from os import getcwd
import inspect
            
class MazeLogic(object):
    def __init__(self, jsonfile, sourcefile,prefix):
        self.prefix = prefix
        self.maze = self.loadMaze(jsonfile)
        self.robot = RobotImpl(self.maze,self.prefix)
        r = self.loadController(sourcefile)
        self.setController(r)

    def startController(self):
        self.controller.start()

    def setController(self,irc):
        self.controller = irc
        self.controller.setRobot(self.robot)

    def resetController(self):
        self.controller.reset()

    # Create a Maze object from the information in the JSON file "jsonfile"
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

    # Create a controller instance from the Class fund within sourcefile
    def loadController(self, filename):
        fName = splitext(filename)
        if(fName[1] == ".py"):
            self.execfile(filename)
            for x in dir():
                if(isinstance(eval(x),type)):
                    if(issubclass(eval(x),IRobotController) and x != "IRobotController"):
                        for i in inspect.getmembers(__import__(x)):
                            if inspect.isclass(i[1]):
                                if (issubclass(i[1],IRobotController) and i[0]!="IRobotController"):
                                    r = i[1]()
                                    return r
                    elif(hasattr(eval(x),'controlRobot')):
                        pcw = PolledControllerWrapper(eval(x)())
                        for k,v in locals().items():
                            if hasattr(v,'__module__'):
                                if hasattr(sys.modules[v.__module__],'__file__'):
                                    if dirname(sys.modules[v.__module__].__file__) not in [getcwd(),""]:
                                        globals()[k] = v
                            elif k in sys.modules.keys():
                                if hasattr(sys.modules[k],'__file__'):
                                    if dirname(sys.modules[k].__file__) not in [getcwd(),""]:
                                        globals()[k] = v
                        return pcw
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
    prefix = '['+sys.argv[3]+']'
    ml = MazeLogic(sys.argv[1],sys.argv[2],prefix)
    # Attempt to run the controller, catching ResetException to account for reset behaviour
    try:
        ml.startController()
        print(prefix+"END OF EXECUTION")
    except ResetException as re:
        pass
    ml.resetController() # Reset the controller after termination of the run
    # Generate extra lines of long output to ensure that all steps are received by the middleware
    for a in range(5):
        b = prefix+'[RANDOM]'
        for c in range(1000):
            b+=str(c)
        print(b)
    # Loop the above process when given rerun commands until told to stop
    line=""
    while line != "stop\n":
        if line == "rerun\n":
            try:
                ml.startController()
                print(prefix+"END OF EXECUTION")
            except ResetException as re:
                pass
            for a in range(5):
                b = prefix+'[RANDOM]'
                for c in range(1000):
                    b+=str(c)
                print(b)
            ml.resetController()
        line = sys.stdin.readline()