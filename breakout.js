var canvas = document.getElementById("404Canvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;
var dy = -2;

var paddleHeight = 3;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 25;
var brickColumnCount = 11;

var brickWidth = 30;
var brickHeight = 15;
var brickPadding = 5;

var brickOffsetTop = 70;
var brickOffsetLeft = 30;

var prevScore = 1;
var score = 0;

var lives = 5; //adding lives 5 and max lives will be 10

var bricks = [];

var gameMap = [
    [0,0,1,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,1,1,1],
    [0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1],
    [1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0],
];

for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        console.log(gameMap[c][r]);
        if(gameMap[c][r] ==  1)
            bricks[c][r] = { x: 0, y: 0, status: 1, color: "grey" };
        else
            bricks[c][r] = { x: 0, y: 0, status: 0, color: "grey" };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if( (x+ballRadius) > b.x && (x-ballRadius) < (b.x + brickWidth)
                    &&
                    y > b.y && y < (b.y + brickHeight) ) {
                    changeWay(true, b);
                    return;
                }else if( x > b.x && x < (b.x + brickWidth)
                    &&
                    (y+ballRadius) > b.y && (y-ballRadius) < (b.y + brickHeight) ) {
                    changeWay(false, b);
                    return;
                }
            }
        }
    }
}

function changeWay(isX, b)
{
    if(isX)
        dx = -dx;
    else
        dy = -dy;
    b.status = 0;
    addScore();
    if(score == brickRowCount*brickColumnCount) {
        alert("YOU WIN, CONGRATS!");
        document.location.reload();
    }
}

function addScore()
{
    var tempScore = score;
    score += prevScore;
    prevScore = tempScore;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight-10, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "grey";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "grey";
    ctx.fillText("SCORE: ", canvas.width-100, 20);
    ctx.fillStyle = "orange";
    ctx.fillText(score, canvas.width-35, 20);
}
function drawLives() {
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "grey";
    ctx.fillText("LIVES:", 9, 20);
    for(i = 0;i<lives;++i)
        drawLife(i);
}

function drawLife(i)
{
    ctx.beginPath();
    ctx.rect( (70+i*40), 7, brickWidth, brickHeight);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > (canvas.height-ballRadius-10) ) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
draw();