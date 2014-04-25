public class RandomRobotController implements IRobotController {

    private IRobot robot;
    
    /** Creates new MyRobotController */
    public RandomRobotController() {
    }

    public void start() throws ResetException {
        // Pick a random direction to face and move forwards until the finish location is reached
        while(!robot.getLocation().equals(robot.getTargetLocation())) {
            int rand = (int)Math.round(Math.random()*3);
            switch (rand) {
                case 0: robot.face(IRobot.AHEAD);
                        break;
                case 1: robot.face(IRobot.LEFT);
                        break;
                case 2: robot.face(IRobot.BEHIND);
                        break;
                case 3: robot.face(IRobot.RIGHT);
            }
            robot.advance();
            try {
                robot.jsondump();
            } catch (ResetException re) {
                throw re;
            }
        }
    }
    
    public void reset() {
        robot.reset();
    }
    
    public void setRobot(IRobot robot) {
        this.robot = robot;
    }
    
    public String getDescription() {
        return "Random controller (pretty useless)";
    }
    
}
