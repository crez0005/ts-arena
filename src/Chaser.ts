import CanvasRenderer from './CanvasRenderer.js';
import Enemy from './Enemy.js';
import Hero from './Hero.js';
import Mover from './Mover.js';
import Vector2 from './Vector2.js';

export default class Chaser extends Enemy {
  private target: Mover | null;

  public constructor(boundary: Vector2) {
    super(boundary);
    this.image = CanvasRenderer.loadNewImage('./assets/sprite_enem_faceless.png');
    this.speed = 0.1 * this.settings.difficulty; // px per ms
    this.health = 5;
    this.score = 1;

    this.speed /= this.calcHitsRequired();

    this.target = null;
  }

  public override onSense(target: Mover): void {
    this.target = target;
  }

  public override onHeroCollision(hero: Hero): void {
    hero.takeDamage(1);
    // teleport
    //this.setStartPos(hero.getPos());
  }

  public override update(dt: number): void {
    super.update(dt);
    const targetPos: Vector2| undefined = this.target?.getPos();
    if (typeof targetPos === 'undefined') {
      // do nothing if no target
      //console.log('no target');
      return;
    } else {
      //console.log('locked in');
      const targetDirection: Vector2 = targetPos.subtract(this.pos);
      targetDirection.normalize();
      // move towards target
      this.pos.addTo(targetDirection.multiply(this.speed * dt));
    }
  }
}
