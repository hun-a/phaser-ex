class BigHead extends Phaser.Scene {
  constructor() {
    super('BigHead');
    this.position = {
      x: config.width / 2,
      y: config.height / 2
    };
    this.speed = 1;
    this.life = 3;
    this.bulletSpeed = 10;
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
    this.load.image('cannon', 'assets/images/cannon.png');
    this.load.image('bullet', 'assets/images/bullet.png')
  }

  setPosition(pointer) {
    this.position.x = pointer.x;
    this.position.y = pointer.y;
  }

  displayLife() {
    this.lifeContainer.text = `Life: ${this.life}`;
  }

  displaySpeed() {
    this.speedContainer.text = `Speed: ${this.speed === 5 ? 'Max' : this.speed}`;
  }

  bounceOff(man, others) {
    var bounce = 20;
    if (man.x > others.x) {
      man.x += bounce;
    } else if (man.x < others.x) {
      man.x -= bounce;
    }
    man.y -= bounce;
    this.position.x = man.x;
    this.position.y = man.y;
    this.man.x = man.x;
    this.man.y = man.y;
  }

  collideToCannon(man, cannon) {
    this.life -= 1;
    this.displayLife();
    this.bounceOff(man, cannon);
  }

  hitTheMan(man, projectile) {
    this.life -= 1;
    this.displayLife();
    projectile.destroy();
  }

  increaseMoving(man, potion) {
    this.speed = Math.min(this.speed + 1, 5);
    potion.disableBody(true, true);
    this.bluePotions.children.entries.pop();
    this.displaySpeed();
  }

  heal(man, potion) {
    this.life = Math.min(this.life + 1, 3);
    potion.disableBody(true, true);
    this.redPotions.children.entries.pop();
    this.displayLife();
  }

  shootBullet(scene) {
    var bullet = new Bullet(scene);
  }

  increaseBulletSpeed(scene) {
    if (scene.bulletSpeed) {
      scene.bulletSpeed += 10;
    } else {
      // Add the new Cannon and reset the bullet speed
    }
    console.log({
      speed: scene.bulletSpeed
    })
  }

  create() {
    this.anims.create({
      key: 'man_anim',
      frames: this.anims.generateFrameNumbers('man'),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'blue_potion_anim',
      frames: this.anims.generateFrameNumbers('blue_potion'),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'red_potion_anim',
      frames: this.anims.generateFrameNumbers('red_potion'),
      frameRate: 12,
      repeat: -1
    });

    this.cannon = this.physics.add.image(config.width / 2, config.height + 10, 'cannon');
    this.cannon.setOrigin(0.5, 0.8);

    this.man = this.physics.add.sprite(this.position.x, this.position.y, 'man');
    this.man.play('man_anim');
    this.input.on('pointerdown', this.setPosition, this);

    this.bluePotions = this.physics.add.group();
    this.redPotions = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    this.physics.add.collider(this.man, this.cannon, this.collideToCannon, null, this);
    this.physics.add.overlap(this.man, this.projectiles, this.hitTheMan, null, this);
    this.physics.add.overlap(this.man, this.bluePotions, this.increaseMoving, null, this);
    this.physics.add.overlap(this.man, this.redPotions, this.heal, null, this);

    this.lifeContainer = this.add.text(20, 20, `Life: ${this.life}`, { font: '20px Arial', fill: 'black' });
    this.speedContainer = this.add.text(120, 20, `Speed: ${this.speed}`, { font: '20px Arial', fill: 'black' });

    this.time.addEvent({
      delay: 1000,
      callback: this.shootBullet,
      args: [this],
      loop: true
    });
    this.time.addEvent({
      delay: 1000 * 10,
      callback: this.increaseBulletSpeed,
      args: [this],
      loop: true
    });
  }

  getRadian(from, to) {
    return Math.atan2(to.y - from.y, to.x - from.x);
  }

  getMovingWeight() {
    var angle = this.getRadian(this.man, this.position);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  isReach() {
    var x = Math.round(this.man.x);
    var y = Math.round(this.man.y);

    return [x - 2, x - 1, x, x + 1, x + 2].includes(this.position.x) &&
      [y - 2, y - 1, y, y + 1, y + 2].includes(this.position.y);
  }

  moveTheMan() {
    if (this.isReach()) {
      return;
    }

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

  getAngle(from, to) {
    return this.getRadian(from, to) * (180 / Math.PI);
  }

  rotateCannon() {
    var angle = this.getAngle(this.cannon, this.man) + 90;
    this.cannon.angle = angle;
  }

  applyDelta(delta) {
    this.delta = delta;
  }

  update(time, delta) {
    this.moveTheMan();
    this.createBluePotion();
    this.createRedPotion();
    this.rotateCannon();
    this.applyDelta(delta);
  }
}