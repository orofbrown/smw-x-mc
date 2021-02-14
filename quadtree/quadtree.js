/*
 *  Author: Mike Young
 *  Region QuadTree implemented in JavaScript using Arrays
 *  -> every INTERNAL node has exactly 4 children
 */

function Point(x, y) {
  // x: float
  // y: float
  this.x = x;
  this.y = y;
}

// Square, so only one dimension needed to measure size
function BoundingBox(entityId, nwCorner, w) {
  // entityId: number
  // nwCorner: Point
  // width: number
  this.id = entityId;
  this.nwCorner = nwCorner;
  this.width = w;
}
BoundingBox.prototype.getX = function () {
  return this.nwCorner.x;
};
BoundingBox.prototype.getY = function () {
  return this.nwCorner.y;
};
BoundingBox.prototype.containsPoint = function (point) {};
BoundingBox.prototype.intersects = function (boundingBox) {};

const NODE_CAPACITY = 4; // every internal node (non-leaf) must have exactly 4 children
const MAX_LEVELS = 5;

function Node(d) {
  // d: BoundingBox
  this.data = d;
  // Either 0 or 4 children => NW, NE, SW, SE
  this.children = [];
}

function QuadTree(lvl, x, y, width) {
  this.bounds = new BoundingBox(new Point(x, y), width);
  this.level = lvl;
  this.root = new Node([]);
  this.size = 0;
}

QuadTree.prototype.clear = function () {
  this.root.children.forEach((n) => n.clear());
  this.root = new Node([]);
};

QuadTree.prototype.split = function () {
  const subWidth = this.bounds.width / 2;
  const { x, y } = this.bounds.nwCorner;
  const lvl = this.level + 1;

  this.root.children.push(new QuadTree(lvl, x, y, subWidth));
  this.root.children.push(new QuadTree(lvl, x + subWidth, y, subWidth));
  this.root.children.push(new QuadTree(lvl, x, y + subWidth, subWidth));
  this.root.children.push(
    new QuadTree(lvl, x + subWidth, y + subWidth, subWidth),
  );
};

QuadTree.prototype.getIndex = function (box) {
  const topCenter = this.bounds.getX() + Math.round(this.bounds.width / 2),
    leftCenter = this.bounds.getY() + Math.round(this.bounds.width / 2);
  let idx = -1;

  const topHalf =
    box.getY() < leftCenter && box.getY() + box.width < leftCenter;
  const bottomHalf = box.getY() > leftCenter;
  const leftHalf = box.getX() < topCenter && box.getX() + box.width < topCenter;
  const rightHalf = box.getX() > topCenter;

  if (leftHalf) {
    if (topHalf) {
      idx = 1;
    } else if (bottomHalf) {
      idx = 2;
    }
  } else if (rightHalf) {
    if (topHalf) {
      idx = 0;
    } else if (bottomHalf) {
      idx = 3;
    }
  }

  return idx;
};

QuadTree.prototype.hasChildren = function () {
  return !!this.root.children[0];
};

QuadTree.prototype.insert = function (box) {
  if (this.hasChildren()) {
    let idx = this.getIndex(box);

    if (idx > -1) {
      // This entity's boundaries fit inside a child node
      this.root.children[idx].insert(box);
    }
  } else {
    // else, try to store entity in current tree
    this.root.data.push(box);

    // if this tree is full, try to split and move it to a child
    if (this.root.data.length > NODE_CAPACITY) {
      if (!this.hasChildren()) {
        this.split();
      }

      let i = 0;
      while (i < this.root.data.length) {
        let idx = this.getIndex(this.root.data[i]);
        if (idx > -1) {
          this.root.children[idx].insert(...this.root.data.splice(i, 1));
        } else {
          ++i;
        }
      }
    }
  }
};

QuadTree.prototype.get = function (box) {
  const result = [];
  const idx = this.getIndex(box);
  if (idx > -1 && this.root.children[0]) {
    const got = this.root.children[idx].get(box);
    result.push(...got);
  }

  return result.concat(this.root.data);
};

QuadTree.prototype.printNodes = function (isBaseLevel = true) {
  const { children, data } = this.root;

  const printData = () => {
    // data
    process.stdout.write(`data: [\n`);
    data.forEach((o) =>
      process.stdout.write(
        `    ${o.constructor.name} {
      nwCorner: ${o.nwCorner.constructor.name} { x: ${o.nwCorner.x}, y: ${o.nwCorner.y} },
      width: ${o.width}
    }\n`,
      ),
    );
    process.stdout.write(`  ],`);
  };

  const printChildren = () => {
    // children
    process.stdout.write(`children: [`);
    if (children.length) {
      process.stdout.write(`\n`);
      children.forEach((c) => {
        c.printNodes(false);
      });
    }
    process.stdout.write(`  ]\n`);
  };

  // root
  const spaces = ' '.repeat(isBaseLevel ? 0 : 4);
  process.stdout.write(`${spaces}${this.constructor.name} { `);
  if (isBaseLevel) process.stdout.write('\n  ');
  process.stdout.write(`node level: ${this.level}, `);
  if (isBaseLevel) process.stdout.write('\n  ');
  process.stdout.write(
    `bounds: { x: ${this.bounds.nwCorner.x}, y: ${this.bounds.nwCorner.y}, width: ${this.bounds.width} }, `,
  );
  if (isBaseLevel) {
    process.stdout.write('\n  ');
    printData();
  } else {
    process.stdout.write(`objects: ${this.root.data.length}, `);
  }
  if (isBaseLevel) {
    process.stdout.write('\n  ');
    printChildren();
    process.stdout.write('}\n\n');
  } else {
    process.stdout.write(`children: ${this.root.children.length}, \n`);
  }
};

QuadTree.prototype.printJson = function () {
  console.log(JSON.stringify(this, null, 2));
};

function main() {
  const sample = [1, 2, 3, 4, 5, 6, 7, 8].map(
    (i) => new BoundingBox(new Point(i * 16, i * 16), 16),
  );
  const t = new QuadTree(0, 0, 0, 256);

  sample.forEach((n) => t.insert(n));
  t.printNodes();
}

if (globalThis.process) {
  module.exports = { BoundingBox, Point, QuadTree };
}
