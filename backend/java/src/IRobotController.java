public interface IRobotController {

   public void setRobot(IRobot robot);
   
   public void start() throws ResetException;
   
   public void reset();
   
   public String getDescription();
}
