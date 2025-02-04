import Projectile, { Ray } from './Projectile.js';
import Enemy from './Enemy.js';
import Vector2 from './Vector2.js';
import CanvasRenderer from './CanvasRenderer.js';

export default class Weapon {
  private damage: number;

  private shotInterval: number;

  private timeToNextShot: number;

  private hitDepth: number;

  private raysFired: Ray[];

  public constructor(damage: number = 1, shotInterval: number = 150, hitDepth: number = 1) {
    this.damage = damage;
    this.shotInterval = shotInterval;
    this.timeToNextShot = 0;
    this.hitDepth = hitDepth;
    this.raysFired = [];
  }

  public canShoot(): boolean {
    return this.timeToNextShot < 0;
  }

  public shoot(origin: Vector2, target: Vector2, targets: Enemy[]): number {
    if (!this.canShoot()) {
      return 0;
    }

    // Reset fire rate timer
    this.timeToNextShot = this.shotInterval;

    const direction: Vector2 = target.subtract(origin);
    direction.normalize();

    const projectile: Projectile = new Projectile(origin, direction, this.damage, this.hitDepth);
    
    // Clear previous rays
    this.raysFired = [];
    this.raysFired.push({
      origin,
      direction: direction.multiply(origin.getMagnitude()).add(origin)
    });

    const hitTargets: Enemy[] = projectile.calculateHits(targets);
    
    if (hitTargets.length > 0) {
      this.raysFired = [];
    }

    let combinedScore: number = 0;
    hitTargets.forEach((hitTarget: Enemy) => {
      this.onHit(hitTarget, direction);
      if (hitTarget.getHealth() <= 0) {
        combinedScore += hitTarget.getScore();
      }
      
      const dist: number = hitTarget.getPosCentered().subtract(origin).getMagnitude();
      this.raysFired.push({
        origin,
        direction: direction.multiply(dist).add(origin)
      });
    });

    return combinedScore;
  }

  private onHit(target: Enemy, direction: Vector2): void {
    target.isHit = true;
    target.addImpulse(direction.multiply(10));
    target.takeDamage(this.damage);
  }

  public update(dt: number): void {
    // countdown next shot timer
    this.timeToNextShot -= dt;

    if (this.timeToNextShot < this.shotInterval - 50) {
      this.raysFired = []; // remove beams after 50ms
    }
  }

  public render(canvas: HTMLCanvasElement): void {
    this.raysFired.forEach((ray: Ray) => {
      CanvasRenderer.drawLine(canvas, ray.origin.x, ray.origin.y, ray.direction.x, ray.direction.y, 'red');
    });
  }
}
