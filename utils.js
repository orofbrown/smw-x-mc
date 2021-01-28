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
    "#cam-coords"
  ).innerText = `Player: ${cam.x}, ${cam.y}`;
  document.querySelector(
    "#player-coords"
  ).innerText = `Player: ${pla.x}, ${pla.y}`;
}

function log(params) {
  console.log(params);
}

const within = (outer, inner) =>
  outer.left <= inner.left &&
  outer.top <= inner.top &&
  outer.right >= inner.right &&
  outer.bottom >= inner.bottom;
