deltaTime = 0;

var Game = (function () {
  const canvasSize = { width: 256, height: 224 };
  var paused = false;
  var lastTime = 0;
  var camera = null;
  var controls = null;
  var map = null;
  var player = null;
  var renderer = null;

  function end() {
    stopKeyListeners();
  }

  async function gameLoop(runningTime) {
    deltaTime = runningTime - lastTime;
    lastTime = runningTime;

    renderer.update();
    await renderer.draw();

    if (!paused) {
      requestAnimationFrame(gameLoop);
    }
  }

  async function init(keyBindings) {
    world = new World(canvasSize, controls);
    controls = new Controls(keyBindings);
    player = new Player(
      { x: 96, y: WORLD_HEIGHT },
      controls,
      // TODO: subtracts magic value to keep player on ground until colliders are added
      { w: WORLD_LENGTH, h: WORLD_HEIGHT - 32 },
    );
    camera = new Camera({ x: 0, y: WORLD_HEIGHT }, canvasSize, {
      w: WORLD_LENGTH,
      h: WORLD_HEIGHT,
    });
    camera.follow(player, canvasSize.width / 2, canvasSize.height / 2);
    entities = [new Block({ x: 196, y: WORLD_HEIGHT - 96 })];

    renderer = new Renderer(
      {
        w: canvasSize.width,
        h: canvasSize.height,
      },
      world,
      camera,
      player,
      entities,
    );

    startKeyListeners(controls);
  }

  function onKeyDown(ev, ctrl) {
    if (ev.key === ' ' && ev.repeat) {
      ctrl.jumpPress = false;
      return;
    }

    ctrl.keyDown(ev.key);
  }

  function onKeyUp(ev, ctrl) {
    ctrl.keyUp(ev.key);
  }

  function pause() {
    if (!paused) {
      paused = true;
      document.querySelector('#pause-btn').innerText = 'Play';
    } else {
      paused = false;
      document.querySelector('#pause-btn').innerText = 'Pause';
      play();
    }
  }

  function play() {
    // TODO: is this right or just gameLoop?
    requestAnimationFrame(gameLoop);
  }

  function start() {
    document.querySelector('#pause-btn').addEventListener('click', pause);

    play();
  }

  function startKeyListeners(ctrl) {
    document.addEventListener('keydown', (ev) => onKeyDown(ev, ctrl));
    document.addEventListener('keyup', (ev) => onKeyUp(ev, ctrl));
  }

  function stopKeyListeners() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  window.GROUND_TILE = document.images[0];
  window.ITEMS = document.images[1];
  window.BACKGROUND = document.images[2];
  window.MUSHROOM = document.images[3];
  window.PLAYER_SPRITE = document.images[4];

  return {
    end,
    init,
    pause,
    play,
    start,
  };
})();
