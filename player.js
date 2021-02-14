const H = 20;
const W = 20;
// Will only come out to int value if it's an round number
const HALF_HEIGHT = H / 2;
const HALF_WIDTH = W / 2;
const SPEED = 50;
const Y_PEAK = 50;

/*
** MoveState
  Idle:   0
  Walk:   1
  Run:    2
  Sprint: 3

** JumpState
  Grounded: 0
  Rising:   1
  Falling:  2

** PowerUpState
  None:    0,
  Super:   1
  Fire:    2
  Feather: 3

** Sprite State:
(Moving | Jumping | PowerUp)
  *  M | J | P   R
  *  0   0   0   0 - idle, grounded, none
  *  1   0   0   4 - walk, grounded, none
  *  0   1   0   2 - idle,  jumping, none
  *  1   1   0   6 - walk,  jumping, none
  *  0   0   1   1 - idle, grounded, supe
  *  1   0   1   5 - walk, grounded, supe
  *  0   1   1   3 - idle,  jumping, supe
  *  1   1   1   7 - walk,  jumping, supe  
*Since 2,3,6 and 7 are all the same sprite, will repurpose 6 for falling

*/

function Player(startingWorldPos, controls, worldBounds) {
  Entity.call(this, startingWorldPos, 'Player', { w: W, h: H });
  const { w, h } = worldBounds;

  // Rounding because float values make the sprite fuzzy
  this.FRAME_INC_X = Math.round(SPEED * STEP);
  this.FRAME_INC_Y = this.FRAME_INC_X * 0.5;
  this.MAX_JUMP_PRESS = 20;
  this.JUMP_FORCE = 4.5;
  this.GRAVITY_FORCE = 3;

  this.airborneState = {
    falling: false,
    gravityDecay: this.FRAME_INC_Y,
    jumpForce: this.JUMP_FORCE,
    jumpPressCount: 0,
    rising: false,
  };
  this.ctrl = controls;
  this.intervalId = -1;
  this.sprite = {
    direction: 1,
    frames: [{ x: 0, y: 0 }],
    frameIdx: 0,
    img: PLAYER_SPRITE,
    // TODO: add more states later
    state: 0,
  };
  this.worldLength = w;
  this.worldHeight = h;
  this.x = startingWorldPos.x;
  this.y = startingWorldPos.y;
  // TODO: remove after inhertance is done
  this.collider = new BoundingBox(
    this.id,
    new Point(this.x, this.y),
    Math.max(W, H),
  );

  this.isAtLeftEdge = () => this.x - HALF_WIDTH < 0;
  this.isAtRightEdge = () => this.x + HALF_WIDTH > this.worldLength;
  this.isOnGround = () => this.y + HALF_HEIGHT > this.worldHeight;
  this.isAtCeiling = () => this.y - HALF_HEIGHT < 0;
  this.isAtEdge = () => this.isAtLeftEdge() || this.isAtRightEdge();
  this.isAirborne = () =>
    this.airborneState.rising || this.airborneState.falling;

  this.shouldResetSpriteState = () =>
    (!(
      this.ctrl.leftPress ||
      this.ctrl.upPress ||
      this.ctrl.rightPress ||
      this.ctrl.downPress
    ) ||
      this.isAtEdge() ||
      (this.ctrl.leftPress && this.ctrl.rightPress)) &&
    !this.isAirborne();
}

Player.prototype = Object.create(Entity.prototype);
Object.defineProperty(Entity.prototype, 'constructor', {
  value: Player,
  enumerable: false,
  writable: true,
});

Player.prototype.animate = function () {
  this.intervalId = setInterval(() => {
    this.sprite.frameIdx =
      (this.sprite.frameIdx + 1) % this.sprite.frames.length;
  }, 100);
};

Player.prototype.draw = function (ctx, camX, camY) {
  document.querySelector(
    '#player-coords',
  ).innerText = `Player: ${this.x}, ${this.y}`;

  // Tying coords to camera coords prevents player from getting ahead of camera
  // Using width/height div by 2 keeps coords centered on sprite
  // Will also leave small space between player and world borders
  const newX = (this.x - HALF_WIDTH - camX) * this.sprite.direction;
  const newY = this.y - HALF_HEIGHT - camY;
  // TODO: remove after inhertance is done
  this.collider = new BoundingBox(
    this.id,
    new Point(this.x, this.y),
    Math.max(W, H),
  );

  const destWidth = W * this.sprite.direction;
  const frame = this.sprite.frames[this.sprite.frameIdx];

  ctx.save();

  ctx.scale(this.sprite.direction, 1);
  ctx.globalCompositeOperation = 'source-over'; // player over top of everything
  ctx.drawImage(
    this.sprite.img,
    frame.x,
    frame.y,
    W,
    H,
    newX,
    newY,
    destWidth,
    H,
  );

  ctx.restore();

  if (this.intervalId < 0 && this.sprite.frames.length > 1) {
    this.animate();
  } else if (this.intervalId >= 0 && this.sprite.frames.length === 1) {
    this.resetSprite();
  }
};

Player.prototype.getSpriteFrames = function getSpriteFrames(state) {
  let frames = [{ x: 0, y: 0 }];

  switch (state) {
    case 2: // idle, jump, small
    case 3: // same as 2 but Super
    case 7: // same as 3
      frames = [{ x: 0, y: 20 }];
      break;
    case 4: // walking, grounded, small
    case 5: // same as 4 but Super
      frames = [
        { x: 20, y: 0 },
        { x: 0, y: 0 },
      ];
      break;
    case 6: // fall
      frames = [{ x: 20, y: 20 }];
      break;
    case 1: // same as default  but Super
    default:
      break;
  }

  return frames;
};

Player.prototype.jump = function (animationState, jumpPress) {
  // Airborne State
  const DT = deltaTime * 2;
  var decayAmt = DT / 500;
  var nextState = animationState;

  if (this.airborneState.rising) {
    nextState = 0b010;
    this.airborneState.jumpPressCount += deltaTime / 500;

    if (jumpPress) {
      this.airborneState.jumpForce += 0.1;
      decayAmt = DT / 750;
    }

    this.y = Math.round(
      this.y - this.airborneState.gravityDecay * this.airborneState.jumpForce,
    );

    this.airborneState.gravityDecay -= decayAmt;

    if (this.airborneState.gravityDecay <= 0) {
      this.ctrl.jumpPress = false;
      this.airborneState.falling = true;
      this.airborneState.rising = false;
      this.airborneState.gravityDecay += decayAmt;
    }
  } else if (this.airborneState.falling) {
    this.airborneState.jumpForce = this.GRAVITY_FORCE;
    decayAmt = (deltaTime * 2) / 500;
    nextState = 0b110;
    this.y += Math.round(
      this.airborneState.gravityDecay * this.airborneState.jumpForce * 0.75,
    );
    this.airborneState.gravityDecay += decayAmt;
  }

  return nextState;
};

Player.prototype.keepInWorld = function () {
  // TODO: let player go off screen top
  if (this.isAtLeftEdge()) {
    this.x = HALF_WIDTH;
    this.resetSprite();
  }
  if (this.isAtRightEdge()) {
    this.x = this.worldLength - HALF_WIDTH;
    this.resetSprite();
  }
  if (this.isAtCeiling()) {
    // Ceiling bc y = 0 is at top of world
    this.y = HALF_HEIGHT;
  }
  if (this.isOnGround()) {
    // Ground bc y = 0 is at top of world
    this.y = this.worldHeight - HALF_HEIGHT;
    this.airborneState.falling = false;
    this.airborneState.jumpForce = this.JUMP_FORCE;
    this.airborneState.gravityDecay = this.FRAME_INC_Y;
    this.airborneState.jumpPressCount = 0;
  }
};

Player.prototype.resetSprite = function () {
  this.sprite.state = 0;
  this.sprite.frameIdx = 0;
  clearInterval(this.intervalId);
  this.intervalId = -1;

  return this.sprite.state;
};

Player.prototype.update = function () {
  const { leftPress, upPress, rightPress, downPress, jumpPress } = this.ctrl;

  // Sprite State
  let nextState = 0;
  if (leftPress) {
    nextState = 0b100;
    this.sprite.direction = -1;
    this.x -= this.FRAME_INC_X;
  }
  if (rightPress) {
    nextState = 0b100;
    this.sprite.direction = 1;
    this.x += this.FRAME_INC_X;
  }
  // TODO: eventually will be looking up sprite
  if (upPress) {
    nextState = 0b010;
    this.y -= this.FRAME_INC_X;
  }
  // TODO: eventually will be ducking sprite
  if (downPress) {
    nextState = 0b110;
  }
  if (jumpPress && !this.isAirborne()) {
    this.airborneState.rising = true;
  }
  if (this.shouldResetSpriteState()) {
    nextState = this.resetSprite();
  }

  nextState = this.jump(nextState, jumpPress);

  this.sprite.frameIdx =
    this.sprite.state !== nextState ? 0 : this.sprite.frameIdx;
  this.sprite.state = nextState;
  this.sprite.frames = this.getSpriteFrames(this.sprite.state);

  this.keepInWorld();
};
