import Phaser from 'phaser';
import config from '../Config/config.js';
import Button from '../Objects/Button.js';
import axios from "axios";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // Game
    this.gameButton = new Button(this, config.width / 2, config.height / 2 - 50, 'blueButton1', 'blueButton2', 'Play', 'Game');

    // Options
    this.optionsButton = new Button(this, config.width / 2, config.height / 2 + 50, 'blueButton1', 'blueButton2', 'Options', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 2, config.height / 2 + 150, 'blueButton1', 'blueButton2', 'Credits', 'Credits');

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = false;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }

    //--------------------------------

    this.message = this.add.text(config.width / 2, 64, "Welcome, Alien", {
      color: "#FFFFFF",
      fontSize: 16,
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.playerName = this.add.dom(config.width / 2, 112, 'input','background-color: #fff; color: #1FA7E1; width: 200px; height: 32px; font: 16px Arial');

    document.querySelector('input').placeholder = 'Enter your name'
    document.querySelector('input').style.textAlign = 'center'

    this.instruction = this.add.text(config.width / 2, 160, "Press ENTER to Register", {
      color: "#FFFFFF",
      fontSize: 16,
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.returnKey.on("down", event => {
      const input = document.querySelector('input');
      let name = input.value;
      if(name !== '') {
        this.message.setText(`Welcome ${name}`);
        this.instruction.setText(`Welcome to Wonderland. Press Play to start the game`);
        input.value = '';
      }
    });

    //----------------------------------------


  }
}