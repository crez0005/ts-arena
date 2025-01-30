import CanvasRenderer from './CanvasRenderer.js';
import Enemy from './Enemy.js';
import Mover from './Mover.js';
import Vector2 from './Vector2.js';

type Ray = {
  origin: Vector2,
  direction: Vector2
};

export default class Hero extends Mover {
  private movingDown: boolean;

  private movingUp: boolean;

  private movingLeft: boolean;

  private movingRight: boolean;

  // shooting
  private shotInterval: number;

  private timeToNextShot: number;

  private hitDepth: number;

  private raysFired: Ray[];

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
    // shooting
    this.shotInterval = 150; // ms
    this.timeToNextShot = 0;
    this.hitDepth = 1;
    this.raysFired = [];

    this.center();
  }

  private center(): void {
    // absolute center
    this.pos = this.boundary.divide(2);
    const imageOffset: Vector2 = new Vector2(this.getWidth(), this.getHeight()).divide(2);
    // relative center
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

  private onHit(target: Enemy, direction: Vector2): void {
    //targets.splice(i, 1);
    target.isHit = true;
    target.addImpulse(direction.multiply(10));
    target.takeDamage(1);
  }

  /**
   * @param mousePos the mouse position where the hero aims at
   * @param targets the targets to test if they are aimed at
   * @returns combined score of targets hit
   */
  public shoot(mousePos: Vector2, targets: Enemy[]): number {
    // shoot only if the fire rate (shot interval) allows
    if (this.timeToNextShot < 0) {
      // reset fire rate timer
      this.timeToNextShot = this.shotInterval;
      const heroPos: Vector2 = this.getPosCentered();
      const mouseDirection: Vector2 = mousePos.subtract(heroPos);
      mouseDirection.normalize();
      const ray: Ray = {origin: heroPos, direction: mouseDirection};
      const hitTargets: Enemy[] = [];
      // clear our render rays each shot
      this.raysFired = [];
      this.raysFired.push({
        origin: heroPos,
        direction: mouseDirection.multiply(this.boundary.getMagnitude()).add(heroPos)
      });
      targets.forEach((target: Enemy) => {
        if (target.rayIntersects(ray.origin, ray.direction)) {
          hitTargets.push(target);
        }
      });
      if (hitTargets.length > 0) {
        // if we hit something we replace our voidray
        this.raysFired = [];
      }
      // sort based on which enemy is closest to the player
      hitTargets.sort((a: Enemy, b: Enemy) =>
        a.getPos().subtract(heroPos).getMagnitude()
        - b.getPos().subtract(heroPos).getMagnitude()
      );
      // Keep only the closest hitDepth enemies
      hitTargets.splice(this.hitDepth);
      let combinedScore: number = 0;
      hitTargets.forEach((hitTarget: Enemy) => {
        // hit from closest
        this.onHit(hitTarget, mouseDirection);
        // only capture score on eliminate
        if (hitTarget.getHealth() <= 0) {
          combinedScore += hitTarget.getScore();
        }
        // store rays for rendering
        const dist: number = hitTarget.getPosCentered().subtract(heroPos).getMagnitude();
        const ray: Ray = {
          origin: heroPos,
          direction: mouseDirection.multiply(dist).add(heroPos)
        };
        this.raysFired.push(ray);
      });
      return combinedScore;
    } else {
      return 0;
    }
  }

  public update(dt: number): void {
    // countdown next shot timer
    this.timeToNextShot -= dt;
    if (this.timeToNextShot < this.shotInterval - 50) {
      this.raysFired = [];
    }

    this.velocity = new Vector2(0, 0);

    if (this.movingUp) {
      //this.pos.y -= this.speed * dt;
      this.velocity.y -= 1;
      this.movingUp = false;
    }
    if (this.movingDown) {
      //this.pos.y += this.speed * dt;
      this.velocity.y += 1;
      this.movingDown = false;
    }
    if (this.movingRight) {
      //this.pos.x += this.speed * dt;
      this.velocity.x += 1;
      this.movingRight = false;
    }
    if (this.movingLeft) {
      //this.pos.x -= this.speed * dt;
      this.velocity.x -= 1;
      this.movingLeft = false;
    }
    // prevent divide by zero
    if (this.velocity.x == 0 && this.velocity.y == 0) {
      this.velocity = new Vector2(0, 0);
    } else {
      // diagonal as fast as straight
      this.velocity.normalize();
    }
    this.velocity.multiplyBy(this.speed * dt);
    this.pos.addTo(this.velocity);

    this.boundaryCollision();
  }

  /**
   * Render the GameItem to the canvas
   *
   * @param canvas canvas to render the GameItem to
   */
  public override render(canvas: HTMLCanvasElement): void {
    super.render(canvas);
    // draw the rays per shots fired as lines
    this.raysFired.forEach((ray: Ray) => {
      CanvasRenderer.drawLine(canvas, ray.origin.x, ray.origin.y, ray.direction.x, ray.direction.y);
    });
  }
}
