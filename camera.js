// type Props = {
//   startingWorldPos: {
//     x: number;
//     y: number;
//   };
//   viewportSize: BoundingRect;
//   worldBounds: BoundingRect;
// };
const Axis = {
  None: 1,
  Horizontal: 2,
  Vertical: 3,
  Both: 4,
};

function Camera({ startingWorldPos, viewportSize, worldBounds }) {
  const CAM_LEAD = 16;
  this.x = startingWorldPos.x;
  this.y = startingWorldPos.y;
  let { w: vw, h: vh } = viewportSize;
  let { w: ww, h: wh } = worldBounds;
  let xDeadZone = 0,
    yDeadZone = 0;
  let axis = Axis.Both;
  let followed = null;
  const cam = this;

  let cameraView = {
    left: cam.x,
    top: cam.y,
    width: vw,
    height: vh,
    right: cam.x + vw,
    bottom: cam.y + vh,
    set: function (left, top, width, height) {
      this.left = left;
      this.top = top;
      this.width = width || this.width;
      this.height = height || this.height;
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
    },
  };

  let worldRect = {
    left: 0,
    top: 0,
    width: ww,
    height: wh,
    right: ww,
    bottom: wh,
  };

  function calculateView(followedXorY, xOrYView, xOrYdeadZone, wOrHView) {
    if (followedXorY - xOrYView + xOrYdeadZone > wOrHView) {
      return followedXorY - wOrHView - xOrYdeadZone;
    } else if (followedXorY - xOrYdeadZone < xOrYView) {
      return followedXorY - xOrYdeadZone;
    }
    return followedXorY;
  }

  const keepInsideWorld = (worldRect, cameraView, viewHeight, viewWidth) => {
    if (!within(worldRect, cameraView)) {
      if (cameraView.left < worldRect.left) {
        this.x = worldRect.left;
      }
      if (cameraView.right > worldRect.right) {
        this.x = worldRect.right - viewWidth;
      }
      if (cameraView.top < worldRect.top) {
        this.y = worldRect.top;
      }
      if (cameraView.bottom > worldRect.bottom) {
        this.y = worldRect.bottom - viewHeight;
      }
      console.log("here", this.x, this.y);
    }
    document.querySelector("#cam-coords").innerText = `
    Camera VP: ${cameraView.left} ${cameraView.top} ${cameraView.right} ${cameraView.bottom}
    Camera XY: ${this.x} ${this.y}`;

    document.querySelector(
      "#world-coords"
    ).innerText = `World: ${worldRect.left} ${worldRect.top} ${worldRect.right} ${worldRect.bottom}`;
  };

  this.follow = (obj, xDZ, yDZ) => {
    followed = obj;
    xDeadZone = xDZ;
    yDeadZone = yDZ;
  };

  this.update = () => {
    if (followed !== null) {
      if (axis == Axis.Horizontal || axis == Axis.Both) {
        this.x = calculateView(followed.x, this.x, xDeadZone, worldRect.left);
      }
      if (axis == Axis.Vertical || axis == Axis.Both) {
        this.y = calculateView(followed.y, this.y, yDeadZone, worldRect.top);
      }

      cameraView.set(this.x, this.y);
      keepInsideWorld(worldRect, cameraView, vh, vw);
    }
  };
}
