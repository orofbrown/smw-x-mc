function Item() {
  let x = 256,
    y = 182;

  const draw = () => {
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.save();

    x -= 1;
    ctx.translate(x, y);
    ctx.drawImage(MUSHROOM, -6, -6);

    ctx.restore();
  };

  this.draw = draw;
}
