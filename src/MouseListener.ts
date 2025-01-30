/**
 * Helper class for managing the mouse
 *
 * @author Frans Blauw
 */

import Vector2 from './Vector2.js';

export default class MouseListener {
  public static readonly BUTTON_LEFT: number = 0;

  public static readonly BUTTON_MIDDLE: number = 1;

  public static readonly BUTTON_RIGHT: number = 2;

  private mouseCoordinates: Vector2 = new Vector2 (0, 0);

  private buttonDown: Record<number, boolean> = {};

  private buttonQueried: Record<number, boolean> = {};

  /**
   *
   * @param canvas the canvas element to which the relative coordinates should given
   * @param disableContextMenu true to disable the context (right click) menu. Default: false
   */
  public constructor(canvas: HTMLCanvasElement, disableContextMenu: boolean = false) {
    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      this.mouseCoordinates = new Vector2(ev.offsetX, ev.offsetY);
    });
    canvas.addEventListener('mousedown', (ev: MouseEvent) => {
      this.buttonDown[ev.button] = true;
    });
    canvas.addEventListener('mouseup', (ev: MouseEvent) => {
      this.buttonDown[ev.button] = false;
      this.buttonQueried[ev.button] = false;
    });
    if (disableContextMenu) {
      canvas.addEventListener('contextmenu', (ev: MouseEvent) => {
        ev.preventDefault();
      });
    }
  }

  /**
   * Checks whether a mouse button is currently down.
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button is currently down
   */
  public isButtonDown(buttonCode: number = 0): boolean {
    return this.buttonDown[buttonCode];
  }

  /**
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button was pressed
   */
  public buttonPressed(buttonCode: number = 0): boolean {
    if (this.buttonQueried[buttonCode] === true) {
      return false;
    }
    if (this.buttonDown[buttonCode] === true) {
      this.buttonQueried[buttonCode] = true;
      return true;
    }
    return false;
  }

  /**
   * Returns the current mouse coordinates in an object
   *
   * @returns MouseCoordinates object with current position of mouse
   */
  public getMousePosition(): Vector2 {
    return this.mouseCoordinates;
  }
}
