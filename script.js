window.onload = function() {

    var canvas;
    var ctx;
    var delay = 100;
    var canvasWidth = 900;
    var canvasheight = 600;
    var blockSize = 30;
    var snakee;
    var applee;

    //Exprimer en block 
    var widthInBlock = canvasWidth / blockSize;
    var heightInBlock = canvasheight / blockSize;
    var score;
    var timeout;

    //Init Canvas
    function init() {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasheight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],

        ], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();

    }

    function refreshCanvas() {
        snakee.adavance();
        console.log(snakee.checkCollision());
        if (snakee.checkCollision()) {
            gameOver();
            console.log("game over");
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.eatApple = true;
                //console.log(snakee.isEatingApple(applee));
                //applee.setNewPosition();
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee))

            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snakee.draw();
            applee.draw();
            drawScore()
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    function drawScore() {
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasheight - 5);
        ctx.restore();
    }

    function gameOver() {
        ctx.save();
        ctx.fillText("GameOver", 5, 15);
        ctx.fillText("Appuyer sur la touche espace pour rejouer", 5, 30);

        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        //console.log(this.direction);
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.adavance = function() {
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw ("Invalide Direction");

            }
            this.body.unshift(nextPosition);
            if (!this.eatApple) {
                this.body.pop();
            } else
                this.eatApple = false;
        };
        this.setDirection = function(newDirection) {
            var allowDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowDirections = ["up", "down"];
                    break;

                case "down":
                case "up":
                    allowDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalide Direction");

            }
            if (allowDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.checkCollision = function() {
            var wallCollection = false;
            var snakeCollsion = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontalWalts = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalts = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWalts || isNotBetweenVerticalWalts) {
                wallCollection = true;
            };

            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollsion = true;
                }
            }
            return wallCollection || snakeCollsion;
        };

        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        }

    }

    function restart() {
        // console.log("la")
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],

        ], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();

    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            //console.log("litissia");
            this.position = [newX, newY];


        }
        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;

            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }

    }

    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        console.log(key);
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                //console.log("la");
                restart();
                return;

            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
    init();


}