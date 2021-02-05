function animateSprite(spriteObj) {
  return setInterval(() => {
    spriteObj.frameIdx = (spriteObj.frameIdx + 1) % spriteObj.frames.length;
  }, spriteObj.interval);
}

function drawSprite(
  ctx,
  spriteObj,
  newX,
  newY,
  drawWidth,
  drawHeight,
  intervalId,
) {
  const destWidth = drawWidth * spriteObj.direction;
  const frame = spriteObj.frames[spriteObj.frameIdx];
  ctx.save();

  ctx.scale(spriteObj.direction, 1);
  ctx.drawImage(
    spriteObj.img,
    frame.x,
    frame.y,
    drawWidth,
    drawHeight,
    newX,
    newY,
    destWidth,
    drawHeight,
  );

  ctx.restore();

  if (intervalId < 0 && spriteObj.frames.length > 1) {
    return animateSprite(spriteObj);
  } else if (intervalId >= 0 && spriteObj.frames.length === 1) {
    return resetSprite(spriteObj, intervalId);
  }

  return intervalId;
}

function resetSprite(spriteObj, intervalId) {
  spriteObj.state = 0;
  spriteObj.frameIdx = 0;
  clearInterval(intervalId);

  return intervald;
}
