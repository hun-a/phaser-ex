class Bullet extends Phaser.GameObjects.Image {
  constructor(scene) {
    var x = scene.cannon.x;
    var y = scene.cannon.y;

    super(scene, x, y, "bullet");
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.projectiles.add(this);

    var toX = scene.man.x;
    var toY = scene.man.y;
    var radian = scene.getRadian({ x, y }, { x: toX, y: toY });
    var weight = { x: Math.cos(radian), y: Math.sin(radian) };
    this.body.velocity.x = weight.x * scene.bulletSpeed;
    this.body.velocity.y = weight.y * scene.bulletSpeed;
  }

  update() {
    if (this.y < 32) {
      this.destroy();
    }
  }
}