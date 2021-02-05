function Sprite(img, interval, baseFrames) {
  return {
    direction: 1,
    frames: baseFrames || [{ x: 0, y: 0 }],
    frameIdx: 0,
    img,
    interval,
    state: 0,
  };
}
