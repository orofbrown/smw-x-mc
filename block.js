const ItemState = {
  Full: 0,
  Empty: 1,
};

function Block(coords) {
  this.x = coords.x;
  this.y = coords.y;

  this.sprite = {
    frames: [{ x: 100, y: 40 }],
    frameIdx: 0,
    img: ITEMS,
    state: 0,
  };

  this.draw = (ctx) => {
    ctx.save();

    this.ctx.drawImage(this.sprite.img, frame.x, frame.y);

    ctx.restore();
  };
}

function getSpriteFrames(state) {
  return state === ItemState.Full
    ? [
        { x: 84, y: 26 },
        { x: 102, y: 26 },
        { x: 84, y: 46 },
        { x: 102, y: 46 },
      ]
    : [{ x: 82, y: 66 }];
}
