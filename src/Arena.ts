/* TD
  pickups
*/

import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Hero from './Hero.js';
import Vector2 from './Vector2.js';
import Enemy from './Enemy.js';
import Chaser from './Chaser.js';
import MouseListener from './MouseListener.js';

export default class Arena extends Game {
  private canvas: HTMLCanvasElement;

  private canvasBoundary: Vector2;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private hero: Hero;

  private enemies: Enemy[];

  private score: number;

  private highScore: number;

  private isNewHighScore: boolean;

  private enemySpawnInterval: number; // ms

  private timeToNextEnemy: number;

  private maxEnemies: number;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvasBoundary = new Vector2(window.innerWidth, window.innerHeight);

    this.keyListener = new KeyListener;
    this.mouseListener = new MouseListener(canvas);
    this.hero = new Hero(this.canvasBoundary);
    this.score = 0;
    this.highScore = 0;
    this.isNewHighScore = false;

    this.enemySpawnInterval = 300;
    this.timeToNextEnemy = this.enemySpawnInterval;
    this.maxEnemies = 32;
    this.enemies = [];
    this.initializeEnemies();
  }

  /**
   * spawns the first enemies of a game
   */
  public initializeEnemies(): void {
    this.enemies = [];
    for (let i: number = 0; i < 7; i++) {
      this.spawnEnemy();
    }
  }

  /**
   * Spawns an enemy (at a random position) outside the canvas
   */
  public spawnEnemy(): void {
    if (this.enemies.length < this.maxEnemies) {
      const newChaser: Enemy = new Chaser(this.canvasBoundary);
      // only generate positions away from the player
      newChaser.setStartPos(this.hero.getPos());//(this.canvasBoundary.getMagnitude()/2));
      this.enemies.push(newChaser);
      //console.log(this.enemies.length);
    }
  }

  public isGameOver(): boolean {
    return (this.hero.getHealth() <= 0);
  }

  public respawnHero(): void {
    this.hero = new Hero(this.canvasBoundary);
  }

  private restartGame(): void {
    this.respawnHero();
    this.initializeEnemies();
    this.score = 0;
    this.isNewHighScore = false;
  }

  private handleHeroMovement(): void {
    if (this.keyListener.isKeyDown(KeyListener.KEY_UP)
      || this.keyListener.isKeyDown(KeyListener.KEY_W)) {
      this.hero.moveUp();
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_DOWN)
      || this.keyListener.isKeyDown(KeyListener.KEY_S)) {
      this.hero.moveDown();
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_RIGHT)
      || this.keyListener.isKeyDown(KeyListener.KEY_D)) {
      this.hero.moveRight();
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_LEFT)
      || this.keyListener.isKeyDown(KeyListener.KEY_A)) {
      this.hero.moveLeft();
    }
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    if (this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      if (this.isGameOver()) {
        this.restartGame();
      }
    }

    const mousePos: Vector2 = this.mouseListener.getMousePosition();
    // always shoot
    const enemyScore: number = this.hero.shoot(mousePos, this.enemies);
    this.score += enemyScore;
    //if (this.mouseListener.isButtonDown(MouseListener.BUTTON_LEFT)) {
    //  this.hero.shoot(mousePos, this.enemies);
    //}

    this.handleHeroMovement();
  }

  public update(dt: number): boolean {
    // calculate new highscore
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.isNewHighScore = true;
    }
    if (this.isGameOver()) {
      return true;
    }
    // countdown
    this.timeToNextEnemy -= dt;
    // if countdown up
    if (this.timeToNextEnemy < 0) {
      // spawn enemy
      this.spawnEnemy();
      // set countdown time back
      this.timeToNextEnemy = this.enemySpawnInterval;
    }
    this.hero.update(dt);
    // Loop through all the enemies and...
    this.enemies.forEach((enemy: Enemy, i: number) => {
      if (enemy.getHealth() <= 0) {
        this.enemies.splice(i, 1);
      }
      // update each enemy
      enemy.update(dt);
      // no condition, the enemy is all knowing for now
      enemy.onSense(this.hero);
      // ...check if they collide with the player
      if (this.hero.itemCollided(enemy)) {
        enemy.onHeroCollision(this.hero);
      }
      // loop through each enemy per enemy, might be inefficient
      this.enemies.forEach((otherEnemy: Enemy) => {
        enemy.collisionResponse(otherEnemy);
      });
    });
    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    // Start clean slate each frame
    CanvasRenderer.clearCanvas(this.canvas);
    this.hero.render(this.canvas);
    this.enemies.forEach((enemy: Enemy) => {
      enemy.render(this.canvas);
    });

    let gameOverText: string = 'GAME OVER';
    let gameOverColor: string = 'red';
    let scoreText: string = 'score';
    let scoreColor: string = 'white';
    if (this.isNewHighScore) {
      gameOverText = 'NEW HIGHSCORE!';
      gameOverColor = 'yellow';
      scoreText = 'highscore:';
      scoreColor = 'yellow';
    } else {
      gameOverText = 'GAME OVER';
      gameOverColor = 'red';
      scoreText = 'score:';
      scoreColor = 'white';
    }

    // score
    CanvasRenderer.writeText(this.canvas,
      `score: ${this.score}`,
      60, 60,
      'left', 'monospace', 40, gameOverColor
    );
    // highscore
    CanvasRenderer.writeText(this.canvas,
      `highscore: ${this.highScore}`,
      this.canvasBoundary.x - 60, 60,
      'right', 'monospace', 40, 'red'
    );

    // game over
    // add semi-transparent dark screen
    if (this.isGameOver()) {
      CanvasRenderer.fillRectangle(this.canvas,
        0, 0, this.canvasBoundary.x, this.canvasBoundary.y,
        'rgba(0,0,0,0.4)'
      );
      
      CanvasRenderer.writeText(this.canvas,
        gameOverText,
        this.canvasBoundary.x/2, this.canvasBoundary.y/2 - 120,
        'center', 'monospace', 120, gameOverColor
      );
      // score
      CanvasRenderer.writeText(this.canvas,
        scoreText,
        this.canvasBoundary.x/2, this.canvasBoundary.y/2 - 60,
        'center', 'monospace', 60, scoreColor
      );
      CanvasRenderer.writeText(this.canvas,
        `${this.score}`,
        this.canvasBoundary.x/2, this.canvasBoundary.y/2 + 60,
        'center', 'monospace', 120, scoreColor
      );
      // // high score
      // CanvasRenderer.writeText(this.canvas,
      //   'highscore:',
      //   this.canvasBoundary.x/2 + 180, this.canvasBoundary.y/2 - 60,
      //   'center', 'monospace', 60, 'white'
      // );
      // CanvasRenderer.writeText(this.canvas,
      //   `${this.highScore}`,
      //   this.canvasBoundary.x/2 + 180, this.canvasBoundary.y/2 + 60,
      //   'center', 'monospace', 120, 'white'
      // );
      CanvasRenderer.writeText(this.canvas,
        '(click to retry)',
        this.canvasBoundary.x/2, this.canvasBoundary.y/2 + 120,
        'center', 'monospace', 40, 'red'
      );
    }
  }
}
