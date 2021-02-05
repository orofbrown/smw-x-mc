const BLOCK_SIZE_PX = 16;
const BlockState = {
  Full: 0,
  Empty: 1,
};

function Block(coords) {
  this.name = 'Question Block';
  this.x = coords.x;
  this.y = coords.y;
  this.collider = new BoundingBox(new Point(this.x, this.y), BLOCK_SIZE_PX);

  const frames = getSpriteFrames(BlockState.Full);
  this.sprite = new Sprite(ITEMS, 175, frames);
  this.intervalId = -1;

  this.draw = (ctx, camX, camY) => {
    ctx.save();
    this.intervalId = drawSprite(
      ctx,
      this.sprite,
      this.x - camX,
      this.y - camY,
      BLOCK_SIZE_PX,
      BLOCK_SIZE_PX,
      this.intervalId,
    );
    ctx.restore();
  };

  function getSpriteFrames(state) {
    return state === BlockState.Full
      ? [
          { x: 84, y: 26 },
          { x: 103, y: 26 },
          { x: 84, y: 46 },
          { x: 103, y: 46 },
        ]
      : [{ x: 82, y: 66 }];
  }
}
