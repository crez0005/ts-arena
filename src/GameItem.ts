import Vector2 from './Vector2.js';
import CanvasRenderer from './CanvasRenderer.js';

export default abstract class GameItem {
  protected image: HTMLImageElement;

  protected pos: Vector2;

  protected scale: Vector2;

  public constructor() {
    this.image = new Image();
    this.pos = new Vector2(0, 0);
    this.scale = new Vector2(3, 3);
  }

  public getPos(): Vector2 {
    return this.pos;
  }

  public getPosCentered(): Vector2 {
    // offset the position by half the width and height
    return this.pos.add(this.getDimensions().multiply(0.5));
  }

  /** deprecated, superceded by getDimensions() */
  public getWidth(): number {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    return this.image.width * this.scale.x;
  }

  /** deprecated, superceded by getDimensions() */
  public getHeight(): number {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    return this.image.height * this.scale.y;
  }

  public getDimensions(): Vector2 {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    return new Vector2(this.image.width, this.image.height).multiply(this.scale);
  }

  /**
 * @param canvas 
 * @param stat stat to display, like health or damage
 * @param color text color
 */
  protected displayStat(canvas: HTMLCanvasElement, stat: number, color: string = 'white'): void {
    const p: Vector2 = this.getPosCentered();
    // display health or damage
    CanvasRenderer.writeText(canvas,
      `${stat}`,
      p.x, p.y + this.image.height - 5, 'center', 'monospace', 60, color
    );
  }

  /**
   * Render the GameItem to the canvas
   *
   * @param canvas canvas to render the GameItem to
   */
  public render(canvas: HTMLCanvasElement): void {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    CanvasRenderer.drawImage(canvas,
      this.image,
      this.pos.x, this.pos.y,
      this.scale.x, this.scale.y,
      true
    );
  }
}
