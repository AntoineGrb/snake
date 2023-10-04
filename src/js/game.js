const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//*--- CONDITIONS INITIALES ---

//Dimensions du serpent
canvas.width = 500;
canvas.height = 500;
const snakeSize = 10;

// Position initiale du serpent
let snakeX = canvas.width / 2;
let snakeY = canvas.height / 2;

//Taille du serpent (le serpent est un tableau de segment)
let snake = [
    {x: 250, y: 250},
    {x: 240, y: 250},
    {x: 230, y: 250},
    {x: 220, y: 250},
];

//Déplacement du serpent
let dx = snakeSize; // déplacement horizontal
let dy = 0; // déplacement vertical

//Création des pommes
let appleX = getRandomCoordinate();
let appleY = getRandomCoordinate();

//*--- FONCTIONS ---

//Dessiner un segment du serpent
function drawSnakeSegment(segment) {
    ctx.fillStyle = "white";
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
}

//Dessiner chaque segment du serpent à chaque fois
function drawSnake() {
    snake.forEach(drawSnakeSegment);
}

//Déplacer le serpent en ajoutant un nouveau segment et retirant un autre
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

//Contrôler le serpent en fonction des touches du clavier
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeSize;
    }
}

//Dessiner les pommes
function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX, appleY, snakeSize, snakeSize);
}

//Faire apparaitre aléatoirement les pommes
function getRandomCoordinate() {
    return Math.floor((Math.random() * canvas.width) / snakeSize) * snakeSize;
}

//Détecter les collisions avec les pommes
function checkAppleCollision() {
    if (snake[0].x === appleX && snake[0].y === appleY) {
        // Code pour déplacer la pomme lorsqu'elle est mangée
        appleX = getRandomCoordinate();
        appleY = getRandomCoordinate();
    }
}

//La fonction de coeur du jeu, qui fait bouger et dessine le serpent
function draw() {
    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Déplacer le serpent
    moveSnake();

    // Dessiner le serpent
    drawSnake();
    
    // Dessiner la pomme
    drawApple();

    // Vérifier si le serpent a mangé la pomme
    checkAppleCollision();
}


//*--- LE JEU ---

//Détecter les changements de direction
window.addEventListener("keydown", changeDirection);

//Faire avancer le serpent toutes les X secondes
setInterval(draw, 200);


