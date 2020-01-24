class BigHead extends Phaser.Scene {
  constructor() {
    super('BigHead');
    this.position = {
      x: config.width / 2,
      y: config.height / 2
    };
    this.speed = 1;
    this.life = 3;
  }

  preload() {
    this.load.spritesheet(
      'man', 'assets/spritesheets/big_head.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      'blue_potion', 'assets/spritesheets/blue_potion.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      'red_potion', 'assets/spritesheets/red_potion.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  setPosition(pointer) {
    this.position.x = pointer.x;
    this.position.y = pointer.y;
  }

  increaseMoving(man, potion) {
    this.speed = Math.min(this.speed + 1, 5);
    potion.disableBody(true, true);
    this.bluePotions.children.entries.pop();
  }

  heal(man, potion) {
    this.life = Math.min(this.life + 1, 3);
    potion.disableBody(true, true);
    this.redPotions.children.entries.pop();
  }

  create() {
    this.anims.create({
      key: 'man_anim',
      frames: this.anims.generateFrameNumbers('man'),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'blue_potion_anim',
      frames: this.anims.generateFrameNumbers('blue_potion'),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'red_potion_anim',
      frames: this.anims.generateFrameNumbers('red_potion'),
      frameRate: 10,
      repeat: -1
    });

    this.man = this.physics.add.sprite(this.position.x, this.position.y, 'man');
    this.man.play('man_anim');
    this.input.on('pointerdown', this.setPosition, this);

    this.bluePotions = this.physics.add.group();
    this.redPotions = this.physics.add.group();

    this.physics.add.overlap(this.man, this.bluePotions, this.increaseMoving, null, this);
    this.physics.add.overlap(this.man, this.redPotions, this.heal, null, this);
  }

  getMovingWeight() {
    var angle = Math.atan2(this.position.y - this.man.y, this.position.x - this.man.x);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  moveTheMan() {
    console.log(this.speed)
    var weight = this.getMovingWeight();
    this.man.x += (this.speed * weight.x);
    this.man.y += (this.speed * weight.y);
  }

  isCreateTime() {
    return Math.random() * 10000 < 10;
  }

  createBluePotion() {
    if (!this.bluePotions.children.size && this.isCreateTime()) {
      var bluePotion = this.physics.add.sprite(32, 32, 'blue_potion');
      this.bluePotions.add(bluePotion);
      bluePotion.setRandomPosition(0, 0, config.width - 16, config.height - 16);
      bluePotion.play('blue_potion_anim');
    }
  }

  createRedPotion() {
    if (!this.redPotions.children.size && this.isCreateTime()) {
      var redPotion = this.physics.add.sprite(32, 32, 'red_potion');
      this.redPotions.add(redPotion);
      redPotion.setRandomPosition(0, 0, config.width - 16, config.height - 16);
      redPotion.play('red_potion_anim')
    }
  }

  update() {
    this.moveTheMan();
    this.createBluePotion();
    this.createRedPotion();
  }
}