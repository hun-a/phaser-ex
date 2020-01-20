class BigHead extends Phaser.Scene {
  constructor() {
    super('BigHead');
  }

  preload() {
    this.load.spritesheet(
      'man', 'assets/spritesheets/big_head.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  create() {
    this.anims.create({
      key: 'man_anim',
      frames: this.anims.generateFrameNumbers('man'),
      frameRate: 10,
      repeat: -1
    });

    this.man = this.add.sprite(config.width / 2, config.height / 2, 'man');
    this.man.play('man_anim');
    this.input.on('pointerdown', this.moveBighead, this);
  }

  moveBighead(pointer) {
    this.man.x = pointer.x;
    this.man.y = pointer.y;
  }
}