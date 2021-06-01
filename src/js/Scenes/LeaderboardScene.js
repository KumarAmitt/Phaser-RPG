import Phaser from "phaser";
import config from "../Config/config";
import getScores from "../Api/getScore";
import Button from "../Objects/Button";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
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

    let yCord = 132;

    this.add.text(config.width / 2, 100,
        `${this.sys.game.globals.name}${'.'.repeat(30-this.sys.game.globals.name.length)}${this.sys.game.globals.score}`,
        {color: "#ffff00"}).setOrigin(0.5);

    console.log(scores)

    Object.entries(await getScores()).forEach(s => {
      const name = s[1]['user'];
      const score = s[1]['score']
      const space = 30 - name.length
      this.add.text(config.width / 2, yCord,
          `${name}${'.'.repeat(space)}${score}`,
          {color: "#fff"}).setOrigin(0.5);

      yCord += 32;
    });

    this.model = this.sys.game.globals.model;
    if(this.model.musicOn)
      this.model.musicOn = !this.model.musicOn;

    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');



  }



}