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
        #print(dir())
        #print(r.getDescription())
        self.setController(r)

    def startController(self):
        ##try:
        #if isinstance(self.controller, PolledControllerWrapper):
        #    self.controller.start(self.robot)
        #else:
        self.controller.start()
        ##except ResetException:
        ##    return

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
        fName = splitext(filename)
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
                    elif(hasattr(eval(x),'controlRobot')):
                        pcw = PolledControllerWrapper(eval(x))
                        #print("\nglobals - locals")
                        #print(set(globals()) - set(locals()))
                        #print("\nlocals - globals")
                        #print(set(locals()) - set(globals()))
                        #print("\nglobals & locals")
                        #print(set(globals()) & set(locals()))
                        #print()
                        for k,v in locals().items():
                            #if inspect.ismodule(v):
                            #    print("MODULE",k,sys.modules[k])#dirname(sys.modules[k].__file__))
                            #elif inspect.isclass(v):
                            #    print("CLASS",k,v.__module__,dirname(sys.modules[v.__module__].__file__))#==dirname(sys.modules[self.__module__].__file__))
                            #elif inspect.ismethod(v):
                            #    print("METHOD",k,v.__module__,dirname(sys.modules[v.__module__].__file__))
                            #elif inspect.isfunction(v):
                            #    print("FUNCTION",k,v.__module__,dirname(sys.modules[v.__module__].__file__))
                            #elif inspect.isbuiltin(v):
                            #    print("BUILTIN",k)
                            #else:
                            #    print(type(v),k)

                            #print("DIRNAME")
                            if hasattr(v,'__module__'):
                                if hasattr(sys.modules[v.__module__],'__file__'):
                                    if dirname(sys.modules[v.__module__].__file__) not in [getcwd(),""]:
                                        #print(k)
                                        globals()[k] = v
                                    #print("\tDIRNAME",dirname(sys.modules[v.__module__].__file__))
                            elif k in sys.modules.keys():
                                if hasattr(sys.modules[k],'__file__'):
                                    if dirname(sys.modules[k].__file__) not in [getcwd(),""]:
                                        #print(k)
                                        globals()[k] = v
                                    #print("\tDIRNAME",dirname(sys.modules[k].__file__))
                        #    globals()[gi[0]]=gi[1]
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
    ml = MazeLogic(sys.argv[1],sys.argv[2])
    #ml.loadController("RandomRobotController.py")
    #ml.setController(RandomRobotController())
    try:
        ml.startController()
        print("END OF EXECUTION")
    except ResetException as re:
        print("RESET")
    ml.resetController()
    line=""
    while line != "stop\n":
        if line == "rerun\n":
            try:
                ml.startController()
                print("END OF EXECUTION")
            except ResetException as re:
                print("RESET")
            ml.resetController()
        line = sys.stdin.readline()
    #ml.robot.jsondump()