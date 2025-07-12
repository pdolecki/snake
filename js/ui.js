class Ui {
  constructor(game) {
    this.game = game;
    // display score
    this.scoreBoard1 = document.getElementById("scoreBoard1");
    this.scoreBoard2 = document.getElementById("scoreBoard2");
    this.scoreBoard3 = document.getElementById("scoreBoard3");
    this.scoreBoard4 = document.getElementById("scoreBoard4");
    // game menu
    this.gameMenu = document.getElementById("gameMenu");
    // game over
    this.gameOverScreen = document.getElementById("gameOverScreen");
    // buttons
    this.startButton = document.getElementById("startButton");
    this.startButton.addEventListener("click", () => {
      this.game.start();
    });
    this.fullScreenButton = document.getElementById("fullScreenButton");
    this.fullScreenButton.addEventListener("click", () => {
      this.game.toggleFullScreen();
    });
    this.debugButton = document.getElementById("debugButton");
    this.debugButton.addEventListener("click", () => {
      this.game.debug = !this.game.debug;
    });
    // controls
    this.player1controls = document.getElementById("player1controls");
    this.player2controls = document.getElementById("player2controls");
    this.player3controls = document.getElementById("player3controls");
    this.player4controls = document.getElementById("player4controls");
    // names
    this.player1name = document.getElementById("player1name");
    this.player2name = document.getElementById("player2name");
    this.player3name = document.getElementById("player3name");
    this.player4name = document.getElementById("player4name");
    // character
    this.player1character = document.getElementById("player1character");
    this.player2character = document.getElementById("player2character");
    this.player3character = document.getElementById("player3character");
    this.player4character = document.getElementById("player4character");
    // messages
    this.message1 = document.getElementById("message1");
    this.message2 = document.getElementById("message2");
  }

  update() {
    this.scoreBoard1.innerText =
      this.game.player1.name + ": " + this.game.player1.score;
    this.scoreBoard2.innerText =
      this.game.player2.name + ": " + this.game.player2.score;
    this.scoreBoard3.innerText =
      this.game.player3.name + ": " + this.game.player3.score;
    this.scoreBoard4.innerText =
      this.game.player4.name + ": " + this.game.player4.score;
  }

  triggerGameOver(winner) {
    this.game.gameOver = true;
    this.gameOverUi();
    if (winner) {
      this.message1.innerText = winner.name + " wins!";
      this.message2.innerText =
        "Game time " + this.game.formatTimer() + " seconds!";
    } else {
      this.message1.innerText = "Welcome to the game!";
      this.message2.innerText = "Choose your players!";
    }
  }

  gameplayUi() {
    this.gameMenu.style.display = "none";
    this.startButton.innerText = "Restart";
    this.gameOverScreen.style.display = "none";
  }

  gameOverUi() {
    this.gameMenu.style.display = "block";
    this.startButton.innerText = "Start";
    this.gameOverScreen.style.display = "block";
  }
}
