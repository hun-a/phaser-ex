class BigHead extends Phaser.Scene {
  constructor() {
    super('BigHead');
    this.position = {
      x: config.width / 2,
      y: config.height / 2
    };
    this.speed = 1;
  }

  preload() {
    this.load.spritesheet(
      'man', 'assets/spritesheets/big_head.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  setPosition(pointer) {
    this.position.x = pointer.x;
    this.position.y = pointer.y;
  }

  create() {
    this.anims.create({
      key: 'man_anim',
      frames: this.anims.generateFrameNumbers('man'),
      frameRate: 10,
      repeat: -1
    });

    this.man = this.add.sprite(this.position.x, this.position.y, 'man');
    this.man.play('man_anim');
    this.input.on('pointerdown', this.setPosition, this);
  }

  getMovingWeight() {
    var angle = Math.atan2(this.position.y - this.man.y, this.position.x - this.man.x);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  moveTheMan() {
    var weight = this.getMovingWeight();
    this.man.x += (this.speed * weight.x);
    this.man.y += (this.speed * weight.y);
  }

  update() {
    this.moveTheMan();
  }
}