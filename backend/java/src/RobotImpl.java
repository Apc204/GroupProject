import java.awt.Point;
import java.io.*;

public class RobotImpl implements IRobot {
    Maze maze;
    int height;
    int width;
    Point start;
    Point target;
    Point location;
    int heading;
    int steps;
    int collisions;
    int runs;
    String prefix;

    public RobotImpl(Maze m, String prefix) {
        this.prefix = prefix;
        setMaze(m);
        steps = 0;
        collisions = 0;
    }

    public void setMaze(Maze m) {
        maze = m;
        height = m.getHeight();
        width = m.getWidth();
        start = m.getStart();
        target = m.getFinish();
        location = m.getLocation();
        maze.setTile(IRobot.BEENBEFORE,start);
        heading = m.getHeading();
        runs = 0;
    }

    // Getter and Setter methods

    public int getLocationX() {
        return location.x;
    }
    public int getLocationY() {
        return location.y;
    }
    public Point getLocation() {
        return location;
    }

    public Point getTargetLocation() {
        return target;
    }
   
    public void setTargetLocation(int x, int y) {
        target = new Point(x,y);
    }
    public void setTargetLocation(Point p) {
        target = p;
    }

    public int getSteps() {
        return steps;
    }
    public int getCollisions() {
        return collisions;
    }
    public int getRuns() {
        return runs;
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

    // Inspect the adjecent tile in a given direction to find what type it is
    public int look(int dir) throws RuntimeException {
        if (dir < IRobot.AHEAD || dir > IRobot.LEFT) {
            throw new RuntimeException("The robot can only look AHEAD, BEHIND, LEFT and RIGHT.");
        }
      
        int newHeading = heading + dir;
        Point point = new Point();
        switch (newHeading % 4) {
            case 0:
                point = new Point(getLocationX(), getLocationY() - 1);
                break;
            case 1:
                point = new Point(getLocationX() + 1, getLocationY());
                break;
            case 2:
                point = new Point(getLocationX(), getLocationY() + 1);
                break;
            case 3:
                point = new Point(getLocationX() - 1, getLocationY());
                break;
        }
        int type = maze.getTileType(point);
        return type;
    }

    // Turn the robot to face a new direction
    public void face(int dir) throws RuntimeException {
        if (dir < IRobot.AHEAD || dir > IRobot.LEFT) {
            throw new RuntimeException("The robot can only face AHEAD, BEHIND, LEFT and RIGHT.");
        }
        switch (dir) {
            case IRobot.BEHIND:
                setHeading((heading + 2) % 4 + IRobot.NORTH);
                break;
            case IRobot.LEFT:
                setHeading((heading + 3) % 4 + IRobot.NORTH);
                break;
            case IRobot.RIGHT:
                setHeading((heading + 1) % 4 + IRobot.NORTH);
                break;
        }
    }
    
    // Attempt to move the robot forwards
    public void advance() throws RuntimeException {
        int x = location.x;
        int y = location.y;
        switch (getHeading()) {
            case IRobot.NORTH:
                y--;
                break;
            case IRobot.EAST:
                x++;
                break;
            case IRobot.SOUTH:
                y++;
                break;
            case IRobot.WEST:
                x--;
                break;
        }
         
        if (x<0 || y<0 || x>=maze.getWidth() || y>=maze.getHeight()) {
            throw new RuntimeException("Robot cannot advance off the edge of the maze!");
        }
         
        if (maze.getTileType(x, y) == IRobot.WALL) {
            collisions++;
        } else {
            steps++;
            location = new Point(x,y);
        }
        maze.setTile(IRobot.BEENBEFORE,location);
    }

    // Reset the robot and the maze to their original state
    public void reset() {
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (maze.getTileType(x,y) == IRobot.BEENBEFORE) {
                    maze.setTile(IRobot.PASSAGE,x,y);
                }
            }
        }
        location = start;
        heading = IRobot.EAST;
        maze.setTile(IRobot.BEENBEFORE,location);
        steps = 0;
        collisions = 0;
        runs++;
    }

    // Output JSON representing the current state of the robot and maze to stdout
    public void jsondump() throws ResetException {
        // Wait for instruction from the middleware
        String line = "";
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        while(!(line.equals("step") || line.equals("reset"))) {
            try {
                line = br.readLine();
            } catch (IOException ioe) {
                System.out.println(ioe.getMessage());
            }
        }
        
        String data = "";

        // If a reset instruction was received, reset the robot and maze and add a reset prefix to the return string
        if(line.equals("reset")) {
            data += "[RESET]";
            reset();
        }

        // maze is transposed when input, so transpose back for outputting
        int[][] m = maze.transpose(maze.maze);
        // Construct a string containing JSON representing the current state of the robot and maze
        String s = "";
        String mazeString = "[";
        for(int y = 0; y < maze.maze[0].length; y++) {
            mazeString += "[";
            for(int x = 0; x < maze.maze.length; x++) {
                mazeString += maze.maze[x][y];
                if (x == maze.maze.length - 1) {
                    s = "";
                } else {
                    s = ",";
                }
                mazeString += s;
            }
            if (y == maze.maze[0].length - 1) {
                s = "]";
            } else {
                s = ",";
            }
            mazeString += "]" + s;
        }
        data += "{ \"layout\":" + mazeString + ",";
        data += "\"start_pos\":{\"x\":" + start.x + ",\"y\":" + start.y + "},";
        data += "\"finish_pos\":{\"x\":" + target.x + ",\"y\":" + target.y + "},";
        data += "\"robot_pos\":{\"x\":" + location.x + ",\"y\":" + location.y + "},";
        data += "\"robot_orientation\":" + heading + ",";
        data += "\"steps\":" + steps + ",";
        data += "\"collisions\":" + collisions + ",";
        data += "\"goal_reached\":" + (location == getTargetLocation()) + ",";
        data += "\"runs\":" + runs + "}";
        // Print the string prepended with the prefix
        System.out.println(prefix + data);

        // If a reset instruction was received, adjust the number of runs to avoid increasing twice
        // then throw a ResetException to halt execution of the current run
        if(line.equals("reset")) {
            runs--;
            throw new ResetException("RESET");
        }
    }
}