function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.documentElement.clientHeight;
const ctx = canvas.getContext('2d'),
  player = {
    x: 60,
    y: canvas.height / 2,
    w: 30,
    h: 30
  }


let obstacles = [];
let score = 0
let color = '#FF0000';
let slider = document.getElementById('myRange')
let speedDiv = document.getElementById('speedDiv')
speedDiv.innerHTML = `Speed: ${localStorage.speed}`;
let speed = Number(localStorage.speed) || 1;
let intervals = [];
let collidedRect2;
let textCtx;
let stopCanvas = document.getElementById('stopCanvas');
let reload = document.getElementById('reload');
let home = document.getElementById('home');
let danger = document.getElementById('danger');

class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dx = 0;
    this.dy = 0;
  }

  draw() {
    this.wallCollisions();

    if (!collidedRect2) {
      ctx.beginPath();
      ctx.fillStyle = '#0000FF';
      ctx.font = '30px Work Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`Speed/MS: ${timeCount}`, 160, 30)

      ctx.beginPath();
      ctx.fillStyle = '#0000FF';
      ctx.font = '30px Work Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score} | Seconds Until Next Spawn: ${(timeInterval / 1000).toFixed(2)} seconds`, canvas.width / 2, 30)
    }

    ctx.beginPath();
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 60, canvas.height)
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = `${localStorage.color}` || `#0000FF`;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();

    if (collidedRect2) {
      ctx.beginPath();
      ctx.fillStyle = '#FF0000';
      ctx.drawImage(danger, collidedRect2.x, collidedRect2.y, collidedRect2.w, collidedRect2.h);
      ctx.closePath();

      if (!textCtx) {
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.font = '30px Work Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`You died with a score of ${score}, reloading in 3 seconds`, canvas.width / 2, canvas.height / 2 - 100);
      }

      if (textCtx) {
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.font = '30px Work Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`${textCtx}`, canvas.width / 2, canvas.height / 2 - 100);
      }
    }
  }

  wallCollisions() {
    //Top Wall
    if (this.y <= 0) {
      this.y = 0;
    }
    //Bottom Wall
    if (this.y >= canvas.height - player.h) {
      this.y = canvas.height - player.h
    }
  }

  update() {
    if (controller1.up) {
      this.dy -= speed / 10
    };
    if (controller1.down) {
      this.dy += speed / 10
    };
    this.x += this.dx;
    this.y += this.dy;
    this.dx *= 0.9;
    this.dy *= 0.9;
    this.draw();
  }

  spawner() {
    obstacles.push({
      x: canvas.width - 60,
      y: getRandomArbitrary(this.y - 250, this.y + 250),
      w: 60,
      h: 30,
    });
  }

  setPos() {
    this.dx = 0;
    this.dy = 0;
  }
}

class Controller {
  constructor() {
    this.up = false;
    this.down = false;

    let keyEvent = (e) => {
      if (e.code == "KeyW" || e.code == "ArrowUp") {
        this.up = e.type == 'keydown'
      };
      if (e.code == "KeyS" || e.code == "ArrowDown") {
        this.down = e.type == 'keydown'
      };

    }
    addEventListener('keydown', keyEvent);
    addEventListener('keyup', keyEvent);
    addEventListener('mousemove', keyEvent)
  }

  resetControlls() {
    this.up = false;
    this.down = false;
  }
}

window.addEventListener('resize', function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let character1 = new Character(player.x, player.y, player.w, player.h);
let controller1 = new Controller();

let timeInterval = 250;
let timeCount = 36;
let timeCheck = 3000;

var timeIntervalFunction = setInterval(function () {
  if (timeInterval > 100) {
    timeInterval = timeInterval - 20;
  } else if (timeInterval < 100) {
    timeInterval = 100;
  }
  if (timeInterval <= 1000) {
    character1.spawner();
    color = '#dda0dd';
    if (timeInterval > 500) {
      timeCount = 36;
    }
  }
  if (timeInterval <= 500) {
    character1.spawner();
    color = '#d2691e';
    if (timeInterval > 250) {
      timeCount = 40;
    }
  }
  if (timeInterval <= 250) {
    character1.spawner();
    color = '#000000'
    timeCount = 45;
  }
}, timeCheck)

var spawnFunction = setInterval(function () {
  character1.spawner();
}, timeInterval)

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  character1.update();



  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillStyle = color;
    ctx.drawImage(danger, obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);

    if (obstacles[i].x + obstacles[i].w <= 100 && obstacles[i].x >= -10) {
      try {
        obstacles.splice(i, 1)
      } catch (error) {
        console.error(error)
      }
      score++
    }

    setTimeout(function () {
      if (!obstacles[i]) return
      obstacles[i].x = obstacles[i].x - timeCount;
    })
    collisionCheck(character1, obstacles[i])

  }

  requestAnimationFrame(animate);
}
animate();

function collisionCheck(rect1, rect2) {

  if (rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.h > rect2.y) {
    speed = 0;
    obstacles = [];
    clearInterval(timeIntervalFunction);
    clearInterval(spawnFunction);
    let collidedRect = {
      x: rect2.x,
      y: rect2.y,
      w: rect2.w,
      h: rect2.h,
    }

    collidedRect2 = collidedRect;

    character1.setPos();
    stopCanvas.style.display = 'inline-block';
    reload.style.display = 'inline-block';
    home.style.display = 'inline-block';

    stopCanvas.addEventListener('click', function (e) {
      clearTimeout(resetTimeout)
      textCtx = `Score: ${score} \nCleared Timeout!`
    })

    home.addEventListener('click', function (e) {
      window.location.href = '/index.html'
    })

    reload.addEventListener('click', function (e) {
      document.location.reload();
    })

    document.addEventListener('keydown', function (e) {
      if (e.code === "KeyR") {
        document.location.reload();
      } else if (e.code === "KeyC") {
        clearTimeout(resetTimeout)
        textCtx = `Score: ${score} \nCleared Timeout!`
      }
    })

    let resetTimeout = setTimeout(function () {
      document.location.reload();
    }, 3000)

    controller1.resetControlls();
  }

}