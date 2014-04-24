public class DumboControllerReset
{
    
    public void controlRobot(IRobot robot) {

        int randno;
        int direction;

        // Select a random number

        randno = (int) Math.round(Math.random()*3);

        // Convert this to a direction

        if (randno == 0)
            direction = IRobot.LEFT;
        else if (randno == 1)
            direction = IRobot.RIGHT;
        else if (randno == 2)
            direction = IRobot.BEHIND;
        else 
            direction = IRobot.AHEAD;
         
        robot.face(direction);  /* Face the robot in this direction */   

        robot.advance();        /* and move the robot */
    }

    public void reset() {
        System.out.println("Resetting the controller");
    }

}