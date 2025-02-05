import CanvasRenderer from './CanvasRenderer.js';
import Mover from './Mover.js';
import Settings from './Settings.js';
import Vector2 from './Vector2.js';

export default abstract class Enemy extends Mover {
  public isHit: boolean;

  protected maxHealth: number;

  protected score: number;

  public constructor(boundary: Vector2) {
    super(boundary);
    this.boundary = boundary;
    this.image = CanvasRenderer.loadNewImage('');
    this.scale = new Vector2(3, 3);
    this.isHit = false;
    this.maxHealth = 1;
    this.health = 1;
    this.score = 1;
    this.setStartPos();
  }

  /** set health to random tafelsom from 1x1 to 10x10 */
  protected randomHealth(): number {
    const randomTafel: number = Math.ceil(Math.random()*10) * Math.ceil(Math.random()*10);
    this.health = randomTafel;
    return randomTafel;
  }

  /** Find the largest divisor from 1-10 */
  public calcMinimumHitsRequired(): number {
    const damageOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let largestDivisor: number = 1;

    // Check each number from 9 down to 1
    for (let i: number = damageOptions.length - 1; i >= 0; i--) {
      if (this.health % damageOptions[i] === 0) {
        largestDivisor = damageOptions[i];
        break;
      }
    }

    return this.health / largestDivisor;
  }

  private generateRandomPointOnBorder(): Vector2 {
    // Choose a random side to spawn the object on
    const side: number = Math.floor(Math.random() * 4);
    const dimensions: Vector2 = this.getDimensions();
  
    // Generate a random position along the chosen side
    let x: number = 0;
    let y: number = 0;
    switch (side) {
      case 0: // Top
        x = Math.random() * this.boundary.x;
        y = -dimensions.y; // Spawn completely above the visible area
        break;
      case 1: // Right
        x = this.boundary.x; // Spawn completely to the right of visible area
        y = Math.random() * this.boundary.y;
        break;
      case 2: // Bottom
        x = Math.random() * this.boundary.x;
        y = this.boundary.y; // Spawn completely below visible area
        break;
      case 3: // Left
        x = -dimensions.x; // Spawn completely to the left of visible area
        y = Math.random() * this.boundary.y;
        break;
    }
  
    return new Vector2(x, y);
  }

  public setStartPos(heroPos: Vector2 = new Vector2(Infinity, Infinity)): void {
    const imageOffset: Vector2 = this.getDimensions().divide(2);
    let i: number = 0;
    let distanceToPlayer: number = 0;
    do {
      //this.pos = this.boundary.multiply( new Vector2(Math.random(), Math.random()) );
      this.pos = this.generateRandomPointOnBorder();
      distanceToPlayer =
        (this.pos.subtract(heroPos)).getMagnitude();

      i += 1;
      //console.log(i);
    } while (distanceToPlayer < 500 && i<10);

    // move from object center
    this.pos.subtractFrom(imageOffset);
  }

  public getScore(): number {
    return this.score;
  }

  /**
   * Function that knocks the enemy back
   * @param velocity 
   */
  public addImpulse(velocity: Vector2): void {
    this.pos.addTo(velocity.divide(Math.sqrt(this.score/3)));
  }

  public abstract onSense(target: Mover): void;

  public abstract onHeroCollision(item: Mover): void;

  /** only take damage if this.health is divisible by damage */
  public override takeDamage(damage: number): void {
    if (this.health % damage === 0) {
      this.health -= damage;
    }
  }

  /**
   * 
   * @param dt 
   */
  public update(dt: number): void {
    if (this.isOutOfBounds() && this.isHit) {
      this.isHit = false;
      // console.log('scheduled for detention');
      //this.health = 0;
      // teleport when shot out of bounds
      //this.setStartPos();
    }
  }

  public override render(canvas: HTMLCanvasElement): void {
    super.render(canvas);
    this.displayStat(canvas, this.health, 'white');
  }
}
