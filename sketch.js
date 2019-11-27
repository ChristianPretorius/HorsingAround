let horizon = 0
let horseWidth = 100
let horseHeight = 200
let horseWidthStart = 100
let horseHeightStart = 200
let earHeight = 20
let earWidth = 10
let horseX = 0
let horseY = 0
let cadence = 4
let cadenceHeight = 10
let direction = 1
let dTime = 0
let lArrowx = 0
let lArrowy = 0
let rArrowx = 0
let rArrowy = 0
let horseJumping = false
let jumpingTime = 0
let trees = []
let treeSpawnTime = 0
let randomBufferTrees = 0
let obstacles = []
let obstacleSpawnTime = 0
let randomBufferObstacles = 0
let score = 0
let wastedCount = 0
let wasted = false
let isMobileVar = false;
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  horizon = windowHeight * 1 / 2
  rectMode(CENTER)
  
  isMobile.any()?isMobileVar=true:isMobileVar=false;

  lArrowx = width * 0.1
  lArrowy = height * 0.9
  rArrowx = width * 0.9
  rArrowy = height * 0.9

  horseX = windowWidth / 2
  horseY = windowHeight * 0.95

  d = (width ** 2 + height ** 2) ** 0.5 / 100
  textSize(d * 2)
  horseWidth = d * 10
  horseHeight = d * 20
}

function draw() {
  background(220);
    
  if (!wasted) {
    drawTrack()
    drawSky()
    spawnTrees()
    spawnObstacles()
    checkWasted()

    for (var tree of trees) {
      tree.update()
      tree.draw()
    }
    for (var obstacle of obstacles) {
      obstacle.update()
      obstacle.draw()
      obstacle.checkScore()
    }

    animateHorse()
    drawHorse()
    drawScore()

    if (!horseJumping) {
      moveHorse()
    }

    if (isMobileVar) {
      drawArrows()
      touchCheck()
    }
  }
  if (wasted) {
    wastedCount += 1
    fill(0)
    rect(width / 2, height / 2, width, height)
    fill(255, 0, 0)
    textSize(8 * d)
    text("WASTED", width / 2, height / 2)
    if (wastedCount > 100) {
      wastedCount = 0
      wasted = false
      score = 0
      textSize(d * 2)
      obstacles = []
    }
  }


}

function drawScore() {
  textAlign(CENTER)
  text("Score: " + str(score), width / 2, d * 10)
}

function checkWasted() {
  if (score < 0) {
    wasted = true
  }
}

function spawnObstacles() {
  obstacleSpawnTime += deltaTime
  if (obstacles.length <= 8 && obstacleSpawnTime > (800 + randomBufferObstacles)) {

    randomBufferObstacle = random(500, 1500)
    randomNum = int(random(0, 3))

    side = "m"
    if (randomNum == 1) {
      side = "l"
    }
    if (randomNum == 2) {
      side = "r"
    }

    randomNum = int(random(0, 3))
    type = "pole"
    if (randomNum == 1) {
      type = "wall"
    }

    p = new Obstacle(type, side)
    obstacles.push(p)
    obstacleSpawnTime = 0
  }

  for (var obstacle of obstacles) {
    if (obstacle.z >= 500) {
      index = obstacles.indexOf(obstacle)
      if (index > -1) {
        obstacles.splice(index, 1);
      }
    }
  }
}

function spawnTrees() {
  treeSpawnTime += deltaTime
  if (trees.length <= 3 && treeSpawnTime > (1500 + randomBufferTrees)) {
    randomBufferTrees = random(2500, 4500)
    side = "l"
    if (random(0, 2) > 1) {
      side = "r"
    }
    t = new Obstacle("tree", side)
    trees.push(t)
    treeSpawnTime = 0
  }

  for (var tree of trees) {
    if (tree.z >= 500) {
      index = trees.indexOf(tree)
      if (index > -1) {
        trees.splice(index, 1);
      }
    }
  }
}

function drawTrack() {
  line(windowWidth * 8.5 / 18, horizon, 0, windowHeight)
  line(windowWidth * 9.5 / 18, horizon, windowWidth, windowHeight)
  line(0, horizon, windowWidth, horizon)
}

function drawSky() {
  fill(173, 216, 230)
  rect(windowWidth / 2, horizon / 2, windowWidth, horizon)
}

function animateHorse() {

  if (!horseJumping) {
    dTime += 1
    dYTemp = dTime % (50)
    dY = 5 - map(dYTemp, 0, 49, 0, 10)
    direction = dY / abs(dY)
    horseY += int(direction)
  }

  if (horseJumping) {
    jumpingTime += deltaTime
    if (jumpingTime < 350) {
      horseY -= 1
      horseWidth += 10
      horseHeight += 20
    }
    if (jumpingTime > 350 && jumpingTime < 700) {
      horseY += 1
      horseWidth -= 10
      horseHeight -= 20
    }

    if (jumpingTime > 700) {
      horseJumping = false
      jumpingTime = 0
      horseWidth = d * 10
      horseHeight = d * 20
      horseY = windowHeight * 0.95
    }
  }
}

function drawHorse() {

  lEarx = horseX - horseWidth * 0.4
  lEary = horseY - horseHeight / 2
  rEarx = horseX + horseWidth * 0.4
  rEary = horseY - horseHeight / 2
  earSizeW = horseWidth / 5
  earSizeH = horseHeight / 5

  fill(139, 69, 19)
  rect(horseX, horseY, horseWidth, horseHeight) // head
  stroke(139, 69, 19)
  strokeWeight(earSizeW / 2)
  line(lEarx - earSizeW / 4, lEary, lEarx + earSizeW / 4, lEary - horseHeight / 10)
  line(lEarx + earSizeW / 4, lEary, lEarx + earSizeW / 4, lEary - horseHeight / 10)
  line(rEarx + earSizeW / 4, rEary, rEarx - earSizeW / 4, rEary - horseHeight / 10)
  line(rEarx - earSizeW / 4, rEary, rEarx - earSizeW / 4, rEary - horseHeight / 10)

  fill(0)
  stroke(0)
  strokeWeight(1)
  rect(horseX, horseY, horseWidth * 0.6, horseHeight) //hair
  rect(horseX, horseY - horseY * 0.003 * direction, horseWidth * 0.7, horseHeight * 0.95) //hair


}

function moveHorse() {
  if (keyIsDown(38)) {
    horseJumping = true
  }
  if (keyIsDown(40)) {}
  if (keyIsDown(37)) {
    if (horseX >= horseWidth/2) {
      horseX -= d
    }
  }
  if (keyIsDown(39)) {
    if (horseX <= width - horseWidth/2) {
      horseX += d
    }
  }
}

function drawArrows() {

  stroke(0, 0, 0)
  strokeWeight(d)
  line(lArrowx - 3 * d, lArrowy, lArrowx + 3 * d, lArrowy)
  line(lArrowx - 3 * d, lArrowy, lArrowx, lArrowy + 3 * d)
  line(lArrowx - 3 * d, lArrowy, lArrowx, lArrowy - 3 * d)

  line(rArrowx + 3 * d, rArrowy, rArrowx - 3 * d, rArrowy)
  line(rArrowx + 3 * d, rArrowy, rArrowx, rArrowy + 3 * d)
  line(rArrowx + 3 * d, rArrowy, rArrowx, rArrowy - 3 * d)

  stroke(0)
  strokeWeight(1)

  fill(100, 100, 100)
  ellipse(lArrowx, lArrowy - 15 * d, 8 * d, 8 * d)
  ellipse(rArrowx, rArrowy - 15 * d, 8 * d, 8 * d)

  textAlign(CENTER)
  textSize(2 * d)
  fill(0)
  text("Jump", lArrowx, lArrowy - 15 * d)
  text("Jump", rArrowx, rArrowy - 15 * d)

}

function touchCheck() {
  if (touches.length > 0) {
    for (var t of touches) {
      x = t.x
      y = t.y

      if (dist(x, y, lArrowx, lArrowy) < d * 6 && !horseJumping) {
        if (horseX >= horseWidth/2) {
          horseX -= d
        }
      }

      if (dist(x, y, rArrowx, rArrowy) < d * 6 && !horseJumping) {
        if (horseX <= width - horseWidth/2) {
          horseX += d
        }
      }

      if (dist(x, y, lArrowx, lArrowy - 15 * d) < d * 7) {
        horseJumping = true
      }

      if (dist(x, y, rArrowx, rArrowy - 15 * d) < d * 7) {
        horseJumping = true
      }
    }
  }
}

function keyPressed() {
  if (keyCode == 38) {}
  if (keyCode == 40) {}
  if (keyCode == 37) {}
  if (keyCode == 39) {}
}

class Obstacle {
  constructor(type, side) {
    this.type = type
    this.side = side
    this.height = 0
    this.width = 0
    this.deltaZ = 0
    this.deltadeltaZ = 0
    this.x = 0
    this.y = 0
    this.z = 0
  }

  update() {
    this.deltaZ += (1 + this.z ** 1.5) / 50000
    this.deltadeltaZ += this.deltaZ
    this.z += this.deltadeltaZ

    if (this.type == "pole") {
      this.x = width / 2
      if (this.side == "l") {
        this.x = map(this.z, 0, 500, width * 8.7 / 18, width * 1 / 20)
      }
      if (this.side == "r") {
        this.x = map(this.z, 0, 500, width * 9.3 / 18, width * 19 / 20)
      }
      this.y = map(this.z, 0, 500, horizon, height * 1.2)
      this.height = map(this.z, 0, 500, d / 5, height / 10)
      this.width = map(this.z, 0, 500, d, width / 2)
    }

    if (this.type == "wall") {
      this.x = width / 2

      if (this.side == "l") {
        this.x = map(this.z, 0, 500, width * 8.6 / 18, 0 - width * 4 / 20)
      }
      if (this.side == "r") {
        this.x = map(this.z, 0, 500, width * 9.4 / 18, width * 24 / 20)
      }
      this.y = map(this.z, 0, 500, horizon, height * 1.2)
      this.height = map(this.z, 0, 500, d, height / 2)
      this.width = map(this.z, 0, 500, d, width / 2.5)
    }

    if (this.type == "tree") {
      if (this.side == "l") {
        this.x = map(this.z, 0, 500, width * 8.2 / 18, 0 - 20 * d)
      }
      if (this.side == "r") {
        this.x = map(this.z, 0, 500, width * 9.8 / 18, width + 20 * d)
      }
      this.y = map(this.z, 0, 500, horizon, height)
      this.height = map(this.z, 0, 500, horseHeightStart / 20, horseHeightStart)
      this.width = map(this.z, 0, 500, horseWidthStart / 50, horseWidthStart / 2)
    }

  }
  checkScore() {
    if (this.type == "pole") {
      if (this.y > height * 0.99 && this.y < height * 1.03) {
        if (horseX <= this.x + this.width / 2 && horseX >= this.x - this.width / 2) {
          if (horseJumping) {
            score += 1
          }
          if (!horseJumping) {
            score -= 5
          }
        }
      }
    }
    if (this.type == "wall") { 
      if (this.y > height * 0.99 && this.y < height * 1.03) {
        if (horseX <= this.x + this.width / 2 && horseX >= this.x - this.width / 2) {
          wasted = true
        }
      }
    }
  }
  draw() {
    noStroke()
    if (this.type == "tree") {
      fill(20, 150, 20)
      rect(this.x, this.y, this.width, this.height)
    }
    if (this.type == "pole") {
      fill(50, 50, 50)
      rect(this.x, this.y, this.width, this.height)
    }
    if (this.type == "wall") {
      fill(50, 50, 50)
      rect(this.x, this.y, this.width, this.height)
    }
    stroke(0)
  }
}