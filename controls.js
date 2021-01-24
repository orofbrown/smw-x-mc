function Controls(keys) {
  const { left, up, right, down, jump } = keys;

  this.leftPress = false;
  this.upPress = false;
  this.rightPress = false;
  this.downPress = false;
  this.jumpPress = false;

  this.keyDown = (key) => {
    switch (key) {
      case left:
        this.leftPress = true;
        break;
      case up:
        this.upPress = true;
        break;
      case right:
        this.rightPress = true;
        break;
      case down:
        this.downPress = true;
        break;
      case jump:
        this.jumpPress = true;
        break;
    }
  };

  this.keyUp = (key) => {
    switch (key) {
      case left:
        this.leftPress = false;
        break;
      case up:
        this.upPress = false;
        break;
      case right:
        this.rightPress = false;
        break;
      case down:
        this.downPress = false;
        break;
      case jump:
        this.jumpPress = false;
        break;
    }
  };
}
