// type Props = {
//   canvasSize: { w: number; h: number };
//   controls
// };

/*
 *  Browser view mapping:
 *    top => y = 0
 *    left => x = 0
 *    bottom => 224
 *    right => 256
 *
 */

function coordsUtil(camera, player) {
  const cam = {
    x: camera ? camera.x : null,
    y: camera ? camera.y : null,
  };
  const pla = {
    x: player ? player.x : null,
    y: player ? player.y : null,
  };

  document.querySelector(
    "#player-coords"
  ).innerText = `Player: ${pla.x}, ${pla.y}`;
}

function WorldMap(canvasSize, controls) {
  const { width, height } = canvasSize;

  this.bg = background;
  this.ground = groundTile;
  this.vHeight = height;
  this.vWidth = width;
  this.context = document.querySelector("canvas").getContext("2d");
  this.player = new Player({
    canvasContext: this.context,
    startingWorldPos: { x: 96, y: WORLD_HEIGHT },
    controls,
    viewCoords: { x: 0, y: 0 }, // TODO: not used atm
    // TODO: subtracts magic value to keep player on ground until colliders are added
    worldBounds: { w: WORLD_LENGTH, h: WORLD_HEIGHT },
  });
  this.camera = new Camera({
    startingWorldPos: { x: 0, y: WORLD_HEIGHT },
    viewportSize: { w: this.vWidth, h: this.vHeight },
    worldBounds: { w: WORLD_LENGTH, h: WORLD_HEIGHT },
  });
  this.camera.follow(this.player, this.vWidth / 2, this.vHeight / 2);
}

WorldMap.prototype.update = function () {
  this.player.update();
  this.camera.update();
  coordsUtil(this.camera, this.player);
};

WorldMap.prototype.draw = async function () {
  this.context.clearRect(0, 0, this.vWidth, this.vHeight);
  await drawCourse(
    this.context,
    this.bg,
    this.ground,
    this.camera.x,
    this.camera.y
  );
  await this.player.draw(this.camera.x, this.camera.y);
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

async function drawCourse(context, bg, ground, camX, camY) {
  return Promise.all([
    drawBackground(bg, context, camX, camY),
    drawGround(ground, context, camX, camY),
  ]);
}
