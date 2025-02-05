export default class Settings {
  // TD: divide into mechanical difficulty and intellectual difficulty
  public static difficulty: number = 1;
  
  public static gameSpeed: number = 2;

  public update(dt: number): void {
    // problem: each class has its own instance, so can't update difficulty globally
  }
}
