export default class Settings {
  // TD: divide into mechanical difficulty and intellectual difficulty
  public difficulty: number = 3;

  public update(dt: number): void {
    // problem: each class has its own instance, so can't update difficulty globally
  }
}
