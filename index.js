class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width;
    this.height;
    this.cellSize = 50;
    this.columns;
    this.rows;

    this.eventTimer = 0;
    this.eventInterval = 200;
    this.eventUpdate = false;

    this.player1;
    this.player2;
    this.player3;
    this.player4;
    this.gameObjects;

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width, height) {
    this.canvas.width = width - (width % this.cellSize);
    this.canvas.height = height - (height % this.cellSize);
    this.ctx.fillStyle = "blue";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.columns = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);

    this.player1 = new Keyboard1(this, 0, 0, 1, 0, "blue");
    this.player2 = new ComputerAi(this, this.columns - 1, 0, 0, 1, "yellow");
    this.player3 = new ComputerAi(
      this,
      this.columns - 1,
      this.rows - 1,
      -1,
      0,
      "yellow"
    );
    this.player4 = new ComputerAi(this, 0, this.rows - 1, 0, -1, "yellow");
    this.gameObjects = [this.player1, this.player2, this.player3, this.player4];
  }

  drawGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.ctx.strokeRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = 0;
      this.eventUpdate = true;
    }
  }

  render(deltaTime) {
    this.handlePeriodicEvents(deltaTime);
    if (this.eventUpdate) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawGrid();
      this.gameObjects.forEach((object) => {
        object.draw();
        object.update();
      });
    }
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
