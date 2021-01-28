function Item() {
  let x = 256,
    y = 182;

  const draw = () => {
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.save();

    // ctx.clearRect(0, 0, 224, 256);
    x -= 1;
    ctx.translate(x, y);
    ctx.drawImage(MUSHROOM, -6, -6);

    ctx.restore();

    // requestAnimationFrame(draw);
  };

  this.draw = draw;
}
