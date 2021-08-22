const socket = io();

const red = document.getElementById('red');
const orange = document.getElementById('orange');
const yellow = document.getElementById('yellow');
const green = document.getElementById('green');
const blue = document.getElementById('blue');
const purple = document.getElementById('purple');
const black = document.getElementById('black');
const colorChoice = document.getElementById('colorChoice');
const allColors = document.getElementsByClassName('color');
const usersOnline = document.getElementById('usersOnline');

let tips = document.getElementById('tips');
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let catGame = document.getElementById('catGame');
const blackTriangle = document.getElementById('blackTriangle');
localStorage.setItem('speed', 10)
let speed = Number(localStorage.speed) || 1;
let flexSwitchCheckDefault = document.getElementById('flexSwitchCheckDefault');
let catText = document.getElementById('catText');

if (localStorage.cats) {
    flexSwitchCheckDefault.checked = true;
    catText.innerHTML = '<h5 class="text-success"><b>Cats Enabled</b></h5>';
} else if (!localStorage.cats) {
    flexSwitchCheckDefault.checked = false;
    catText.innerHTML = '<h5 class="text-danger"><b>Cats Disabled</b></h5>';
}

if (!localStorage.color) {
    colorChoice.innerHTML = 'You haven\'t chose a color'
}

if (localStorage.color) {
    colorChoice.innerHTML = `Your color is <b>${localStorage.color}</b>`
}

class Character {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = 0;
        this.dy = 0;
    }

    wallCollisions() {
        //Top Wall
        if (this.y <= 0) {
            this.y = 0;
        }
        //Bottom Wall
        if (this.y >= canvas.height - this.h) {
            this.y = canvas.height - this.h
        }
    }

    draw() {
        this.wallCollisions();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 60, canvas.height)
        ctx.closePath();

        ctx.beginPath();
        ctx.drawImage(catGame, canvas.width / 5, 100);
        ctx.drawImage(catGame, canvas.width / 1.2, canvas.height / 2);
        ctx.drawImage(catGame, canvas.width / 4, canvas.height / 1.3);
        ctx.closePath();


        ctx.beginPath();
        ctx.fillStyle = `${localStorage.color}` || `green`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();

        ctxCheck(red)
        ctxCheck(red)
        ctxCheck(orange)
        ctxCheck(yellow)
        ctxCheck(green)
        ctxCheck(blue)
        ctxCheck(purple)
        ctxCheck(black)
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
}

let character1 = new Character(60, canvas.width / 2, 60, 60)
let controller1 = new Controller();

function createColor(color, el) {
    el.addEventListener('click', function() {
        localStorage.setItem('color', `${color}`)
        colorChoice.innerHTML = 'You have chosen the color ' + `<b>${localStorage.color}</b>`
    })
}

function ctxCheck(el) {
    el.addEventListener('click', function() {
        ctx.beginPath();
        ctx.fillStyle = `${localStorage.color}` || `green`;
        ctx.fillRect(60, canvas.height / 2, 60, 60);
        ctx.closePath();
    })
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

createColor('red', red)
createColor('orange', orange)
createColor('yellow', yellow)
createColor('green', green)
createColor('blue', blue)
createColor('purple', purple)
createColor('black', black)


let slider2 = document.getElementById('myRange2')
let speedDiv2 = document.getElementById('speedDiv2')
speedDiv2.innerHTML = 'Speed: ' + slider2.value;

slider2.oninput = function() {
    localStorage.setItem('speed', Number(slider2.value))
    speed = localStorage.speed;
    speedDiv2.innerHTML = `Speed: ${slider2.value}`
}

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randNum(arr) {
    return Math.floor(Math.random() * arr.length);
}

let tipsFunction = setInterval(function() {
    let tipsText = ['Try to dodge the obstacles!', 'Dodge Game was created on 8/3/2021 at 3:49 PM', 'Red is statistically the best color.', 'Using a higher speed usually gives you an advantage.', 'You can play around with anything in the sandbox mode.', 'Using w and d is superior than using the Up and Down arrows.', 'Grayson holds the highest score currently, at around 613.', 'The creator of this game is Charlie.', 'I hope you like this website.', 'Leaderboards are being added soon!.', 'The creator of this game has created many others, all of which you should check out on repl!', 'press ctrl+w for free 1000 points!'];

    tips.innerHTML = `<h5><b>Tip/Fact: ${rand(tipsText)}<b><h5>`
}, 5000)

document.addEventListener('keydown', function(e) {
    if (e.code === "Enter") {
        let nickname = document.getElementById('nickname');
        if (nickname.value.length > 1) {
            localStorage.setItem('nickname', nickname.value)
            window.location.href = '/game'
        } else {
            console.error('Nickname length must be greater than 1!')
        }
    }
})

document.getElementById('enterGameBtn').addEventListener('click', function() {
    let nickname = document.getElementById('nickname');
    if (nickname.value.length > 1) {
        localStorage.setItem('nickname', nickname.value)
        window.location.href = '/game'
    } else {
        console.error('Nickname length must be greater than 1!')
    }
})

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character1.update();

    requestAnimationFrame(animate);
}
animate();

flexSwitchCheckDefault.addEventListener('change', function(e) {
    if (this.checked) {
        localStorage.setItem('cats', true);
        catText.innerHTML = '<h5 class="text-success"><b>Cats Enabled</b></h5>';
    } else if (!this.checked) {
        localStorage.removeItem('cats');
        catText.innerHTML = '<h5 class="text-danger"><b>Cats Disabled</b></h5>';
    }
})

socket.on('userCount', function(data) {
    if (Number(data.userCount) == 1) {
        usersOnline.innerHTML = data.userCount + ' user online';
    } else if (Number(data.userCount) >= 2) {
        usersOnline.innerHTML = data.userCount + ' users online';
    }
});