function Course(canvasSize) {
  const { width, height } = canvasSize;

  this.bg = BACKGROUND;
  this.ground = GROUND_TILE;
  this.vHeight = height;
  this.vWidth = width;
  this.context = document.querySelector("canvas").getContext("2d");
}

Course.prototype.draw = async function (ctx, camera) {
  return Promise.all([
    drawBackground(this.bg, ctx, camera.x, camera.y),
    drawGround(this.ground, ctx, camera.x, camera.y),
  ]);
};

async function drawBackground(img, context, vx, vy) {
  return new Promise((resolve, reject) => {
    context.save();
    context.globalCompositeOperation = "destination-over";
    for (let i = 0; i < 1; ++i) {
      // drawImage(src,
      //    sx, sy, sw, sh,
      //    dx, dy, dw, dh)
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        -vx + i * img.width,
        16 - vy,
        img.width,
        img.height
      );
    }

    context.restore();
    resolve();
  });
}

async function drawGround(img, context, vx, vy) {
  // TODO: shouldn't need promise with current setup
  return new Promise((resolve, reject) => {
    context.save();
    context.globalCompositeOperation = "source-over";
    for (let i = 0; i < 16; ++i) {
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        img.height * i - vx,
        400 - vy,
        img.height,
        img.height
      );
    }

    context.restore();
    resolve();
  });
}
