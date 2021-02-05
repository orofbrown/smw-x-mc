// function Collision(a, b) {
//   this.entityA = a;
//   this.entityB = b;
//   this.prevCollision = null;
//   this.nextCollision = null;
//   this.circleHitList = [];
//   this.center = [0, 0];
//   this.distance = 0;
//   this.priority = 0;
//   this.status = 'colliding' | 'not colliding' | 'needs processing';
// }

// Collision.prototype.detect = function (collA, collB) {
//   const { Response, testPolygonPolygon } = SAT;
//   const response = new Response();
//   const collided = testPolygonPolygon(collA, collB, response);
//   if (collided) {
//     // document.querySelector(
//     //   '#world-coords',
//     // ).innerText = `Collision: ${response.overlap}`;
//     console.log('collided');
//   }
// };

// Collision.prototype.setPrev = function (prev) {
//   this.prevCollision = prev;
// };

// Collision.prototype.setNext = function (next) {
//   this.nextCollision = next;
// };

// Collision.prototype.intersection = function (a, b) {};

// Collision.prototype.setPriority = function (p) {
//   this.priority = p;
// };

const Collision = {
  detect: function (collA, collB) {
    const { Response, testPolygonPolygon } = SAT;
    const response = new Response();

    const a = new SAT.Box(
      new SAT.Vector(collA.nwCorner.x, collA.nwCorner.y),
      collA.width,
      collA.width,
    ).toPolygon();

    const b = new SAT.Box(
      new SAT.Vector(collB.nwCorner.x, collB.nwCorner.y),
      collB.width,
      collB.width,
    ).toPolygon();

    const collided = testPolygonPolygon(a, b, response);
    if (collided) {
      return response;
    }

    return null;
  },
};

if (globalThis.process) {
  module.exports = { BoundingBox, Point, QuadTree };
}
