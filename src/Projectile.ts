import Vector2 from './Vector2.js';
import Enemy from './Enemy.js';

export type Ray = {
  origin: Vector2;
  direction: Vector2;
};

export default class Projectile {
  private ray: Ray;

  private damage: number;

  private hitDepth: number;

  public constructor(origin: Vector2, direction: Vector2, damage: number, hitDepth: number) {
    this.ray = { origin, direction };
    this.damage = damage;
    this.hitDepth = hitDepth;
  }

  public getRay(): Ray {
    return this.ray;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getHitDepth(): number {
    return this.hitDepth;
  }

  public calculateHits(targets: Enemy[]): Enemy[] {
    const hitTargets: Enemy[] = targets.filter((target: Enemy) =>
      target.rayIntersects(this.ray.origin, this.ray.direction)
    );

    // sort based on which enemy is closest to the player
    hitTargets.sort((a: Enemy, b: Enemy) =>
      a.getPos().subtract(this.ray.origin).getMagnitude()
      - b.getPos().subtract(this.ray.origin).getMagnitude()
    );

    // Keep only the closest hitDepth enemies
    return hitTargets.slice(0, this.hitDepth);
  }
}