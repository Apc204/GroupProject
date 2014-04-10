#!usr/bin/python

class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return str((self.x, self.y))
    def __repr__(self):
        return str((self.x, self.y))
    def __eq__(self,p):
        return (self.x == p.x and self.y == p.y)
    def __ne__(self,p):
        return not(self.x == p.x and self.y == p.y)