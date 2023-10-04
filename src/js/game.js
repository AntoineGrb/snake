const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//! A compléter
const eatSound = new Audio(''); 
const deadSound = new Audio('');

//#region ---------- CONDITIONS INITIALES ----------------

let gameInterval;

//*Le serpent
//Dimensions du serpent
canvas.width = 500;
canvas.height = 500;
const snakeSize = 25;

// Position initiale du serpent
let snakeX = canvas.width / 2;
let snakeY = canvas.height / 2;

//Taille du serpent (le serpent est un tableau de segment)
let snake = [
    {x: 250, y: 250},
    {x: 230, y: 250},
    {x: 210, y: 250},
    {x: 190, y: 250},
];

//Déplacement du serpent
let dx = snakeSize; // déplacement horizontal
let dy = 0; // déplacement vertical

//*Les pommes
//Création des pommes
let appleX = getRandomCoordinate();
let appleY = getRandomCoordinate();

//*Le score
let score = 0;
displayHighScore();

//#endregion

//#region ---------- FONCTIONS ---------------------------

//*Gérer le serpent
//Dessiner un segment du serpent
function drawSnakeSegment(segment, color = 'white') {
    ctx.fillStyle = color; //L'interieur du serpent
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    ctx.strokeStyle = "green"; //Le contour du serpent
    ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
}

//Dessiner chaque segment du serpent à chaque fois
function drawSnake() {
    snake.forEach((segment, index) => {
        let color = index === 0 ? "green" : "white";  // Si le segment est la tête du serpent, utiliser la couleur verte. Sinon, utiliser la couleur blanche.
        drawSnakeSegment(segment, color);
    });
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

//*Gérer les pommes
//Dessiner les pommes
function drawApple() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(appleX + snakeSize / 2, appleY + snakeSize / 2, snakeSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "darkred";  // Couleur du contour
    ctx.lineWidth = 1;  // Epaisseur du contour
    ctx.stroke();
}

//Faire apparaitre aléatoirement les pommes
function getRandomCoordinate() {
    return Math.floor((Math.random() * canvas.width) / snakeSize) * snakeSize;
}

//Détecter les collisions avec les pommes
function checkAppleCollision() {
    console.log(`Apple: (${appleX}, ${appleY})`);
    console.log(`Snake head: (${snake[0].x}, ${snake[0].y})`);
    if (snake[0].x === appleX && snake[0].y === appleY) {
        eatSound.play();

        // Code pour déplacer la pomme lorsqu'elle est mangée
        appleX = getRandomCoordinate();
        appleY = getRandomCoordinate();
        snake.push({}); //Ajouter un nouveau segment au serpent
        score++;
    }
}

//*Gérer le score
//Afficher le score en cours de partie
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, canvas.width - 150, 30);
}

//Sauvegarder le score
function saveScore() {
    // Récupérer le meilleur score de localStorage
    const highScore = parseInt(localStorage.getItem('highScore')) || 0;

    // Comparer le score actuel avec le meilleur score et le mettre à jour si nécessaire
    if (score > highScore) {
        localStorage.setItem('highScore', score.toString());
    }
}

//Afficher le meilleur score en fin de partie
function displayHighScore() {
    // Récupérer le meilleur score de localStorage
    const highScore = localStorage.getItem('highScore') || "0";

    // Sélectionner la div et mettre à jour le texte
    document.getElementById('highScoreDisplay').innerText = 'Best Score: ' + highScore;
}

//Reset le meilleur score
function resetHighScore() {
    // Remettre le meilleur score à 0 dans localStorage
    localStorage.setItem('highScore', '0');
    
    // Mettre à jour l'affichage du score sur la page
    displayHighScore();
}


//*Gérer les conditions de fin du jeu
//Détecter les collisions avec les murs
function checkCollisionWithWalls() {
    if (
        snake[0].x < 0 || 
        snake[0].x >= canvas.width || 
        snake[0].y < 0 || 
        snake[0].y >= canvas.height
    ) {
        return true;
    }
    return false;
}

//Détecter les collisions avec soi-même
function checkCollisionWithSelf() {
    for (let i = 4; i < snake.length; i++) {
        if (
            snake[i].x === snake[0].x && 
            snake[i].y === snake[0].y
        ) {
            return true;
        }
    }
    return false;
}

//GameOver
function checkGameOver() {
    if (checkCollisionWithWalls() || checkCollisionWithSelf()) {
        deadSound.play();

        //Gestion du meilleur score
        saveScore();
        displayHighScore();

        clearInterval(gameInterval);
        
        // Afficher une boîte de dialogue pour rejouer
        const isReplaying = confirm("Game Over! Voulez-vous rejouer ?");
        
        if (isReplaying) {
            // Remettre le jeu à ses conditions initiales et redémarrer
            resetGame();
            gameInterval = setInterval(draw, 100); // Redémarrer l'animation du jeu
        }
    }
}

//Reset le jeu avec conditions initiales
function resetGame() {
    // Réinitialiser toutes vos variables de jeu aux conditions initiales
    snake = [
        {x: 250, y: 250},
        {x: 240, y: 250},
        {x: 230, y: 250},
        {x: 220, y: 250},
    ];
    dx = snakeSize;
    dy = 0;
    score = 0;
    appleX = getRandomCoordinate();
    appleY = getRandomCoordinate();
}

//*Gérer le jeu
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

    //Maj le score
    drawScore();

    //Vérifier si le jeu est terminé
    checkGameOver();
}
//#endregion

//#region ---------- LE JEU ------------------------------

//Détecter les changements de direction
window.addEventListener("keydown", changeDirection);

//Faire avancer le serpent toutes les X secondes
gameInterval = setInterval(draw, 100);

//Reset le meilleur score
document.getElementById("resetButton").addEventListener("click", resetHighScore);

//#endregion




