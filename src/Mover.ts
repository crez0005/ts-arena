import CanvasRenderer from './CanvasRenderer.js';
import GameItem from './GameItem.js';
import Vector2 from './Vector2.js';

export default abstract class Mover extends GameItem {
  protected boundary: Vector2;

  protected health: number;

  protected speed: number;

  protected velocity: Vector2;

  public constructor(boundary: Vector2) {
    super();
    this.boundary = boundary;
    this.health = 1;
    this.speed = 0.3; // px per ms
    this.velocity = new Vector2(0, 0);
  }

  public getHealth(): number {
    return this.health;
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
  }

  /**
 * Test whether the other item collides with this item
 *
 * @param item The scoreitem to test for
 * @returns true if the item has indeed collided.
 */
  public itemCollided(item: Mover): boolean {
    return (item.getPos().x + item.getWidth() > this.pos.x
      && item.getPos().x < this.pos.x + this.getWidth()
      && item.getPos().y + item.getHeight() > this.pos.y
      && item.getPos().y < this.pos.y + this.getHeight());
  }

  /**
   * @author Claude.ai
   * Handle collision response between two movers
   * Pushes the colliding items apart to prevent overlapping
   * 
   * @param item The mover that has collided with this one
   */
  public collisionResponse(item: Mover): void {
    // Calculate the center points of both objects
    const thisCenter: Vector2 = new Vector2(
      this.pos.x + this.getWidth() / 2,
      this.pos.y + this.getHeight() / 2
    );
    const itemCenter: Vector2 = new Vector2(
      item.getPos().x + item.getWidth() / 2,
      item.getPos().y + item.getHeight() / 2
    );

    // Calculate the direction vector between the centers
    const collisionNormal: Vector2 = thisCenter.subtract(itemCenter);
    const distance: number = collisionNormal.getMagnitude();

    // Calculate the minimum distance needed between centers to prevent overlap
    const minDistance: number = (this.getWidth() + item.getWidth()) / 2;

    // Only respond if objects are actually overlapping
    if (distance < minDistance) {
      collisionNormal.normalize();

      // Calculate the overlap amount
      const overlap: number = minDistance - distance;

      // Move both objects apart equally along the collision normal
      const pushVector: Vector2 = collisionNormal.multiply(overlap / 2);
      
      this.pos = this.pos.add(pushVector);
      item.pos = item.getPos().subtract(pushVector);
    }
  }

  /**@author Claude.ai */
  protected isOutOfBounds(): boolean {
    const offset: Vector2 = this.getDimensions().divide(2);
    return (this.pos.x + offset.x <= 0 
        || this.pos.x + offset.x >= this.boundary.x
        || this.pos.y + offset.y <= 0 
        || this.pos.y + offset.y >= this.boundary.y);
  }

  protected boundaryCollision(): void {
    const offset: Vector2 = this.getDimensions().divide(2);
    if (this.pos.x + offset.x <= 0) {
      this.pos.x = -offset.x;
    } else if (this.pos.x + offset.x >= this.boundary.x) {
      this.pos.x = this.boundary.x - offset.x;
    }
    if (this.pos.y + offset.y <= 0) {
      this.pos.y = -offset.y;
    } else if (this.pos.y + offset.y >= this.boundary.y) {
      this.pos.y = this.boundary.y - offset.y;
    }
  }

  /**
   * @author Claude.ai
   * Checks if a ray intersects with this mover's bounding box
   * 
   * @param rayOrigin Starting point of the ray
   * @param rayDir Direction of the ray (should be normalized)
   * @returns true if the ray intersects with this mover's bounds
   */
  public rayIntersects(rayOrigin: Vector2, rayDir: Vector2): boolean {
    // Calculate inverse direction
    const invDir: Vector2 = new Vector2(
      rayDir.x !== 0 ? 1 / rayDir.x : Infinity,
      rayDir.y !== 0 ? 1 / rayDir.y : Infinity
    );

    // Calculate intersection distances with X-axis aligned lines
    const xIntersectNear: number = (this.pos.x - rayOrigin.x) * invDir.x;
    const xIntersectFar: number = (this.pos.x + this.getWidth() - rayOrigin.x) * invDir.x;

    // Find closest and farthest intersection points for X-axis
    let nearestIntersect: number = Math.min(xIntersectNear, xIntersectFar);
    let farthestIntersect: number = Math.max(xIntersectNear, xIntersectFar);

    // Calculate intersection distances with Y-axis aligned lines
    const yIntersectNear: number = (this.pos.y - rayOrigin.y) * invDir.y;
    const yIntersectFar: number = (this.pos.y + this.getHeight() - rayOrigin.y) * invDir.y;

    // Update intersection points considering Y-axis
    nearestIntersect = Math.max(nearestIntersect, Math.min(yIntersectNear, yIntersectFar));
    farthestIntersect = Math.min(farthestIntersect, Math.max(yIntersectNear, yIntersectFar));

    // Only check intersections in front of the ray (positive direction)
    return farthestIntersect >= Math.max(0, nearestIntersect);
  }
}
