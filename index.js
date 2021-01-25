deltaTime = 0;

function Game() {
  let paused = false;
  let lastTime = 0;

  const onKeyDown = (ev, ctrl) => {
    if (ev.key === " " && ev.repeat) {
      ctrl.jumpPress = false;
      return;
    }

    ctrl.keyDown(ev.key);
  };

  const onKeyUp = (ev, ctrl) => {
    ctrl.keyUp(ev.key);
  };

  const gameLoop = async (runningTime) => {
    deltaTime = runningTime - lastTime;
    lastTime = runningTime;

    this.map.update();
    await this.map.draw();
    if (!paused) {
      requestAnimationFrame(gameLoop);
    }
  };

  const play = () => {
    requestAnimationFrame(gameLoop);
  };

  const pause = () => {
    if (!paused) {
      paused = true;
      document.querySelector("#pause-btn").innerText = "Play";
    } else {
      paused = false;
      document.querySelector("#pause-btn").innerText = "Pause";
      play();
    }
  };

  function startKeyListeners(ctrl) {
    document.addEventListener("keydown", (ev) => onKeyDown(ev, ctrl));
    document.addEventListener("keyup", (ev) => onKeyUp(ev, ctrl));
  }

  function stopKeyListeners() {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  }

  window.addEventListener("load", () => {
    const keyBindings = {
      left: "a",
      up: "w",
      right: "d",
      down: "s",
      jump: " ",
    };
    const controls = new Controls(keyBindings);
    startKeyListeners(controls);

    window.groundTile = document.images[0];
    window.background = document.images[1];
    window.mushroom = document.images[2];
    window.playerSprite = document.images[3];

    const canvasSize = { width: 256, height: 224 };
    this.map = new WorldMap(canvasSize, controls);
    document.querySelector("#pause-btn").addEventListener("click", pause);

    play();
  });

  window.addEventListener("unload", () => {
    stopKeyListeners();
    document.querySelector("#pause-btn").removeEventListener("click", pause);
  });

  return {
    startKeyListeners,
    stopKeyListeners,
  };
}
