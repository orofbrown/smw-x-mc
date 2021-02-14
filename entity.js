function EntityStateEnum() {
  return {
    Idle: 1,
  };
}

function Entity(coords, name, size) {
  // V8 crypto function is async and that's annoying here
  this.id = Math.round(Math.random() * 10 ** 8);
  this.name = name;
  this.x = coords.x;
  this.y = coords.y;
  this.w = size.w;
  this.h = size.h;
  this.intervalId = -1;

  this.collider = new BoundingBox(this.id, new Point(this.x, this.y), this.w);

  const frames = this.getSpriteFrames(EntityStateEnum.Idle);
  this.sprite = new Sprite(ITEMS, 175, frames);
}

Entity.prototype.draw = function (ctx, camX, camY) {
  ctx.save();

  this.collider = new BoundingBox(this.id, new Point(this.x, this.y), this.w);
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

Entity.prototype.getSpriteFrames = function () {
  throw new Error('Entity.getSpriteFrames not implemented');
};

Entity.prototype.update = function () {
  throw new Error('Entity.update not implemented');
};
