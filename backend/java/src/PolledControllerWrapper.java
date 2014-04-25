import java.lang.reflect.Method;

public class PolledControllerWrapper implements IRobotController {
    IRobot robot;
    Object pollObj;
    Method controlRobot;
    Method reset;

    public PolledControllerWrapper(Object obj) {
        pollObj = obj;
        // Attempt to find a controlRobot method in the given Class
        try {
            controlRobot = obj.getClass().getMethod("controlRobot", new Class[] {IRobot.class});
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Attempt to find a reset method in the given Class
        try {
           reset = obj.getClass().getMethod("reset", (Class[]) null);
        } catch (Exception e) {
        }
    }

    public void start() throws ResetException {
        // Invoke the controlRobot method until the finish location is reached
        while(!robot.getLocation().equals(robot.getTargetLocation())) {
            try {
                controlRobot.invoke(pollObj, new Object[] {robot});
                robot.jsondump();
            } catch (ResetException re) {
                throw re; // If the controller is reset, propogate the ResetException upwards to be handled elsewhere
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void reset() {
        // If the controller has a reset function, call it before resetting normally
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