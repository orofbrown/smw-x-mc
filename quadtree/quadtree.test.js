const { BoundingBox, Point, QuadTree } = require('./quadtree');
const Collision = require('../collision');
const SAT = require('../lib/SAT');

describe('quadtree', () => {
  const entities = [
    { collider: new BoundingBox(new Point(96, 432), 20) },
    { collider: new BoundingBox(new Point(196, 336), 16) },
    { collider: new BoundingBox(new Point(128, 336), 21) },
    { collider: new BoundingBox(new Point(232, 336), 17) },
    { collider: new BoundingBox(new Point(64, 336), 22) },
    { collider: new BoundingBox(new Point(256, 336), 18) },
  ];
  let tree;

  beforeEach(() => {
    tree = new QuadTree(0, 0, 0, 256);
  });

  afterEach(() => {
    // tree.printNodes();
  });

  it('should have no children if there are only 4 objects in the node', () => {
    tree.clear();
    entities.slice(0, 4).forEach((e) => tree.insert(e.collider));
    expect(tree.root.children.length).toEqual(0);
  });

  it('should have 4 children if there are more than 4 objects in the node', () => {
    tree.clear();
    entities.forEach((e) => tree.insert(e.collider));
    expect(tree.root.children.length).toEqual(4);
  });

  it('should find the index of the nodes previously inserted into the tree', () => {
    tree.clear();
    entities.forEach((e) => tree.insert(e.collider));
    const result = entities.map((e) => tree.getIndex(e.collider));
    console.log(result);
  });
});
