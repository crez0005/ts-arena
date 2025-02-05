import Projectile, { Ray } from './Projectile.js';
import Enemy from './Enemy.js';
import Vector2 from './Vector2.js';
import CanvasRenderer from './CanvasRenderer.js';
import GameItem from './GameItem.js';
import Hero from './Hero.js';

export default class Weapon extends GameItem {
  private hero: Hero;

  private damage: number;

  private shotInterval: number;

  private timeToNextShot: number;

  private hitDepth: number;

  private raysFired: Ray[];

  private rotation: number;

  private armLength: number;

  private weaponLength: number;

  private visualRays: Ray[]; // For visual rays from weapon tip

  public constructor(hero: Hero, shotInterval: number = 150, damage: number = 1, hitDepth: number = 1) {
    super();
    this.damage = damage;
    this.shotInterval = shotInterval;
    this.timeToNextShot = 0;
    this.hitDepth = hitDepth;
    this.hero = hero;
    this.pos = this.hero.getPos();
    this.image = CanvasRenderer.loadNewImage('./assets/weapon_side.png');
    this.raysFired = []; // Actual gameplay rays (invisible)
    this.visualRays = []; // Visual rays from weapon tip
    this.rotation = 0;
    this.armLength = 20;
    this.weaponLength = 40;
  }

  public getDamage(): number {
    return this.damage;
  }

  private getWeaponTipPosition(): Vector2 {
    const heroCenter: Vector2 = this.hero.getPosCentered();
    const totalLength: number = this.armLength + this.weaponLength;
    const tipX: number = heroCenter.x + totalLength * Math.cos(this.rotation);
    const tipY: number = heroCenter.y + totalLength * Math.sin(this.rotation);
    return new Vector2(tipX, tipY);
  }

  private getWeaponBasePosition(): Vector2 {
    const heroCenter: Vector2 = this.hero.getPosCentered();
    const baseX: number = heroCenter.x + this.armLength * Math.cos(this.rotation);
    const baseY: number = heroCenter.y + this.armLength * Math.sin(this.rotation);
    return new Vector2(baseX, baseY);
  }

  public shoot(origin: Vector2, target: Vector2, targets: Enemy[]): number {
    if (!this.canShoot()) {
      return 0;
    }

    // Reset fire rate timer
    this.timeToNextShot = this.shotInterval;

    // Use hero center for actual gameplay calculations
    const heroCenter: Vector2 = this.hero.getPosCentered();
    const direction: Vector2 = target.subtract(heroCenter);
    direction.normalize();

    const projectile: Projectile = new Projectile(heroCenter, direction, this.damage, this.hitDepth);
    
    // Clear previous rays
    this.raysFired = [];
    this.visualRays = [];

    // Store the gameplay ray (invisible)
    this.raysFired.push({
      origin: heroCenter,
      direction: direction.multiply(heroCenter.getMagnitude()).add(heroCenter)
    });

    // Calculate and store the visual ray from weapon tip
    const weaponTip: Vector2 = this.getWeaponTipPosition();
    this.visualRays.push({
      origin: weaponTip,
      direction: direction.multiply(weaponTip.getMagnitude()).add(weaponTip)
    });

    const hitTargets: Enemy[] = projectile.calculateHits(targets);
    
    if (hitTargets.length > 0) {
      this.raysFired = [];
      this.visualRays = [];
    }

    let combinedScore: number = 0;
    hitTargets.forEach((hitTarget: Enemy) => {
      this.onHit(hitTarget, direction);
      if (hitTarget.getHealth() <= 0) {
        combinedScore += hitTarget.getScore();
      }
      
      // Calculate distances for both gameplay and visual rays
      const gameDist: number = hitTarget.getPosCentered().subtract(heroCenter).getMagnitude();
      const visualDist: number = hitTarget.getPosCentered().subtract(weaponTip).getMagnitude();
      
      // Store both rays (gameplay ray is invisible)
      this.raysFired.push({
        origin: heroCenter,
        direction: direction.multiply(gameDist).add(heroCenter)
      });
      
      this.visualRays.push({
        origin: weaponTip,
        direction: direction.multiply(visualDist).add(weaponTip)
      });
    });

    return combinedScore;
  }

  public update(dt: number): void {
    // Update rotation based on mouse position
    const mousePos: Vector2 = this.hero.getMousePosition();
    const heroCenter: Vector2 = this.hero.getPosCentered();
    this.rotation = Math.atan2(
      mousePos.y - heroCenter.y,
      mousePos.x - heroCenter.x
    );

    // Update weapon position to follow hero
    const basePos: Vector2 = this.getWeaponBasePosition();
    this.pos = basePos.subtract(new Vector2(this.image.width / 2, this.image.height / 2));

    // countdown next shot timer
    this.timeToNextShot -= dt;
    if (this.timeToNextShot < this.shotInterval - 50) {
      this.raysFired = [];
      this.visualRays = [];
    }
  }

  // probably put in canvasRenderer
  private renderRotatingWeapon(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    ctx?.save();
    
    const basePos: Vector2 = this.getWeaponBasePosition();
    ctx?.translate(basePos.x, basePos.y);
    ctx?.rotate(this.rotation);
    
    ctx?.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2,
      this.image.width * this.scale.x,
      this.image.height * this.scale.y,
    );
    
    ctx?.restore();
  }

  public override render(canvas: HTMLCanvasElement): void {
    // Draw only the visual rays from weapon tip
    this.visualRays.forEach((ray: Ray) => {
      CanvasRenderer.drawLine(canvas, ray.origin.x, ray.origin.y, ray.direction.x, ray.direction.y, 'red');
    });

    this.renderRotatingWeapon(canvas);
  }

  public canShoot(): boolean {
    return this.timeToNextShot < 0;
  }

  private onHit(target: Enemy, direction: Vector2): void {
    target.isHit = true;
    target.addImpulse(direction.multiply(10));
    target.takeDamage(this.damage);
  }
}
