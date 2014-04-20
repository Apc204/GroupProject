import java.awt.Point;

public class Maze {
    int[][] maze;
    int height;
    int width;
    Point start;
    Point target;
    Point location;
    int heading;
    public static void main(String[] args) {
        //if( (new Point(1,2)).equals(new Point(1,2))) { System.out.println("equal"); } else { System.out.println("not"); }
        Maze m = new Maze(5,4);
        m.setTile(IRobot.PASSAGE,1,1);
        m.setTile(IRobot.PASSAGE,new Point(1,2));
        m.setTile(IRobot.BEENBEFORE,2,2);
        /*System.out.println(m.getHeading());
        System.out.println(m.getStart());
        System.out.println(m.getLocation());
        System.out.println(m.getFinish());
        System.out.println(m.maze.length);
        System.out.println(m.maze[0].length);*/
        m.printMaze();
    }
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