function Renderer(w, h, course, camera, player) {
  this.context = document.querySelector("canvas").getContext("2d");
  this.course = course;
  this.camera = camera;
  this.player = player;
  this.viewWidth = w;
  this.viewHeight = h;
}

Renderer.prototype.draw = async function () {
  this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);
  this.course.draw(this.context, this.camera);
  await this.player.draw(this.context, this.camera.x, this.camera.y);
};

Renderer.prototype.update = function () {
  this.player.update();
  this.camera.update();
  // coordsUtil(this.camera, this.player);
};
