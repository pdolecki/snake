class Player {
  constructor(game, x, y, speedX, speedY, color) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.width = this.game.cellSize;
    this.height = this.game.cellSize;
    this.moving = true;
  }

  update() {
    const leftBoundary = this.x <= 0 && this.speedX < 0;
    const rightBoundary = this.x >= this.game.columns - 1 && this.speedX > 0;
    const topBoundary = this.y <= 0 && this.speedY < 0;
    const bottomBoundary = this.y >= this.game.rows - 1 && this.speedY > 0;
    if (leftBoundary || rightBoundary || topBoundary || bottomBoundary) {
      this.moving = false;
    }

    if (this.moving) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }

  draw() {
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fillRect(
      this.x * this.game.cellSize,
      this.y * this.game.cellSize,
      this.width,
      this.height
    );
  }

  turnUp() {
    this.speedX = 0;
    this.speedY = -1;
    this.moving = true;
  }

  turnDown() {
    this.speedX = 0;
    this.speedY = 1;
    this.moving = true;
  }

  turnLeft() {
    this.speedX = -1;
    this.speedY = 0;
    this.moving = true;
  }

  turnRight() {
    this.speedX = 1;
    this.speedY = 0;
    this.moving = true;
  }
}

class Keyboard1 extends Player {
  constructor(game, x, y, speedX, speedY, color) {
    super(game, x, y, speedX, speedY, color);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") this.turnUp();
      else if (e.key === "ArrowDown") this.turnDown();
      else if (e.key === "ArrowLeft") this.turnLeft();
      else if (e.key === "ArrowRight") this.turnRight();
    });
  }
}

class Keyboard2 extends Player {
  constructor(game, x, y, speedX, speedY, color) {
    super(game, x, y, speedX, speedY, color);

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "w") this.turnUp();
      else if (e.key.toLowerCase() === "s") this.turnDown();
      else if (e.key.toLowerCase() === "a") this.turnLeft();
      else if (e.key.toLowerCase() === "d") this.turnRight();
    });
  }
}
