class Player {
  constructor(game, x, y, speedX, speedY, color, name, image) {
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
    this.length = 3;
    this.segments = [];
    for (let i = 0; i < this.length; i++) {
      if (i > 0) {
        this.x += this.speedX;
        this.y += this.speedY;
      }
      this.segments.unshift({
        x: this.x,
        y: this.y,
        frameX: 5,
        frameY: 0,
      });
    }
    this.readyToTurn = true;
    this.name = name;
    this.image = image;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
  }

  update() {
    this.readyToTurn = true;
    // collisions
    if (this.game.checkCollision(this, this.game.food)) {
      let color;
      // NOT EDIBLE
      if (this.game.food.frameY === 1) {
        this.score--;
        color = "black";
        if (this.length > 2) {
          this.length--;
          if (this.segments.length > this.length) {
            this.segments.pop();
          }
        }
        // REGULAR FOOD
      } else {
        this.score++;
        this.length++;
        color = "gold";
      }
      for (let i = 0; i < 5; i++) {
        const particle = this.game.getParticle();
        if (particle) {
          particle.start(
            this.game.food.x * this.game.cellSize + this.game.cellSize * 0.5,
            this.game.food.y * this.game.cellSize + this.game.cellSize * 0.5,
            color
          );
        }
      }
      this.game.food.reset();
    }
    // boundaries
    if (
      (this.x <= 0 && this.speedX < 0) ||
      (this.x >= this.game.columns - 1 && this.speedX > 0) ||
      (this.y <= this.game.topMargin && this.speedY < 0) ||
      (this.y >= this.game.rows - 1 && this.speedY > 0)
    ) {
      this.moving = false;
    }

    if (this.moving) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.segments.unshift({ x: this.x, y: this.y, frameX: 5, frameY: 0 });
      if (this.segments.length > this.length) {
        this.segments.pop();
      }
    }

    // win condition
    if (this.score >= this.game.winningScore) {
      this.game.gameUi.triggerGameOver(this);
    }
  }

  draw() {
    this.segments.forEach((segment, index) => {
      if (this.game.debug) {
        if (index === 0) this.game.ctx.fillStyle = "gold";
        else this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(
          segment.x * this.game.cellSize,
          segment.y * this.game.cellSize,
          this.width,
          this.height
        );
      }

      this.setSpriteFrame(index);

      this.game.ctx.drawImage(
        this.image,
        segment.frameX * this.spriteWidth,
        segment.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        segment.x * this.game.cellSize,
        segment.y * this.game.cellSize,
        this.width,
        this.height
      );
    });
  }

  turnUp() {
    if (this.speedY === 0 && this.y > this.game.topMargin && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = -1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnDown() {
    if (this.speedY === 0 && this.y < this.game.rows - 1 && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = 1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnLeft() {
    if (this.speedX === 0 && this.x > 0 && this.readyToTurn) {
      this.speedX = -1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  turnRight() {
    if (
      this.speedX === 0 &&
      this.x < this.game.columns - 1 &&
      this.readyToTurn
    ) {
      this.speedX = 1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
  }

  setSpriteFrame(index) {
    const segment = this.segments[index];
    const prevSegment = this.segments[index - 1] || 0;
    const nextSegment = this.segments[index + 1] || 0;

    // HEAD
    if (index === 0) {
      // up
      if (segment.y < nextSegment.y) {
        if (
          this.game.food.y === segment.y - 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 1;
        } else {
          segment.frameX = 1;
          segment.frameY = 2;
        }
        //down
      } else if (segment.y > nextSegment.y) {
        if (
          this.game.food.y === segment.y + 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 3;
        } else {
          segment.frameX = 0;
          segment.frameY = 4;
        }
        // left
      } else if (segment.x < nextSegment.x) {
        if (
          this.game.food.x === segment.x - 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 2;
          segment.frameY = 4;
        } else {
          segment.frameX = 0;
          segment.frameY = 0;
        }
        // right
      } else if (segment.x > nextSegment.x) {
        if (
          this.game.food.x === segment.x + 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 4;
          segment.frameY = 4;
        } else {
          segment.frameX = 2;
          segment.frameY = 1;
        }
      }
      // TAIL
    } else if (index === this.segments.length - 1) {
      // up
      if (prevSegment.y < segment.y) {
        segment.frameX = 1;
        segment.frameY = 4;
        // down
      } else if (prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 2;
        // left
      } else if (prevSegment.x < segment.x) {
        segment.frameX = 2;
        segment.frameY = 0;
        // right
      } else if (prevSegment.x > segment.x) {
        segment.frameX = 0;
        segment.frameY = 1;
      }
      // BODY
    } else {
      // horizontal right
      if (nextSegment.x < segment.x && prevSegment.x > segment.x) {
        segment.frameX = 5;
        segment.frameY = 3;
        // horizontal left
      } else if (prevSegment.x < segment.x && nextSegment.x > segment.x) {
        segment.frameX = 5;
        segment.frameY = 2;
        // vertical up
      } else if (prevSegment.y < segment.y && nextSegment.y > segment.y) {
        segment.frameX = 1;
        segment.frameY = 3;
        // vertical down
      } else if (nextSegment.y < segment.y && prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 3;
        // bend up left
      } else if (prevSegment.x < segment.x && nextSegment.y > segment.y) {
        segment.frameX = 4;
        segment.frameY = 0;
        // bend down left
      } else if (prevSegment.y > segment.y && nextSegment.x > segment.x) {
        segment.frameX = 3;
        segment.frameY = 0;
        //bend down right
      } else if (prevSegment.x > segment.x && nextSegment.y < segment.y) {
        segment.frameX = 3;
        segment.frameY = 1;
        //bend down left
      } else if (prevSegment.y < segment.y && nextSegment.x < segment.x) {
        segment.frameX = 4;
        segment.frameY = 1;
        // bend clockwise right down
      } else if (nextSegment.x < segment.x && prevSegment.y > segment.y) {
        segment.frameX = 3;
        segment.frameY = 2;
        // bend clockwise left down
      } else if (nextSegment.y < segment.y && prevSegment.x < segment.x) {
        segment.frameX = 3;
        segment.frameY = 3;
        //bend clockwise left up
      } else if (nextSegment.x > segment.x && prevSegment.y < segment.y) {
        segment.frameX = 2;
        segment.frameY = 3;
        //bend clockwise right up
      } else if (nextSegment.y > segment.y && prevSegment.x > segment.x) {
        segment.frameX = 2;
        segment.frameY = 2;
      } else {
        segment.frameX = 6;
        segment.frameY = 0;
      }
    }
  }
}

class Keyboard1 extends Player {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") this.turnUp();
      else if (e.key === "ArrowDown") this.turnDown();
      else if (e.key === "ArrowLeft") this.turnLeft();
      else if (e.key === "ArrowRight") this.turnRight();
    });
  }
}

class Keyboard2 extends Player {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "w") this.turnUp();
      else if (e.key.toLowerCase() === "s") this.turnDown();
      else if (e.key.toLowerCase() === "a") this.turnLeft();
      else if (e.key.toLowerCase() === "d") this.turnRight();
    });
  }
}

class ComputerAi extends Player {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);
    this.turnTimer = 0;
    this.turnInterval;
    this.ai_difficulty = document.getElementById("ai_difficulty").value;
    this.turnInterval = Math.floor(Math.random() * this.ai_difficulty);
  }

  update() {
    super.update();
    if (this.turnTimer < this.turnInterval) {
      this.turnTimer += 1;
    } else {
      this.turnTimer = 0;
      this.turn();
      this.turnInterval = Math.floor(Math.random() * this.ai_difficulty);
    }
  }

  turn() {
    const food = this.game.food;
    // dont turn if moving towards food
    if (food.x === this.x && food.y < this.y && this.speedY < 0) return;
    else if (food.x === this.x && food.y > this.y && this.speedY > 0) return;
    else if (food.y === this.y && food.x < this.x && this.speedX < 0) return;
    else if (food.y === this.y && food.x > this.x && this.speedX > 0) return;

    if (food.x < this.x && this.speedX === 0) {
      this.turnLeft();
    } else if (food.x > this.x && this.speedX === 0) {
      this.turnRight();
    } else if (food.y < this.y && this.speedY === 0) {
      this.turnUp();
    } else if (food.y > this.y && this.speedY === 0) {
      this.turnDown();
    } else {
      if (this.speedY === 0) {
        Math.random() < 0.5 ? this.turnUp() : this.turnDown();
      } else if (this.speedX === 0) {
        Math.random() < 0.5 ? this.turnLeft() : this.turnRight();
      }
    }
  }
}
