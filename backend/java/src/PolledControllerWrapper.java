import java.lang.reflect.Method;

public class PolledControllerWrapper implements IRobotController {
    IRobot robot;
    Object pollObj;
    Method controlRobot;
    Method reset;

    public PolledControllerWrapper(Object obj) {
        pollObj = obj;
        try {
            controlRobot = obj.getClass().getMethod("controlRobot", new Class[] {IRobot.class});
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
           reset = obj.getClass().getMethod("reset", (Class[]) null);
        } catch (Exception e) {
           //e.printStackTrace();
        }
    }

    public void start() throws ResetException {
        while(!robot.getLocation().equals(robot.getTargetLocation())) {
            try {
                controlRobot.invoke(pollObj, new Object[] {robot});
                robot.jsondump();
            } catch (ResetException re) {
                throw re;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void reset() {
        if(reset != null){
            try {
                reset.invoke(pollObj, (Object[]) null);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        robot.reset();
    }

    public void setRobot(IRobot robot) {
        this.robot = robot;
    }

    public String getDescription() {
       String tag = "Polled Controller";
       if (reset != null)
          tag += " with reset()";
       else
          tag += " w/o reset()";

       return tag;
    }
}