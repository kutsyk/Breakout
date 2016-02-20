var canvas = document.getElementById("404Canvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;

var dx = 0;
var dy = 0;

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

var colors = [
 "#FF0000","#FF4000","#FF8000","#FFC100","#FCFF00","#BBFF00","#7BFF00","#3AFF00","#00FF05","#00FF45","#00FF86","#00FFC6","#00F6FF","#00B6FF","#0075FF","#0035FF","#0A00FF","#4B00FF","#8B00FF","#CC00FF","#FF00F1","#FF00B0","#FF0070"
]

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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return colors[Math.floor(Math.random() * 32)];
}

for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {

        if(gameMap[c][r] ==  1)
            bricks[c][r] = { x: 0, y: 0, status: 1, color: "grey" };
        else
            bricks[c][r] = { x: 0, y: 0, status: 0, color: "grey" };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);



function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }else if(e.keyCode == 32)
        mouseDownHandler(e);
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
        if(dy == 0)
            x = paddleX + paddleWidth/2;
    }
}

function mouseDownHandler(e) {
    if(y > canvas.height-paddleHeight-ballRadius*2 - 10)
    {
        dx = 2;
        dy = -2;
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
    if(dy == 0)
    {
        ctx.arc(paddleX + paddleWidth/2, y, ballRadius, 0, Math.PI*2);
    }else
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    if(rightPressed && paddleX < canvas.clientWidth - paddleWidth/2)
        paddleX += 3;
    else if(leftPressed && paddleX > -paddleWidth/2)
        paddleX -= 3;
    ctx.rect(paddleX, canvas.height-paddleHeight-10, paddleWidth, paddleHeight);
    if(dy == 0)
        x = paddleX + paddleWidth/2;
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
                ctx.fillStyle = getRandomColor();
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
                dx = 0;
                dy = 0;
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