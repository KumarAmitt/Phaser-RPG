import Phaser from "phaser";
import config from "../Config/config";
import getScores from "../Api/getScore";
import Button from "../Objects/Button";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  preload() {

  }

  async create() {
    this.heading = this.add.text(config.width / 2, 32, "Score Board", {
      color: "#FFFFFF",
      fontSize: 24,
      fontStyle: "bold"
    }
    ).setOrigin(0.5);


    //-------------------------------a
    let scores = await getScores()

    let yCord = 100;

    Object.entries(scores).forEach(score => {
      this.add.text(config.width / 2, yCord,
          `${score[1]['user']}     ${score[1]['score']}`,
          {color: "#fff"}).setOrigin(0.5);
      yCord += 32;
    });

    this.model = this.sys.game.globals.model;
    if(this.model.musicOn)
      this.model.musicOn = !this.model.musicOn;

    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');



  }



}