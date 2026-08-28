// ==========================================
// MAZE MAYHEM
// ==========================================


// ---------- SETTINGS ----------

const ROWS = 21;
const COLS = 21;

let maze = [];
let player = {
    row: 1,
    col: 1
};

let finish = {
    row: ROWS - 2,
    col: COLS - 2
};

let selectedAnimal = "🐱";

let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;


// ---------- ELEMENTS ----------

const mazeElement = document.getElementById("maze");

const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");

const characterPanel = document.getElementById("characterPanel");
const gameSection = document.getElementById("gameSection");

const startBtn = document.getElementById("startBtn");
const newMazeBtn = document.getElementById("newMazeBtn");

const suspenseScreen = document.getElementById("suspenseScreen");
const rewardScreen = document.getElementById("rewardScreen");

const memeVideo = document.getElementById("memeVideo");

const closeReward = document.getElementById("closeReward");
const playAgainBtn = document.getElementById("playAgainBtn");


// ==========================================
// CHARACTER SELECTION
// ==========================================

document.querySelectorAll(".character").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".character")
            .forEach(btn => btn.classList.remove("selected"));

        button.classList.add("selected");

        selectedAnimal = button.dataset.animal;

    });

});


// ==========================================
// START GAME
// ==========================================

startBtn.addEventListener("click", () => {

    characterPanel.classList.add("hidden");
    gameSection.classList.remove("hidden");

    startGame();

});


// ==========================================
// START / RESET GAME
// ==========================================

function startGame() {

    stopTimer();

    moves = 0;
    seconds = 0;

    movesElement.textContent = "0";
    timerElement.textContent = "00:00";

    gameStarted = true;

    generateMaze();

    drawMaze();

    startTimer();

}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    stopTimer();

    timerInterval = setInterval(() => {

        seconds++;

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        timerElement.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0");

    }, 1000);

}


function stopTimer() {

    if (timerInterval) {

        clearInterval(timerInterval);

        timerInterval = null;

    }

}


// ==========================================
// GENERATE MAZE
// ==========================================

function generateMaze() {

    maze = [];

    // Fill everything with walls

    for (let row = 0; row < ROWS; row++) {

        maze[row] = [];

        for (let col = 0; col < COLS; col++) {

            maze[row][col] = 1;

        }

    }

    // Recursive backtracking

    carvePath(1, 1);

    player.row = 1;
    player.col = 1;

}


// ==========================================
// CARVE MAZE
// ==========================================

function carvePath(row, col) {

    maze[row][col] = 0;

    const directions = [
        [0, 2],
        [2, 0],
        [0, -2],
        [-2, 0]
    ];

    shuffle(directions);

    for (const [dr, dc] of directions) {

        const newRow = row + dr;
        const newCol = col + dc;

        if (
            newRow > 0 &&
            newRow < ROWS - 1 &&
            newCol > 0 &&
            newCol < COLS - 1 &&
            maze[newRow][newCol] === 1
        ) {

            maze[row + dr / 2][col + dc / 2] = 0;

            carvePath(newRow, newCol);

        }

    }

}


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];

    }

}


// ==========================================
// DRAW MAZE
// ==========================================

function drawMaze() {

    mazeElement.innerHTML = "";

    mazeElement.style.gridTemplateColumns =
        `repeat(${COLS}, 1fr)`;

    mazeElement.style.gridTemplateRows =
        `repeat(${ROWS}, 1fr)`;


    for (let row = 0; row < ROWS; row++) {

        for (let col = 0; col < COLS; col++) {

            const cell = document.createElement("div");

            cell.classList.add("cell");

            if (maze[row][col] === 1) {

                cell.classList.add("wall");

            } else {

                cell.classList.add("path");

            }


            // Finish

            if (
                row === finish.row &&
                col === finish.col
            ) {

                cell.classList.add("finish");

                cell.textContent = "🏆";

            }


            // Player

            if (
                row === player.row &&
                col === player.col
            ) {

                cell.classList.add("player");

                cell.textContent = selectedAnimal;

            }


            mazeElement.appendChild(cell);

        }

    }

}


// ==========================================
// MOVE PLAYER
// ==========================================

function movePlayer(dr, dc) {

    if (!gameStarted) return;

    const newRow = player.row + dr;
    const newCol = player.col + dc;


    // Outside maze

    if (
        newRow < 0 ||
        newRow >= ROWS ||
        newCol < 0 ||
        newCol >= COLS
    ) {

        return;

    }


    // Wall

    if (maze[newRow][newCol] === 1) {

        // Small shake effect

        mazeElement.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-3px)" },
                { transform: "translateX(3px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 100
            }
        );

        return;

    }


    player.row = newRow;
    player.col = newCol;

    moves++;

    movesElement.textContent = moves;

    drawMaze();


    // WIN

    if (
        player.row === finish.row &&
        player.col === finish.col
    ) {

        completeMaze();

    }

}


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", event => {

    if (!gameStarted) return;

    let direction = null;

    switch (event.key.toLowerCase()) {

        case "arrowup":
        case "w":
            direction = [-1, 0];
            break;

        case "arrowdown":
        case "s":
            direction = [1, 0];
            break;

        case "arrowleft":
        case "a":
            direction = [0, -1];
            break;

        case "arrowright":
        case "d":
            direction = [0, 1];
            break;

    }


    if (direction) {

        event.preventDefault();

        movePlayer(
            direction[0],
            direction[1]
        );

    }

});


// ==========================================
// MOBILE CONTROLS
// ==========================================

document.querySelectorAll(".control").forEach(button => {

    button.addEventListener("click", () => {

        const direction =
            button.dataset.direction;

        switch (direction) {

            case "up":
                movePlayer(-1, 0);
                break;

            case "down":
                movePlayer(1, 0);
                break;

            case "left":
                movePlayer(0, -1);
                break;

            case "right":
                movePlayer(0, 1);
                break;

        }

    });

});


// ==========================================
// NEW MAZE
// ==========================================

newMazeBtn.addEventListener("click", () => {

    startGame();

});


// ==========================================
// COMPLETE MAZE
// ==========================================

function completeMaze() {

    gameStarted = false;

    stopTimer();

    createConfetti();

    suspenseScreen.classList.remove("hidden");


    // Give the player a little suspense

    setTimeout(() => {

        suspenseScreen.classList.add("hidden");

        showReward();

    }, 2300);

}


// ==========================================
// SHOW REWARD
// ==========================================

function showReward() {

    rewardScreen.classList.remove("hidden");

    memeVideo.currentTime = 0;

    // Browsers generally allow video playback
    // after a user interaction with the page.

    memeVideo.play().catch(() => {

        console.log(
            "Autoplay was blocked. Press play on the video."
        );

    });

}


// ==========================================
// CLOSE REWARD
// ==========================================

closeReward.addEventListener("click", () => {

    memeVideo.pause();

    rewardScreen.classList.add("hidden");

});


// ==========================================
// PLAY AGAIN
// ==========================================

playAgainBtn.addEventListener("click", () => {

    memeVideo.pause();

    memeVideo.currentTime = 0;

    rewardScreen.classList.add("hidden");

    startGame();

});


// ==========================================
// CONFETTI
// ==========================================

function createConfetti() {

    const container =
        document.getElementById("confetti");

    container.innerHTML = "";

    const emojis = [
        "🎉",
        "✨",
        "⭐",
        "🎊",
        "💜",
        "💛",
        "💙",
        "🩷"
    ];


    for (let i = 0; i < 80; i++) {

        const piece =
            document.createElement("div");

        piece.classList.add("confetti");

        piece.textContent =
            emojis[Math.floor(
                Math.random() * emojis.length
            )];

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        piece.style.animationDelay =
            Math.random() * .7 + "s";

        piece.style.fontSize =
            (10 + Math.random() * 15) + "px";

        container.appendChild(piece);

    }


    setTimeout(() => {

        container.innerHTML = "";

    }, 5500);

}