import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { GameStateService } from '../../../shared/game-state.service';

type Phase = 'idle' | 'playing' | 'over';
type BallKind = 'feature' | 'bug';
type GameMode = 'select' | 'catch' | 'run';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  kind: BallKind;
}

interface Mirror {
  x: number;
  y: number;
  width: number;
  height: number;
}

type RunObstacleKind = 'ground' | 'flying';
type RunCharState = 'running' | 'jumping' | 'ducking';

interface RunObstacle {
  x: number;
  kind: RunObstacleKind;
}

const HIGH_SCORE_KEY = 'catch-game-high-score';
const PADDLE_HEIGHT = 16;
const START_FEATURES = 1;
const START_BUGS = 1;
const FEATURE_ADD_MIN_SEC = 10;
const FEATURE_ADD_MAX_SEC = 20;
const MIRROR_GAP_MIN_SEC = 3;
const MIRROR_GAP_MAX_SEC = 10;
// A dead-center paddle hit launches the ball at this fraction of a boost;
// hits near the edges land below 1 (slower), tapering linearly between them.
const PADDLE_CENTER_FACTOR = 1.1;
const PADDLE_EDGE_FACTOR = 0.8;

const RUN_HIGH_SCORE_KEY = 'dodge-run-high-score';
const RUN_JUMP_SEC = 0.5;
// A bit longer than the jump - ducking under a flying bug needs a wider
// window than jumping over a ground one, on both touch and keyboard, to
// feel fair rather than punishingly precise.
const RUN_DUCK_SEC = 0.8;
const RUN_SPAWN_GAP_START = 1.4;
const RUN_SPAWN_GAP_FLOOR = 0.65;
const RUN_SPEED_START = 0.28; // fraction of screen width per second
const RUN_SPEED_MAX = 0.6;
const RUN_CHAR_X_RATIO = 0.2; // runner sits toward the left, like the T-Rex

/**
 * Full-screen takeover, not a modal card - mounted once at the app root and
 * shown/hidden with `isOpen()` so "Play" drops the user straight into the game
 * on whatever page/scroll position they're already on, no new window or route.
 *
 * Gameplay: features are balls that bounce forever off the screen's edges and
 * the player's paddle (never "caught" or "missed", but falling past the
 * paddle ends the run). Bugs just fall straight down from the top like a
 * plain obstacle, looping back to the top once they pass the bottom - the
 * player steers the bouncing features clear of them, since a feature
 * touching a bug (or the paddle catching a bug) ends the run. More features
 * join in over time. A hit dead-center on the paddle gives a small lift;
 * hits toward the edges come back out a bit slower. A "mirror" (a plain
 * reflective stick) occasionally appears at a random spot and stays there -
 * untouched - until a feature bounces off it, reflecting straight back the
 * way it came at the same speed, like any other physical bounce.
 *
 * A second game, "Dodge Run", lives in the same overlay - the same idea as
 * the classic Chrome dinosaur game, themed around dodging bugs: a runner
 * sits fixed toward the left while ground bugs and flying bugs slide in
 * horizontally from the right. Space/Up jumps, Down ducks - collision is a
 * real hitbox overlap against the runner's current pose (its size and
 * position both change between standing, jumping, and ducking), not a
 * timing check, so only an actual touch ends the run.
 */
@Component({
  selector: 'app-game-overlay',
  standalone: true,
  imports: [NgIf],
  templateUrl: './game-overlay.component.html',
  styleUrl: './game-overlay.component.scss',
})
export class GameOverlayComponent implements AfterViewInit, OnDestroy {
  private readonly gameState = inject(GameStateService);
  readonly isOpen = this.gameState.isOpen;

  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  mode: GameMode = 'select';

  phase: Phase = 'idle';
  score = 0;
  highScore = 0;
  featureCount = START_FEATURES;

  runPhase: Phase = 'idle';
  runScore = 0;
  runHighScore = 0;

  /** Pixels the game area sits below the top of the viewport, so it starts
   *  right under the sticky nav instead of covering it. */
  navOffset = 0;

  private ctx?: CanvasRenderingContext2D;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private dpr = 1;

  /** The runner's head in Dodge Run - falls back to a plain filled square
   *  until it's loaded. Downsampled to `runnerFacePixelated` for a chunky
   *  pixel-art look instead of a smooth photo. */
  private readonly runnerFace = new Image();
  private runnerFaceReady = false;
  private runnerFacePixelated: HTMLCanvasElement | null = null;

  private paddleWidth = 120;
  private paddleX = 0;
  private balls: Ball[] = [];
  private elapsed = 0;
  private nextFeatureAt = FEATURE_ADD_MIN_SEC;
  private mirror: Mirror | null = null;
  private nextMirrorAt = MIRROR_GAP_MIN_SEC;

  private runElapsed = 0;
  private runObstacles: RunObstacle[] = [];
  private runNextSpawnAt = 0;
  private runSpawnGap = RUN_SPAWN_GAP_START;
  private runCharState: RunCharState = 'running';
  private runCharStateUntil = 0;
  /** Left/right offset from the runner's base position, moved with the
   *  arrow keys (or a touch drag) - lets the player fine-tune exactly when
   *  they cross an obstacle's path instead of only reacting at a fixed spot. */
  private runCharOffsetX = 0;
  private runDragActive = false;
  private runDragStartX = 0;
  private runDragStartOffsetX = 0;

  private lastFrameAt = 0;
  private rafId?: number;

  private readonly pressedKeys = new Set<string>();
  private pointerX: number | null = null;

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (!this.isOpen()) return;
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (this.mode === 'catch' || (this.mode === 'run' && this.runPhase === 'playing')) {
        event.preventDefault();
        this.pressedKeys.add(event.key);
      }
      return;
    }

    if (this.mode === 'run' && this.runPhase === 'playing') {
      if (event.key === ' ' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.triggerRunJump();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.triggerRunDuck();
      }
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
  };

  private readonly onResize = () => this.sizeCanvas();

  constructor() {
    this.runnerFace.onload = () => {
      this.runnerFacePixelated = this.buildPixelatedFace(this.runnerFace);
      this.runnerFaceReady = true;
      if (this.mode === 'run') this.renderRun();
    };
    this.runnerFace.src = 'assets/seaum.jpg';

    effect(() => {
      if (this.isOpen()) {
        this.highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0);
        this.runHighScore = Number(localStorage.getItem(RUN_HIGH_SCORE_KEY) ?? 0);
        this.mode = 'select';
        queueMicrotask(() => {
          this.sizeCanvas();
          this.render();
        });
      } else {
        this.stopLoop();
      }
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('resize', this.onResize);
    this.stopLoop();
  }

  close(): void {
    this.gameState.close();
  }

  selectGame(mode: 'catch' | 'run'): void {
    this.mode = mode;
    if (mode === 'catch') {
      this.phase = 'idle';
      this.drawIdleFrame();
    } else {
      this.runPhase = 'idle';
      this.drawRunIdleFrame();
    }
  }

  backToMenu(): void {
    this.stopLoop();
    this.mode = 'select';
    this.render();
  }

  onPointerMove(event: PointerEvent): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    this.pointerX = event.clientX - rect.left;

    // While a touch/mouse drag is held down in Dodge Run, shift the runner
    // left/right with it - the same fine-tuning the arrow keys give.
    if (this.mode === 'run' && this.runDragActive) {
      const delta = this.pointerX - this.runDragStartX;
      const maxOffset = this.runMaxOffsetX();
      this.runCharOffsetX = Math.max(-maxOffset, Math.min(maxOffset, this.runDragStartOffsetX + delta));
    }
  }

  /** Tapping anywhere on the canvas jumps - matching the classic Dino game's
   *  "tap to jump" - and holding the tap while dragging shifts the runner
   *  left/right, so touch play has full parity with the keyboard controls.
   *  Ducking has its own dedicated button below: splitting jump/duck by
   *  vertical tap position doesn't work on a real phone, where a thumb's
   *  natural resting tap lands low on the screen (the "duck" zone) even
   *  when the player means to jump. */
  onCanvasTap(event: PointerEvent): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (this.mode === 'run' && this.runPhase === 'playing') {
      this.triggerRunJump();
    }

    this.runDragActive = true;
    this.runDragStartX = event.clientX - rect.left;
    this.runDragStartOffsetX = this.runCharOffsetX;
  }

  onCanvasPointerUp(): void {
    this.runDragActive = false;
  }

  /** Explicit touch duck control - see the note on `onCanvasTap` for why
   *  ducking isn't inferred from tap position. */
  onDuckButton(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.mode !== 'run' || this.runPhase !== 'playing') return;
    this.triggerRunDuck();
  }

  /** Explicit touch jump control, alongside tapping the canvas - having
   *  both means the jump button works even where it visually overlaps the
   *  Left/Right/Duck buttons' safe zone. */
  onJumpButton(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.mode !== 'run' || this.runPhase !== 'playing') return;
    this.triggerRunJump();
  }

  /** Touch Left/Right buttons drive the same `pressedKeys` set the arrow
   *  keys do, so holding one down moves the runner exactly like holding
   *  the corresponding key - same speed, same clamping, one code path. */
  onRunMoveStart(key: 'ArrowLeft' | 'ArrowRight', event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.mode !== 'run' || this.runPhase !== 'playing') return;
    this.pressedKeys.add(key);
  }

  onRunMoveEnd(key: 'ArrowLeft' | 'ArrowRight'): void {
    this.pressedKeys.delete(key);
  }

  start(): void {
    this.score = 0;
    this.elapsed = 0;
    this.nextFeatureAt = this.randomFeatureInterval();
    this.featureCount = START_FEATURES;
    this.mirror = null;
    this.nextMirrorAt = this.randomMirrorGap();
    this.paddleX = this.width / 2 - this.paddleWidth / 2;
    this.balls = [
      ...Array.from({ length: START_FEATURES }, () => this.spawnBall('feature')),
      ...Array.from({ length: START_BUGS }, () => this.spawnBall('bug')),
    ];
    this.lastFrameAt = performance.now();
    this.phase = 'playing';
    this.stopLoop();
    this.rafId = requestAnimationFrame(this.loop);
  }

  startRun(): void {
    this.runScore = 0;
    this.runElapsed = 0;
    this.runObstacles = [];
    this.runSpawnGap = RUN_SPAWN_GAP_START;
    this.runNextSpawnAt = this.runSpawnGap;
    this.runCharState = 'running';
    this.runCharStateUntil = 0;
    this.runCharOffsetX = 0;
    this.runDragActive = false;
    this.lastFrameAt = performance.now();
    this.runPhase = 'playing';
    this.stopLoop();
    this.rafId = requestAnimationFrame(this.runLoop);
  }

  triggerRunJump(): void {
    this.runCharState = 'jumping';
    this.runCharStateUntil = this.runElapsed + RUN_JUMP_SEC;
  }

  triggerRunDuck(): void {
    this.runCharState = 'ducking';
    this.runCharStateUntil = this.runElapsed + RUN_DUCK_SEC;
  }

  private spawnBall(kind: BallKind): Ball {
    const radius = Math.max(14, Math.min(22, this.width * 0.014));

    if (kind === 'bug') {
      // Bugs are a plain falling obstacle, not a bouncing ball: straight down,
      // looping back to the top once they pass the bottom. A bit faster than
      // the features, to keep them a real threat to dodge.
      return {
        x: radius + Math.random() * (this.width - radius * 2),
        y: -radius,
        vx: 0,
        vy: this.height * (0.32 + Math.random() * 0.1),
        radius,
        kind,
      };
    }

    // Slower overall, and spread widely across the upper half of the screen
    // with varied speed/angle so multiple features don't all reach the
    // paddle at the same moment - the player gets to react to them one at a
    // time rather than juggling a simultaneous pile-up.
    const speed = this.height * (0.12 + Math.random() * 0.14);
    const angle = Math.PI / 6 + Math.random() * (Math.PI * (2 / 3)); // wide downward-ish spread
    const direction = Math.random() < 0.5 ? -1 : 1;
    return {
      x: radius + Math.random() * (this.width - radius * 2),
      y: radius + Math.random() * this.height * 0.55,
      vx: Math.cos(angle) * speed * direction,
      vy: Math.sin(angle) * speed,
      radius,
      kind,
    };
  }

  private sizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    this.navOffset = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight - this.navOffset;
    this.dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    canvas.width = this.width * this.dpr;
    canvas.height = this.height * this.dpr;

    this.ctx = canvas.getContext('2d') ?? undefined;
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Scale the paddle with screen width: wide enough to feel fair on a
    // phone, but not comically wide on an ultrawide monitor.
    this.paddleWidth = Math.max(90, Math.min(220, this.width * 0.14));
    this.paddleX = Math.min(this.paddleX, this.width - this.paddleWidth);
  }

  private readonly loop = (timestamp: number): void => {
    if (this.phase !== 'playing') return;

    const dt = Math.min((timestamp - this.lastFrameAt) / 1000, 0.05);
    this.lastFrameAt = timestamp;

    this.elapsed += dt;
    this.score = Math.floor(this.elapsed);

    this.updatePaddle(dt);
    this.maybeAddFeature();
    this.updateMirror();
    const shouldEnd = this.updateBalls(dt);
    this.resolveFeatureCollisions();
    if (shouldEnd || this.checkFeatureBugCollision()) {
      this.gameOver();
      return;
    }
    this.render();

    if (this.phase === 'playing') {
      this.rafId = requestAnimationFrame(this.loop);
    }
  };

  private readonly runLoop = (timestamp: number): void => {
    if (this.runPhase !== 'playing') return;

    const dt = Math.min((timestamp - this.lastFrameAt) / 1000, 0.05);
    this.lastFrameAt = timestamp;

    this.runElapsed += dt;
    this.runScore = Math.floor(this.runElapsed);

    if (this.runCharState !== 'running' && this.runElapsed >= this.runCharStateUntil) {
      this.runCharState = 'running';
    }

    this.updateRunCharX(dt);
    this.maybeSpawnRunObstacle();
    if (this.updateRunObstacles(dt)) {
      this.gameOverRun();
      return;
    }
    this.renderRun();

    if (this.runPhase === 'playing') {
      this.rafId = requestAnimationFrame(this.runLoop);
    }
  };

  /** Downsamples the face photo to a tiny grid, so blowing it back up with
   *  smoothing off gives a chunky pixel-art look instead of a smooth photo. */
  private buildPixelatedFace(source: HTMLImageElement): HTMLCanvasElement | null {
    const size = 14;
    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    if (!octx) return null;
    octx.imageSmoothingEnabled = true;
    octx.drawImage(source, 0, 0, size, size);
    return off;
  }

  private maybeSpawnRunObstacle(): void {
    if (this.runElapsed < this.runNextSpawnAt) return;

    const kind: RunObstacleKind = Math.random() < 0.55 ? 'ground' : 'flying';
    this.runObstacles.push({ x: this.width + 40, kind });

    const progress = Math.min(1, this.runElapsed / 60); // ramps over the first minute
    this.runSpawnGap = RUN_SPAWN_GAP_START - (RUN_SPAWN_GAP_START - RUN_SPAWN_GAP_FLOOR) * progress;
    this.runNextSpawnAt = this.runElapsed + this.runSpawnGap;
  }

  /** Base unit the runner and its hitbox scale with, tied to screen height. */
  private runUnit(): number {
    return Math.max(14, Math.min(24, this.height * 0.028));
  }

  /** The runner's current horizontal position: its base spot plus whatever
   *  the player has nudged it with the left/right arrow keys or a drag. */
  private runCharX(): number {
    return Math.max(60, this.width * RUN_CHAR_X_RATIO) + this.runCharOffsetX;
  }

  private runMaxOffsetX(): number {
    return this.width * 0.15;
  }

  private updateRunCharX(dt: number): void {
    const keySpeed = this.width * 0.7; // px/sec, scales with screen width
    if (this.pressedKeys.has('ArrowLeft')) this.runCharOffsetX -= keySpeed * dt;
    if (this.pressedKeys.has('ArrowRight')) this.runCharOffsetX += keySpeed * dt;

    const maxOffset = this.runMaxOffsetX();
    this.runCharOffsetX = Math.max(-maxOffset, Math.min(maxOffset, this.runCharOffsetX));
  }

  /** How far the runner's whole silhouette is currently lifted by a jump
   *  (0 when not jumping) - shared by collision and rendering so the hitbox
   *  never disagrees with what's on screen. */
  private runnerLiftY(): number {
    if (this.runCharState !== 'jumping') return 0;
    const jumpHeight = this.runUnit() * 2.6;
    const progress = 1 - Math.max(0, (this.runCharStateUntil - this.runElapsed) / RUN_JUMP_SEC);
    return -Math.sin(Math.min(1, Math.max(0, progress)) * Math.PI) * jumpHeight;
  }

  /** Advances the run game's obstacles and checks for a real physical
   *  overlap between an obstacle and the runner's current hitbox - not a
   *  timing window. The hitbox itself changes size and position with the
   *  runner's pose (tall while standing/jumping, short and low while
   *  ducking), so only an actual touch ends the run. */
  private updateRunObstacles(dt: number): boolean {
    const progress = Math.min(1, this.runElapsed / 60);
    const speed = this.width * (RUN_SPEED_START + (RUN_SPEED_MAX - RUN_SPEED_START) * progress);
    const charX = this.runCharX();
    const groundY = this.height - Math.max(60, this.height * 0.1);
    const u = this.runUnit();
    const headY = groundY - u * 3.2;
    const obstacleRadius = Math.max(16, Math.min(26, this.width * 0.018));

    const liftY = this.runnerLiftY();
    const isDucking = this.runCharState === 'ducking';
    const hitboxHeight = isDucking ? u * 1.8 : u * 5;
    const hitboxHalfWidth = u * 0.9;
    const hitboxBottom = groundY + liftY;
    const hitboxTop = hitboxBottom - hitboxHeight;
    const hitboxLeft = charX - hitboxHalfWidth;
    const hitboxRight = charX + hitboxHalfWidth;

    const remaining: RunObstacle[] = [];
    for (const obstacle of this.runObstacles) {
      obstacle.x -= speed * dt;
      const laneY = obstacle.kind === 'flying' ? headY : groundY;

      const closestX = Math.max(hitboxLeft, Math.min(obstacle.x, hitboxRight));
      const closestY = Math.max(hitboxTop, Math.min(laneY, hitboxBottom));
      const dist = Math.hypot(obstacle.x - closestX, laneY - closestY);
      if (dist <= obstacleRadius) {
        return true; // physically touched the runner
      }

      if (obstacle.x > -this.width * 0.1) {
        remaining.push(obstacle);
      }
    }
    this.runObstacles = remaining;
    return false;
  }

  private gameOverRun(): void {
    if (this.runPhase !== 'playing') return;
    this.runPhase = 'over';
    if (this.runScore > this.runHighScore) {
      this.runHighScore = this.runScore;
      localStorage.setItem(RUN_HIGH_SCORE_KEY, String(this.runHighScore));
    }
    this.renderRun();
  }

  private drawRunIdleFrame(): void {
    this.runObstacles = [];
    this.runCharState = 'running';
    this.runCharOffsetX = 0;
    this.renderRun();
  }

  private updatePaddle(dt: number): void {
    const keySpeed = this.width * 0.6; // px/sec, scales with screen width
    if (this.pressedKeys.has('ArrowLeft')) this.paddleX -= keySpeed * dt;
    if (this.pressedKeys.has('ArrowRight')) this.paddleX += keySpeed * dt;

    if (this.pointerX !== null) {
      const target = this.pointerX - this.paddleWidth / 2;
      this.paddleX += (target - this.paddleX) * Math.min(dt * 16, 1);
    }

    this.paddleX = Math.max(0, Math.min(this.width - this.paddleWidth, this.paddleX));
  }

  private maybeAddFeature(): void {
    if (this.elapsed < this.nextFeatureAt) return;
    this.nextFeatureAt += this.randomFeatureInterval();
    this.featureCount++;
    this.balls.push(this.spawnBall('feature'));
  }

  /** A fresh random 10-20s gap before the next feature joins - re-rolled
   *  every time, so the pacing never settles into a fixed rhythm. */
  private randomFeatureInterval(): number {
    return FEATURE_ADD_MIN_SEC + Math.random() * (FEATURE_ADD_MAX_SEC - FEATURE_ADD_MIN_SEC);
  }

  /** A fresh random 3-10s gap before the next mirror appears. */
  private randomMirrorGap(): number {
    return MIRROR_GAP_MIN_SEC + Math.random() * (MIRROR_GAP_MAX_SEC - MIRROR_GAP_MIN_SEC);
  }

  /** Spawns the mirror power-up every 3-10s. Once it appears it stays put -
   *  it never times out, only disappearing when a feature actually hits it. */
  private updateMirror(): void {
    if (this.mirror) return;
    if (this.elapsed < this.nextMirrorAt) return;

    const width = Math.max(70, Math.min(160, this.width * 0.12));
    const height = 8;
    const margin = 40;
    const minY = this.height * 0.15;
    const maxY = this.height * 0.6;
    this.mirror = {
      x: margin + Math.random() * Math.max(0, this.width - width - margin * 2),
      y: minY + Math.random() * (maxY - minY),
      width,
      height,
    };
  }

  /** Bounces a feature off the mirror stick if it's touching it right now,
   *  then consumes the mirror. A real physical bounce: whichever side it
   *  came from, it reflects straight back that way at the same speed - no
   *  forced direction, no extra boost. */
  private checkMirrorBounce(ball: Ball): void {
    const mirror = this.mirror;
    if (!mirror) return;

    const closestX = Math.max(mirror.x, Math.min(ball.x, mirror.x + mirror.width));
    const closestY = Math.max(mirror.y, Math.min(ball.y, mirror.y + mirror.height));
    const dist = Math.hypot(ball.x - closestX, ball.y - closestY);
    if (dist > ball.radius) return;

    const withinX = ball.x >= mirror.x && ball.x <= mirror.x + mirror.width;
    if (withinX) {
      // Hit the top or bottom face - reflect the vertical component only,
      // same as bouncing off a floor or ceiling.
      ball.vy = -ball.vy;
      ball.y = ball.y < mirror.y + mirror.height / 2
        ? mirror.y - ball.radius
        : mirror.y + mirror.height + ball.radius;
    } else {
      // Hit one of the stick's ends - reflect the horizontal component.
      ball.vx = -ball.vx;
      ball.x = ball.x < mirror.x
        ? mirror.x - ball.radius
        : mirror.x + mirror.width + ball.radius;
    }

    this.mirror = null;
    this.nextMirrorAt = this.elapsed + this.randomMirrorGap();
  }

  /** Advances physics for one frame. Returns true if the run should end -
   *  a feature fell past the paddle, or the paddle caught a bug. */
  private updateBalls(dt: number): boolean {
    const gravity = this.height * 0.55;
    const floorY = this.height - Math.max(48, this.height * 0.06);

    for (const ball of this.balls) {
      if (ball.kind === 'bug') {
        // Plain falling obstacle: straight down, loop back to the top once
        // it passes the bottom - no bouncing. Catching one with the paddle
        // ends the run, same as missing a feature.
        ball.y += ball.vy * dt;
        const onPaddle = ball.x >= this.paddleX - ball.radius && ball.x <= this.paddleX + this.paddleWidth + ball.radius;
        if (ball.y + ball.radius >= floorY && onPaddle) {
          return true; // bug caught by the paddle
        }
        if (ball.y - ball.radius > this.height) {
          ball.y = -ball.radius;
          ball.x = ball.radius + Math.random() * (this.width - ball.radius * 2);
        }
        continue;
      }

      ball.vy += gravity * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Side walls
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + ball.radius > this.width) {
        ball.x = this.width - ball.radius;
        ball.vx = -Math.abs(ball.vx);
      }

      // Ceiling
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
      }

      this.checkMirrorBounce(ball);

      // Floor: a feature only survives if the paddle is under it - otherwise
      // it's fallen and the run is over.
      if (ball.y + ball.radius > floorY && ball.vy > 0) {
        const onPaddle = ball.x >= this.paddleX - ball.radius && ball.x <= this.paddleX + this.paddleWidth + ball.radius;

        if (onPaddle) {
          ball.y = floorY - ball.radius;
          const hitOffset = (ball.x - (this.paddleX + this.paddleWidth / 2)) / (this.paddleWidth / 2);
          const speed = Math.hypot(ball.vx, ball.vy);
          // A dead-center hit gives a small lift; hits toward either edge
          // come back out slower instead of just "no bonus".
          const bounceFactor = PADDLE_CENTER_FACTOR - (PADDLE_CENTER_FACTOR - PADDLE_EDGE_FACTOR) * Math.abs(hitOffset);
          ball.vx = hitOffset * speed;
          ball.vy = -Math.abs(ball.vy) * bounceFactor;
        } else {
          return true; // feature fell past the paddle
        }
      }
    }

    return false;
  }

  /** Features that bump into each other bounce apart (equal-mass elastic
   *  collision) - this is just physics, never a loss condition. Only
   *  touching a bug, or falling past the paddle uncaught, ends the run. */
  private resolveFeatureCollisions(): void {
    const features = this.balls.filter(b => b.kind === 'feature');

    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        const a = features[i];
        const b = features[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        const minDist = a.radius + b.radius;
        if (dist === 0 || dist >= minDist) continue;

        const nx = dx / dist;
        const ny = dy / dist;

        // Push them apart so they don't keep overlapping frame after frame.
        const overlap = minDist - dist;
        a.x -= (nx * overlap) / 2;
        a.y -= (ny * overlap) / 2;
        b.x += (nx * overlap) / 2;
        b.y += (ny * overlap) / 2;

        // Equal-mass elastic collision: swap the velocity components along
        // the collision normal, leave the tangential components alone.
        const aNormal = a.vx * nx + a.vy * ny;
        const bNormal = b.vx * nx + b.vy * ny;
        const aTangentX = a.vx - aNormal * nx;
        const aTangentY = a.vy - aNormal * ny;
        const bTangentX = b.vx - bNormal * nx;
        const bTangentY = b.vy - bNormal * ny;

        a.vx = aTangentX + bNormal * nx;
        a.vy = aTangentY + bNormal * ny;
        b.vx = bTangentX + aNormal * nx;
        b.vy = bTangentY + aNormal * ny;
      }
    }
  }

  private checkFeatureBugCollision(): boolean {
    const features = this.balls.filter(b => b.kind === 'feature');
    const bugs = this.balls.filter(b => b.kind === 'bug');
    for (const feature of features) {
      for (const bug of bugs) {
        const dist = Math.hypot(feature.x - bug.x, feature.y - bug.y);
        if (dist <= feature.radius + bug.radius) {
          return true;
        }
      }
    }
    return false;
  }

  private gameOver(): void {
    if (this.phase !== 'playing') return;
    this.phase = 'over';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
    }
    this.render();
  }

  private stopLoop(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private drawIdleFrame(): void {
    this.paddleX = this.width / 2 - this.paddleWidth / 2;
    this.balls = [];
    this.mirror = null;
    this.render();
  }

  private themeColor(name: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  private render(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    // Fully transparent - the portfolio page stays clearly visible behind the
    // bouncing balls and paddle, this canvas only draws the game pieces.
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.mode !== 'catch') return;

    const accent = this.themeColor('--accent', '#2dd4bf');
    const accent2 = this.themeColor('--accent-2', '#7dd3fc');
    const danger = '#ef4444';

    const floorY = this.height - Math.max(48, this.height * 0.06);

    if (this.mirror) {
      this.drawMirror(ctx, this.mirror, accent2);
    }

    // Balls
    for (const ball of this.balls) {
      if (ball.kind === 'bug') {
        this.drawBug(ctx, ball, danger);
      } else {
        this.drawFeature(ctx, ball, accent);
      }
    }

    // Paddle
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(this.paddleX + radius, floorY);
    ctx.arcTo(this.paddleX + this.paddleWidth, floorY, this.paddleX + this.paddleWidth, floorY + PADDLE_HEIGHT, radius);
    ctx.arcTo(this.paddleX + this.paddleWidth, floorY + PADDLE_HEIGHT, this.paddleX, floorY + PADDLE_HEIGHT, radius);
    ctx.arcTo(this.paddleX, floorY + PADDLE_HEIGHT, this.paddleX, floorY, radius);
    ctx.arcTo(this.paddleX, floorY, this.paddleX + this.paddleWidth, floorY, radius);
    ctx.closePath();
    ctx.fillStyle = accent;
    ctx.fill();
  }

  /** Draws an actual little bug (oval body, head, antennae, three pairs of
   *  legs) instead of a plain marked circle, oriented to face the direction
   *  it's falling. */
  private drawBug(ctx: CanvasRenderingContext2D, ball: Ball, bodyColor: string): void {
    const r = ball.radius;
    const outline = '#7f1d1d';

    ctx.save();
    ctx.translate(ball.x, ball.y);

    ctx.strokeStyle = outline;
    ctx.lineWidth = Math.max(1.5, r * 0.12);
    ctx.lineCap = 'round';

    // Legs - three pairs along the body
    for (const t of [-0.45, 0, 0.45]) {
      const legY = t * r * 0.8;
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, legY);
      ctx.lineTo(-r * 1.25, legY - r * 0.25);
      ctx.moveTo(r * 0.45, legY);
      ctx.lineTo(r * 1.25, legY - r * 0.25);
      ctx.stroke();
    }

    // Antennae
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.85);
    ctx.lineTo(-r * 0.5, -r * 1.35);
    ctx.moveTo(r * 0.2, -r * 0.85);
    ctx.lineTo(r * 0.5, -r * 1.35);
    ctx.stroke();

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.15, r * 0.62, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body segment lines
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, -r * 0.05);
    ctx.lineTo(r * 0.55, -r * 0.05);
    ctx.moveTo(-r * 0.55, r * 0.35);
    ctx.lineTo(r * 0.55, r * 0.35);
    ctx.stroke();

    // Head
    ctx.fillStyle = outline;
    ctx.beginPath();
    ctx.arc(0, -r * 0.8, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /** Draws a feature as a genuine-looking glossy ball: solid base color,
   *  shaded toward the rim, with a specular highlight - not a flat disc. */
  private drawFeature(ctx: CanvasRenderingContext2D, ball: Ball, color: string): void {
    const r = ball.radius;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = r * 0.6;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.clip(); // keep the shading/highlight inside the ball's silhouette

    const shade = ctx.createRadialGradient(ball.x, ball.y, r * 0.2, ball.x, ball.y, r);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = shade;
    ctx.fillRect(ball.x - r, ball.y - r, r * 2, r * 2);

    const highlight = ctx.createRadialGradient(
      ball.x - r * 0.35, ball.y - r * 0.4, 0,
      ball.x - r * 0.35, ball.y - r * 0.4, r,
    );
    highlight.addColorStop(0, 'rgba(255,255,255,0.95)');
    highlight.addColorStop(0.35, 'rgba(255,255,255,0.25)');
    highlight.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = highlight;
    ctx.fillRect(ball.x - r, ball.y - r, r * 2, r * 2);

    ctx.restore();
  }

  /** Draws the mirror power-up as a plain reflective stick. */
  private drawMirror(ctx: CanvasRenderingContext2D, mirror: Mirror, color: string): void {
    const { x, y, width, height } = mirror;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = height * 1.2;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(1, height * 0.2);
    ctx.beginPath();
    ctx.moveTo(x + width * 0.1, y + height * 0.28);
    ctx.lineTo(x + width * 0.9, y + height * 0.28);
    ctx.stroke();

    ctx.restore();
  }

  private renderRun(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);
    if (this.mode !== 'run') return;

    const accent = this.themeColor('--accent', '#2dd4bf');
    const danger = '#ef4444';
    const border = this.themeColor('--border-strong', 'rgba(148,163,184,0.24)');

    const charX = this.runCharX();
    const groundY = this.height - Math.max(60, this.height * 0.1);
    const u = this.runUnit();
    const headY = groundY - u * 3.2;

    // Ground and head-height lanes, so it reads as two parallel tracks the
    // runner and the incoming obstacles both sit on.
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.moveTo(0, headY);
    ctx.lineTo(this.width, headY);
    ctx.stroke();

    const obstacleRadius = Math.max(16, Math.min(26, this.width * 0.018));
    for (const obstacle of this.runObstacles) {
      const laneY = obstacle.kind === 'flying' ? headY : groundY;
      this.drawBug(ctx, { x: obstacle.x, y: laneY, radius: obstacleRadius, vx: 0, vy: 0, kind: 'bug' }, danger);
    }

    this.drawRunner(ctx, charX, groundY, this.runCharState, this.runElapsed, accent);
  }

  /** Draws a chunky pixel-art-style runner (dark hair block, yellow shirt,
   *  blue pants, pixelated photo face) in one of three poses. */
  private drawRunner(ctx: CanvasRenderingContext2D, x: number, groundY: number, state: RunCharState, elapsed: number, color: string): void {
    const u = this.runUnit();
    const hairColor = '#2b1b12';
    const shirtColor = '#eab308';
    const pantsColor = '#1d4ed8';
    const headR = u * 0.55;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (state === 'ducking') {
      ctx.translate(x, groundY);
      const headCy = -u * 1.05;
      // A goofy squashed, sideways-peeking tilt while ducking.
      this.drawHairCap(ctx, 0, headCy, headR, hairColor, -0.4, 1.15, 0.85);
      this.drawRunnerHead(ctx, 0, headCy, headR, color, -0.4, 1.15, 0.85);
      ctx.fillStyle = shirtColor;
      ctx.beginPath();
      ctx.roundRect(-u * 0.9, -u * 0.65, u * 1.8, u * 0.6, u * 0.15);
      ctx.fill();
      ctx.restore();
      return;
    }

    const liftY = this.runnerLiftY();
    ctx.translate(x, groundY + liftY);

    // Legs (drawn first so the shirt overlaps their tops)
    const pantsTop = -u * 1.1;
    const legWidth = u * 0.5;
    const legHeight = u * 1.15;
    ctx.fillStyle = pantsColor;
    if (state === 'jumping') {
      ctx.beginPath();
      ctx.roundRect(-u * 0.62, pantsTop, legWidth, legHeight * 0.75, u * 0.1);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(u * 0.12, pantsTop, legWidth, legHeight * 0.75, u * 0.1);
      ctx.fill();
    } else {
      const legSwing = Math.sin(elapsed * 11) * u * 0.4;
      ctx.beginPath();
      ctx.roundRect(-u * 0.55 + legSwing, pantsTop, legWidth, legHeight, u * 0.1);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(u * 0.05 - legSwing, pantsTop, legWidth, legHeight, u * 0.1);
      ctx.fill();
    }

    // Torso (shirt)
    const torsoTop = -u * 2.85;
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.roundRect(-u * 0.8, torsoTop, u * 1.6, u * 1.9, u * 0.2);
    ctx.fill();

    // Arms (sleeves)
    const armSwing = state === 'jumping' ? -u * 0.5 : -Math.sin(elapsed * 11) * u * 0.6;
    ctx.fillStyle = shirtColor;
    ctx.save();
    ctx.translate(-u * 0.95, torsoTop + u * 0.15);
    ctx.rotate(armSwing * 0.02);
    ctx.beginPath();
    ctx.roundRect(-u * 0.22, 0, u * 0.42, u * 1.15, u * 0.15);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(u * 0.95, torsoTop + u * 0.15);
    ctx.rotate(-armSwing * 0.02);
    ctx.beginPath();
    ctx.roundRect(-u * 0.2, 0, u * 0.42, u * 1.15, u * 0.15);
    ctx.fill();
    ctx.restore();

    // Head + hair - a lively bobblehead wobble while running, and a cartoon
    // stretch/squash while airborne (tall and thin at the peak of a jump).
    const jumpHeight = u * 2.6;
    const liftRatio = Math.min(1, Math.abs(liftY) / jumpHeight);
    const headRotation = state === 'jumping' ? -0.2 : Math.sin(elapsed * 11) * 0.22;
    const headScaleY = state === 'jumping' ? 1 + liftRatio * 0.35 : 1;
    const headScaleX = state === 'jumping' ? 1 - liftRatio * 0.15 : 1;
    const headCy = torsoTop - headR * 0.9;
    this.drawHairCap(ctx, 0, headCy, headR, hairColor, headRotation, headScaleX, headScaleY);
    this.drawRunnerHead(ctx, 0, headCy, headR, color, headRotation, headScaleX, headScaleY);

    ctx.restore();
  }

  /** Draws a rounded dark cap overlapping the top of the head, like a
   *  simple block of hair. */
  private drawHairCap(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    headR: number,
    color: string,
    rotation: number,
    scaleX: number,
    scaleY: number,
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);
    ctx.fillStyle = color;
    const w = headR * 2.3;
    const h = headR * 1.3;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -headR - h * 0.55, w, h, headR * 0.5);
    ctx.fill();
    ctx.restore();
  }

  /** Draws the runner's head as the site's profile photo clipped to a
   *  circle, falling back to a plain filled circle until the image loads. */
  private drawRunnerHead(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    fallbackColor: string,
    rotation = 0,
    scaleX = 1,
    scaleY = 1,
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    if (this.runnerFaceReady && this.runnerFacePixelated) {
      const wasSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false; // keeps the downsampled face chunky, not blurred
      ctx.drawImage(this.runnerFacePixelated, -radius, -radius, radius * 2, radius * 2);
      ctx.imageSmoothingEnabled = wasSmoothing;

      ctx.strokeStyle = fallbackColor;
      ctx.lineWidth = Math.max(1.5, radius * 0.12) / Math.min(scaleX, scaleY);
      ctx.strokeRect(-radius, -radius, radius * 2, radius * 2);
    } else {
      ctx.fillStyle = fallbackColor;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    }

    ctx.restore();
  }
}
