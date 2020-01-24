var config = {
  width: 480,
  height: 640,
  backgroundColor: 0xFFFFFF,
  scene: [BigHead],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

var game = new Phaser.Game(config);