class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    var x = scene.cannon.x;
    var y = scene.cannon.y;

    super(scene, x, y, "bullet");
    scene.add.existing(this);

    this.play('bullet_anim');
    scene.physics.world.enableBody(this);
    scene.projectiles.add(this);
  }

  update() {
    if (this.y < 32) {
      this.destroy();
    }
  }
}