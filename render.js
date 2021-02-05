function Renderer(vb, world, camera, player) {
  this.context = document.querySelector('canvas').getContext('2d');
  this.world = world;
  this.camera = camera;
  this.player = player;
  this.viewWidth = vb.w;
  this.viewHeight = vb.h;
  this.quadTree = new QuadTree(0, 0, 0, 256);
  this.entities = [];

  const _activeCollisions = []; // colliable entities in current view
  const _realCollisions = []; // known collisions
}

Renderer.prototype.setEntities = async function setEntitites(
  collidableEntities,
) {
  this.entities = await Promise.all(
    collidableEntities.map(async (e) => {
      // TODO: remove once all entities inherit from Entity class
      e.id = await getIdHash(e.name);
      e.collider.id = e.id;
      return e;
    }),
  );
  this.entities.push(this.player);
};

Renderer.prototype.draw = async function draw() {
  this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);
  this.world.draw(this.context, this.camera);
  this.entities.forEach((e) =>
    e.draw(this.context, this.camera.x, this.camera.y),
  );
};

Renderer.prototype.update = function update() {
  this.player.update();
  this.camera.update();

  this.updateAllPairs();
  const potential = this.generateActiveCollisions();
  const checked = this.processActiveCollisions(potential);
  this.processRealCollisions(checked);
};

Renderer.prototype.updateAllPairs = function updateAllPairs() {
  this.quadTree.clear();
  this.entities.forEach((e) => this.quadTree.insert(e.collider));
};

Renderer.prototype.generateActiveCollisions = function generateActiveCollisions() {
  const hashSet = new Set();

  return this.entities.reduce((acc, curr) => {
    const res = this.quadTree.get(curr.collider);
    const key = res.map((e) => e.id).join('');

    if (!hashSet.has(key)) {
      acc.push(...res);
      hashSet.add(key);
    }

    return acc;
  }, []);
};

Renderer.prototype.processActiveCollisions = function processActiveCollisions(
  potential,
) {
  const result = [];
  for (let i = 0; i < potential.length; ++i) {
    const next = (i + 1) % potential.length;
    const c = Collision.detect(potential[i], potential[next]);
    if (c) {
      result.push(c);
    }
  }
  return result;
};

Renderer.prototype.processRealCollisions = function processRealCollisions(
  checked,
) {
  // console.log(checked);
};
