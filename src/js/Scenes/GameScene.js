import Phaser from 'phaser';

import tilesImg2 from '../../assets/map/basictiles.png';
import tilesJson2 from '../../assets/map/world.json';
import playerImg from '../../assets/characters.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('tiles', tilesImg2);
    this.load.tilemapTiledJSON('map', tilesJson2);
    this.load.spritesheet('player', playerImg, { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('town', 'tiles');
    const grass = map.createLayer('Grass', tiles, 0, 0);
    const obstacles = map.createLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);

    this.player = this.physics.add.sprite(1080, 73, 'player', 6);

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [19, 20, 19, 21]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [31, 30, 31, 32] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [43, 42, 43, 44]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 7, 6, 7, 8 ] }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, obstacles);
  }

  update(time, delta) {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
  }
}