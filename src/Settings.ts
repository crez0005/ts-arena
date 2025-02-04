export default class Settings {
  // TD: divide into mechanical diffi and intellectual diffi
  public difficulty: number = 3;

  public update(dt: number): void {
    // problem: each class has its own instance, so can't update difficulty globally
  }
}
