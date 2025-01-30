/** @author  BytewaveMLP */
export default class Vector2 {
  public x: number;

  public y: number;

  /**
   * Creates a new Vector2 instance
   *
   * @param {number} x The x component of the vector
   * @param {number} y The y component of the vector
   */
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Gets the magnitude of the current vector
   *
   * @returns {number} The vector's magnitude
   */
  public getMagnitude(): number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  /**
   * Converts the vector into a unit vector in the same direction
   *
   * @returns {void}
   */
  public normalize(): void {
    const magnitude: number = this.getMagnitude();
    if (this.x !== 0) {
      this.x /= magnitude;
    }
    if (this.y !== 0) {
      this.y /= magnitude;
    }
  }

  /**
   * Adds a vector to the current vector, returning the sum as a new vector
   *
   * @param {Vector2} v2 The vector to add
   * @returns {Vector2} The sum of the two vectors
   */
  public add(v2: Vector2): Vector2 {
    return new Vector2(this.x + v2.x, this.y + v2.y);
  }

  /**
   * Adds a vector to the current vector, modifying the current vector's components to represent
   * the difference
   *
   * @param {Vector2} v2 The vector to add
   * @returns {void}
   */
  public addTo(v2: Vector2): void {
    this.x += v2.x;
    this.y += v2.y;
  }

  /**
   * Subtracts a vector from the current vector, returning the difference as a new vector
   *
   * @param {Vector2} v2 The vector to subtract
   * @returns {Vector2} The difference of the two vectors
   */
  public subtract(v2: Vector2): Vector2 {
    return new Vector2(this.x - v2.x, this.y - v2.y);
  }

  /**
   * Subtracts a vector from the current vector,
   * modifying the current vector's components to represent
   * the difference
   *
   * @param {Vector2} v2 The vector to subtract
   * @returns {void}
   */
  public subtractFrom(v2: Vector2): void {
    this.x -= v2.x;
    this.y -= v2.y;
  }

  /**
   * Multiplies the vector by a scalar value, returning the product as a new vector
   *
   * @param {number} value The scalar or vector value to multiply the vector by
   * @returns {Vector2} The product of the vector and the scalar
   */
  // Function overload signatures
  public multiply(value: number): Vector2;
  public multiply(value: Vector2): Vector2;

  // Function implementation
  public multiply(arg: number | Vector2): Vector2 {
    if (typeof arg === 'number') {
      return new Vector2(this.x * arg, this.y * arg);
    } else {
      return new Vector2(this.x * arg.x, this.y * arg.y);
    }
  }

  /**
   * Multiplies the vector by a scalar value, modifying the current vector's components to represent
   * the product
   *
   * @param {number} scalar The scalar value to multiply the vector by
   * @returns {void}
   */
  public multiplyBy(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }

  /**
   * Divides the vector by a scalar value, returning the quotient as a new vector
   *
   * @param {number} scalar The scalar to divide the vector by
   * @returns {Vector2} The quotient of the vector and the scalar
   */
  public divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides the vector by a scalar value, modifying the current vector's components to represent
   * the quotient
   *
   * @param {number} scalar The scalar value to divide the vector by
   * @returns {void}
   */

	public divideBy(scalar: number): void {
		this.x /= scalar;
		this.y /= scalar;
	}

	/**
	 * Finds the dot product of this vector and another vector
	 *
	 * @param {Vector2} v2 The vector to find the dot product with
	 * @returns {number} The dot product of this and the given vector
	 * @memberof Vector2
	 */
	public dotProduct(v2: Vector2): number {
		return (this.x * v2.x) + (this.y * v2.y);
	}

  /**
	 * Finds the cross product of this vector and another vector
	 *
	 * While the cross product in 2D is not well-defined,
   * it can be calculated in terms of an imaginary z-axis
	 *
	 * @param {Vector2} v2 The vector to find the cross product with
	 * @returns {number} The cross product of the two vectors
	 * @memberof Vector2
	 */
	public crossProduct(v2: Vector2): number {
    return (this.x * v2.y) - (this.y * v2.x);
  }

	/**
	 * Copies the current vector to a new Vector2 object
	 *
	 * @returns {Vector2} An deep copy of the current vector
	 * @memberof Vector2
	 */
  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
