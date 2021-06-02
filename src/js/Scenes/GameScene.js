import Phaser from 'phaser';
import axios from 'axios'

import tilesImg from '../../assets/map/basictiles.png';
import tilesJson from '../../assets/map/world.json';
import characterImg from '../../assets/characters.png';
import updateScore from "../Api/updateScore";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(){
    this.life = 3
    this.sys.game.globals.score = 0;
  }

  preload() {
    this.load.image('tiles', tilesImg);
    this.load.tilemapTiledJSON('map', tilesJson);
    this.load.spritesheet('player', characterImg, { frameWidth: 16, frameHeight: 16 });
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

    this.createAnimation({key: 'left', object: 'player', frames: [19, 20, 19, 21]})
    this.createAnimation({key: 'right', object: 'player', frames: [31, 30, 31, 32]})
    this.createAnimation({key: 'up', object: 'player', frames: [43, 42, 43, 44]})
    this.createAnimation({key: 'down', object: 'player', frames: [7, 6, 7, 8]})

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, obstacles);

    //--------------------------
    this.frog = this.physics.add.group();

    const frogGenLoop = this.time.addEvent({
      delay: 2000,
      callback: this.frogGen,
      callbackScope: this,
      loop: true
    });

    this.physics.add.overlap(this.player, this.frog, this.onMeetFrog, false, this);

    //-------------------------------------
    this.enemy = this.physics.add.group();

    const enemyGenLoop = this.time.addEvent({
      delay: 3000,
      callback: this.enemyGen,
      callbackScope: this,
      loop: true
    });

    this.physics.add.overlap(this.player, this.enemy, this.onMeetEnemy, false, this);

    //----------------------------------

    this.scoreText = this.add.text(8, 8, 'Score: 0', { fontSize: '16px', fill: '#fff', backgroundColor:'#000' })
    this.scoreText.scrollFactorX = 0
    this.scoreText.scrollFactorY = 0

    this.lifeText = this.add.text(720, 8, 'Life: 3', { fontSize: '16px', fill: '#fff', backgroundColor:'#000' })
    this.lifeText.scrollFactorX = 0
    this.lifeText.scrollFactorY = 0

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

  createAnimation({key, object, frames}){
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNumbers(object, { frames: frames}),
      frameRate: 10,
      repeat: -1
    });
  }

  onMeetFrog(player, zone) {
    // we move the zone to some other location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    // shake the world
    this.cameras.main.shake(100);

    // start battle
    this.sys.game.globals.score += 10;
    this.scoreText.setText(`Score: ${this.sys.game.globals.score}`)
  }
  async onMeetEnemy(player, zone) {
    // we move the zone to some other location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    // shake the world
    this.cameras.main.shake(200);

    // start battle
    this.life -= 1;
    this.lifeText.setText(`Life: ${this.life}`)

    if(this.life === 2) {
      this.scene.start('Leaderboard');
      await updateScore({user: this.sys.game.globals.name, score: this.sys.game.globals.score})
    }
  }

  frogGen(){
    for(let i = 0; i < 5; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      const v = Phaser.Math.RND.between(10, 20)

      this.frog.create(x, y, 'player', 48);
      this.frog.setVelocityX(v)
    }
  }

  enemyGen(){
    for(let i = 0; i < 10; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      const v = Phaser.Math.RND.between(20, 40)

      this.enemy.create(x, y, 'player', 58);
      this.enemy.setVelocityX(-v)
    }
  }

}