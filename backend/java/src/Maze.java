import java.awt.Point;

public class Maze {
    int[][] maze;
    int height;
    int width;
    Point start;
    Point target;
    Point location;
    int heading;

    public Maze(int col, int row) {
        width = col;
        height = row;
        maze = new int[width][height];
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                maze[i][j] = IRobot.WALL;
            }
        }
        start = new Point(1,1);
        location = new Point(1,1);
        target = new Point(width - 2, height - 2);
        heading = IRobot.EAST;
    }
    public Maze(int[][] m) {
        maze = transpose(m);
        width = maze.length;
        height = maze[0].length;
        start = new Point(1,1);
        location = new Point(1,1);
        target = new Point(width - 2, height - 2);
        heading = IRobot.EAST;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int getTileType(int x, int y) {
        return maze[x][y];
    }
    public int getTileType(Point p) {
        return maze[p.x][p.y];
    }

    public void setTile(int tile, int x, int y) {
        maze[x][y] = tile;
    }
    public void setTile(int tile, Point p) {
        maze[p.x][p.y] = tile;
    }

    public Point getStart() {
        return start;
    }
    public void setStart(int x, int y) {
        start = new Point(x,y);
    }
    public void setStart(Point p) {
        start = p;
    }

    public Point getLocation() {
        return location;
    }
    public void setLocation(int x, int y) {
        location = new Point(x,y);
    }
    public void setLocation(Point p) {
        location = p;
    }

    public Point getFinish() {
        return target;
    }
    public void setFinish(int x, int y) {
        target = new Point(x,y);
    }
    public void setFinish(Point p) {
        target = p;
    }

    public int getHeading() {
        return heading;
    }
    public void setHeading(int newHeading) {
        if(newHeading < IRobot.NORTH || newHeading > IRobot.WEST) {
            throw new RuntimeException("The robot's heading can only be NORTH, SOUTH, EAST or WEST.");
        }
        heading = newHeading;
    }

    public void printMaze() {
        String result = "";
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                switch(maze[i][j]) {
                    case IRobot.WALL:
                        result += "X";
                        break;
                    case IRobot.PASSAGE:
                        result += "-";
                        break;
                    case IRobot.BEENBEFORE:
                        result += "=";
                        break;
                }
            }
            result += "\n";
        }
        result += "Start: "+start+"\n";
        result += "Target: "+target+"\n";
        result += "Location: "+location+"\n";
        result += "Heading: "+heading;
        System.out.println(result);
    }

    // transpose incoming 2D list representation of maze
    // if maze = 123  then '6' should be maze[2][1]
    //           456
    // coming in as [[1,2,3],  would make maze[x][y] refer to row x, col y rather
    //               [4,5,6]]  than col x, row y as intended
    // therefore transpose incoming to [[1,4],  so that maze[x][y] refers to
    //                                  [2,5],  col x and row y
    //                                  [3,6]]
    public int[][] transpose(int[][] arr) {
        int l = arr[0].length;
        int w = arr.length;
        int[][] newArr = new int[l][w];
        for (int i = 0; i < l; i++) {
            for (int j = 0; j < w; j++) {
                newArr[i][j] = arr[j][i];
            }
        }
        return newArr;
    }
}