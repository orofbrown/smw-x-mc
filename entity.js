function EntityStateEnum() {
  return {
    Idle: 1,
  };
}

async function getIdHash(entityName) {
  let hexString;
  const timeStamp = new Date().getTime();
  if (crypto.subtle) {
    const uint8Arr = new TextEncoder().encode(entityName + timeStamp);
    const hashed = await crypto.subtle.digest('SHA-1', uint8Arr);
    const byteArray = Array.from(new Uint8Array(hashed));
    hexString = byteArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    const hash = crypto.createHash('sha1');
    hash.update(entityName + timeStamp);
    hexString = hash.digest('hex');
  }

  return hexString.slice(0, 8);
}

function Entity(coords, name, size) {
  this.id = getIdHash();
  this.name = name;
  this.x = coords.x;
  this.y = coords.y;
  this.w = size.w;
  this.h = size.h;
  this.intervalId = -1;

  this.collider = new BoundingBox(new Point(this.x, this.y), this.w);

  const frames = this.getSpriteFrames(EntityStateEnum.Idle);
  this.sprite = new Sprite(ITEMS, 175, frames);
}

Entity.prototype.draw = function (ctx, camX, camY) {
  ctx.save();

  this.collider = new BoundingBox(new Point(this.x, this.y), this.w);
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

Entity.prototype.getSpriteFrames = function () {};

Entity.prototype.update = function () {};
