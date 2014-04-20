import java.awt.Point;
import java.io.*;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.MalformedURLException;
import java.lang.reflect.Method;

public class MazeLogic {
    private IRobotController controller;
    private RobotImpl robot;
    private Maze maze;

    public static void main(String[] args) {
        String prefix = "[" + args[2] + "]";
        MazeLogic ml = new MazeLogic(args[0],args[1],prefix);
        try {
            ml.startController();
            System.out.println(prefix + "END OF EXECUTION");
        } catch (ResetException re) {
        }
        ml.resetController();
        for (int a = 0; a < 5; a++) {
            String b = prefix + "[RANDOM]";
            for (int c = 1; c <= 1000; c++) {
                b += c;
            }
            System.out.println(b);
        }
        String line = "";
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        while(!(line.equals("stop"))) {
            if(line.equals("rerun")) {
                try {
                    ml.startController();
                    System.out.println(prefix + "END OF EXECUTION");
                } catch (ResetException re) {
                }
                ml.resetController();
                for (int a = 0; a < 5; a++) {
                    String b = prefix + "[RANDOM]";
                    for (int c = 1; c <= 1000; c++) {
                        b += c;
                    }
                    System.out.println(b);
                }
            }
            try {
                line = br.readLine();
            } catch (IOException ioe) {
                System.out.println(ioe.getMessage());
            }
        }
    }

    public MazeLogic(String jsonfile, String sourcefile, String prefix) {
        maze = loadMaze(jsonfile);
        robot = new RobotImpl(maze,prefix);
        //robot.jsondump();
        IRobotController r = loadController(sourcefile);
        //System.out.println(r.getDescription());
        setController(r);
    }

    public void startController() throws ResetException {
        controller.start();
    }

    public void setController(IRobotController irc) {
        controller = irc;
        controller.setRobot(robot);
    }

    public void resetController() {
        controller.reset();
    }

    public Maze loadMaze(String jsonfile) {
        Maze m = null;
        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(new FileReader(jsonfile));
            JSONObject jObj = (JSONObject) obj;

            JSONArray layout = (JSONArray)jObj.get("layout");
            int topListLength = layout.size();
            int subListLength = ((JSONArray)layout.get(0)).size();
            int[][] m1 = new int[topListLength][subListLength];
            for (int i = 0; i < topListLength; i++) {
                for (int j = 0; j < subListLength; j++) {
                    int val = ((Long)((JSONArray)layout.get(i)).get(j)).intValue();
                    m1[i][j] = val;
                    //System.out.print(m1[i][j]);
                }
                //System.out.println();
            }

            int heading = ((Long)jObj.get("robot_orientation")).intValue();
            
            int startX = ((Long)((JSONObject)jObj.get("start_pos")).get("x")).intValue();
            int startY = ((Long)((JSONObject)jObj.get("start_pos")).get("y")).intValue();
            Point start = new Point(startX,startY);
            
            int locationX = ((Long)((JSONObject)jObj.get("robot_pos")).get("x")).intValue();
            int locationY = ((Long)((JSONObject)jObj.get("robot_pos")).get("y")).intValue();
            Point location = new Point(locationX,locationY);
            
            int finishX = ((Long)((JSONObject)jObj.get("finish_pos")).get("x")).intValue();
            int finishY = ((Long)((JSONObject)jObj.get("finish_pos")).get("y")).intValue();
            Point finish = new Point(finishX,finishY);

            m = new Maze(m1);
            m.setStart(start);
            m.setLocation(location);
            m.setFinish(finish);
            m.setHeading(heading);
        } catch (ParseException pe) {
            pe.printStackTrace();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
        return m;
    }

    public IRobotController loadController(String sourcefile) {
        IRobotController irc = null;
        //System.out.println(sourcefile);
        File source = new File(sourcefile); 
        File file = source.getParentFile();
        //System.out.println(file);
        try {
            URL url = file.toURI().toURL();
            URL[] urls = new URL[]{url};

            ClassLoader cl = new URLClassLoader(urls);

            Class cls = cl.loadClass(source.getName());

            if(IRobotController.class.isAssignableFrom(cls)) {
                irc = (IRobotController)cls.newInstance();
            }
            else {
                Method control = null;
                control = cls.getMethod("controlRobot", new Class[] {IRobot.class});
                if (control != null) {
                    PolledControllerWrapper pcw = new PolledControllerWrapper(cls.newInstance());
                    irc = pcw;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

        return irc;
    }
}