const SPEED = 50;
const W = 20;
// Dividing 2 Ints SHOULD come out to another Int,
//  but rounding just in case I'm assuming incorrectly
const HALF_WIDTH = Math.round(W / 2);
const H = 20;
const HALF_HEIGHT = Math.round(H / 2);
const Y_PEAK = 50;

/*
00 to 11
const MoveState = {
  Idle: 0,
  Walk: 1,
  Run: 2,
  xSprint: 3,
}; (MSB)

00 to 10
const JumpState = {
  Grounded: 0,
  Jumping: 1,
  xFalling: 2,
};

00 to 11
const PowerUpState = {
  None: 0,
  Super: 1,
  xFire: 2,
  xFeather: 3,
}; (LSB)

  *  M | J | P   R
  *  0   0   0   0 - idle, grounded, none
  *  1   0   0   4 - walk, grounded, none
  *  0   1   0   2 - idle,  jumping, none
  *  1   1   0   6 - walk,  jumping, none
  *  0   0   1   1 - idle, grounded, supe
  *  1   0   1   5 - walk, grounded, supe
  *  0   1   1   3 - idle,  jumping, supe
  *  1   1   1   7 - walk,  jumping, supe
  
  Since 2,3,6 and 7 are all the same sprite, will repurpose 6 for falling
*/

function Player({
  canvasContext,
  startingWorldPos,
  controls,
  viewCoords,
  worldBounds,
}) {
  const { x: vx, y: vy } = viewCoords;
  const { w, h } = worldBounds;

  // Rounding because float values make the sprite fuzzy
  this.FRAME_INC = Math.round(SPEED * STEP);

  this.ctrl = controls;
  this.ctx = canvasContext;
  this.intervalId = -1;
  this.sprite = {
    direction: 1,
    frames: [{ x: 0, y: 0 }],
    frameIdx: 0,
    img: playerSprite,
    // TODO: add more states later
    state: 0,
  };
  this.worldLength = w;
  this.worldHeight = h;
  this.x = startingWorldPos.x;
  this.y = startingWorldPos.y;

  this.isAtLeftEdge = () => this.x - HALF_WIDTH < 0;
  this.isAtRightEdge = () => this.x + HALF_WIDTH > this.worldLength;
  this.isOnGround = () => this.y + HALF_HEIGHT > this.worldHeight;
  this.isAtCeiling = () => this.y - HALF_HEIGHT < 0;
  this.isAtEdge = () => this.isAtLeftEdge() || this.isAtRightEdge();
}

Player.prototype.update = function () {
  const { leftPress, upPress, rightPress, downPress } = this.ctrl;
  let nextState = 0;

  if (leftPress) {
    nextState = 0b100;
    this.sprite.direction = -1;
    this.x -= this.FRAME_INC;
  }
  if (rightPress) {
    nextState = 0b100;
    this.sprite.direction = 1;
    this.x += this.FRAME_INC;
  }
  // TODO: eventually will be looking up sprite
  if (upPress) {
    nextState = 0b010;
    this.y -= this.FRAME_INC;
  }
  // TODO: eventually will be ducking sprite
  if (downPress) {
    nextState = 0b110;
    this.y += this.FRAME_INC;
  }
  if (
    !(leftPress || upPress || rightPress || downPress) ||
    this.isAtEdge() ||
    (leftPress && rightPress)
  ) {
    nextState = this.resetSprite();
  }

  this.sprite.frameIdx =
    this.sprite.state !== nextState ? 0 : this.sprite.frameIdx;
  this.sprite.state = nextState;
  this.sprite.frames = getSpriteFrames(this.sprite.state);

  this.keepInWorld();
};

Player.prototype.draw = function (camX, camY) {
  // Tying coords to camera coords prevents player from getting ahead of camera
  // Using width/height div by 2 keeps coords centered on sprite
  // Will also leave small space between player and world borders
  const newX = (this.x - HALF_WIDTH - camX) * this.sprite.direction;
  const newY = this.y - HALF_HEIGHT;
  const destWidth = W * this.sprite.direction;
  const frame = this.sprite.frames[this.sprite.frameIdx];

  this.ctx.save();

  this.ctx.scale(this.sprite.direction, 1);
  this.ctx.globalCompositeOperation = "source-over"; // player over top of everything
  this.ctx.drawImage(
    this.sprite.img,
    frame.x,
    frame.y,
    W,
    H,
    newX,
    newY,
    destWidth,
    H
  );

  this.ctx.restore();

  if (this.intervalId < 0 && this.sprite.frames.length > 1) {
    this.animate();
  } else if (this.intervalId >= 0 && this.sprite.frames.length === 1) {
    this.resetSprite();
  }
};

Player.prototype.animate = function () {
  this.intervalId = setInterval(() => {
    this.sprite.frameIdx =
      (this.sprite.frameIdx + 1) % this.sprite.frames.length;
  }, 100);
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
  }
};

Player.prototype.resetSprite = function () {
  this.sprite.state = 0;
  this.sprite.frameIdx = 0;
  clearInterval(this.intervalId);
  this.intervalId = -1;

  return this.sprite.state;
};

function getSpriteFrames(bitMask) {
  let frames = [{ x: 0, y: 0 }];

  switch (bitMask) {
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
}
