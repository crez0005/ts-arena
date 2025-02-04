import CanvasRenderer from './CanvasRenderer.js';
import Enemy from './Enemy.js';
import Mover from './Mover.js';
import Vector2 from './Vector2.js';
import Weapon from './Weapon.js';

export default class Hero extends Mover {
  private movingDown: boolean;
  
  private movingUp: boolean;

  private movingLeft: boolean;

  private movingRight: boolean;

  private weapon: Weapon;

  public constructor(boundary: Vector2) {
    super(boundary);
    this.boundary = boundary;
    this.image = CanvasRenderer.loadNewImage('./assets/sprite_hero.png');
    this.scale = new Vector2(3, 3);
    this.speed = 0.3; // px per ms
    this.velocity = new Vector2(0, 0);
    
    this.movingDown = false;
    this.movingUp = false;
    this.movingLeft = false;
    this.movingRight = false;
    
    this.weapon = new Weapon(450 / this.settings.difficulty);
    
    this.center();
  }

  private center(): void {
    this.pos = this.boundary.divide(2);
    const imageOffset: Vector2 = new Vector2(this.getWidth(), this.getHeight()).divide(2);
    this.pos.subtractFrom(imageOffset);
  }

  public moveUp(): void {
    this.movingUp = true;
  }
 
  public moveDown(): void {
    this.movingDown = true;
  }

  public moveRight(): void {
    this.movingRight = true;
  }

  public moveLeft(): void {
    this.movingLeft = true;
  }

  public shoot(mousePos: Vector2, targets: Enemy[]): number {
    return this.weapon.shoot(this.getPosCentered(), mousePos, targets);
  }

  public update(dt: number): void {
    this.weapon.update(dt);

    this.velocity = new Vector2(0, 0);

    if (this.movingUp) {
      this.velocity.y -= 1;
      this.movingUp = false;
    }
    if (this.movingDown) {
      this.velocity.y += 1;
      this.movingDown = false;
    }
    if (this.movingRight) {
      this.velocity.x += 1;
      this.movingRight = false;
    }
    if (this.movingLeft) {
      this.velocity.x -= 1;
      this.movingLeft = false;
    }

    // Prevent divide by zero and normalize diagonal movement
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.velocity.normalize();
      this.velocity.multiplyBy(this.speed * dt);
    }

    this.pos.addTo(this.velocity);
    this.boundaryCollision();
  }

  public override render(canvas: HTMLCanvasElement): void {
    super.render(canvas);
    this.weapon.render(canvas);
  }
}
