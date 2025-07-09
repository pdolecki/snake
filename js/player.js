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
    this.score = 0;
    this.length = 2;
    this.segments = [];
    this.readyToTurn = true;
  }

  update() {
    this.readyToTurn = true;
    // collisions
    if (this.game.checkCollision(this, this.game.food)) {
      this.game.food.reset();
      this.score++;
      this.length++;
    }
    // boundaries
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
      this.segments.unshift({ x: this.x, y: this.y });
      if (this.segments.length > this.length) {
        this.segments.pop();
      }
    }
  }

  draw() {
    this.segments.forEach((segment, index) => {
      if (index === 0) this.game.ctx.fillStyle = "gold";
      else this.game.ctx.fillStyle = this.color;
      this.game.ctx.fillRect(
        segment.x * this.game.cellSize,
        segment.y * this.game.cellSize,
        this.width,
        this.height
      );
    });
  }

  turnUp() {
    if (this.speedY === 0) {
      this.speedX = 0;
      this.speedY = -1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnDown() {
    if (this.speedY === 0 && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = 1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnLeft() {
    if (this.speedX === 0 && this.readyToTurn) {
      this.speedX = -1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnRight() {
    if (this.speedX === 0 && this.readyToTurn) {
      this.speedX = 1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
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

class ComputerAi extends Player {
  constructor(game, x, y, speedX, speedY, color) {
    super(game, x, y, speedX, speedY, color);
    this.turnTimer = 0;
    this.turnInterval = Math.floor(Math.random() * this.game.columns + 1);
  }

  update() {
    super.update();
    if (this.turnTimer < this.turnInterval) {
      this.turnTimer += 1;
    } else {
      this.turnTimer = 0;
      this.turn();
      this.turnInterval = Math.floor(Math.random() * this.game.columns + 1);
    }
  }

  turn() {
    if (this.speedY === 0) {
      Math.random() < 0.5 ? this.turnUp() : this.turnDown();
    } else if (this.speedX === 0) {
      Math.random < 0.5 ? this.turnLeft() : this.turnRight();
    }
  }
}
