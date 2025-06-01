const board = document.querySelectorAll(".cell");
let currentPlayer = "X";
let gameActive = false;
let gameMode = "";  // "ai" or "player"
let gameState = ["", "", "", "", "", "", "", "", ""];
const humanPlayer = "X";
const aiPlayer = "O";

function startGame(mode) {
    gameMode = mode;
    document.getElementById("mode-selection").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    resetGame();
    gameActive = true;
}

function handleClick(event) {
    if (!gameActive || gameMode === "") return;

    const index = event.target.dataset.index;
    if (gameState[index] !== "" || (gameMode === "ai" && currentPlayer === aiPlayer)) return;

    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        document.getElementById("status").textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        document.getElementById("status").textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (gameMode === "ai" && currentPlayer === aiPlayer) {
        setTimeout(aiMove, 500); // AI takes time to think
    }
}

function aiMove() {
    let bestMove = minimax(gameState, aiPlayer).index;
    gameState[bestMove] = aiPlayer;
    board[bestMove].textContent = aiPlayer;

    if (checkWin()) {
        document.getElementById("status").textContent = "AI wins!";
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        document.getElementById("status").textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = humanPlayer;
}

function minimax(state, player) {
    const openSpots = state.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWinFor(state, humanPlayer)) return { score: -10 };
    if (checkWinFor(state, aiPlayer)) return { score: 10 };
    if (openSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i of openSpots) {
        let newState = [...state];
        newState[i] = player;
        let result = minimax(newState, player === humanPlayer ? aiPlayer : humanPlayer);
        moves.push({ index: i, score: result.score });
    }

    return moves.reduce((best, move) => player === aiPlayer 
        ? (move.score > best.score ? move : best) 
        : (move.score < best.score ? move : best));
}

function checkWin() {
    return checkWinFor(gameState, currentPlayer);
}

function checkWinFor(state, player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],  
        [0,3,6], [1,4,7], [2,5,8],  
        [0,4,8], [2,4,6]            
    ];

    return winPatterns.some(pattern => pattern.every(index => state[index] === player));
}

function resetGame() {
    gameState.fill("");
    board.forEach(cell => cell.textContent = "");
    document.getElementById("status").textContent = "";
    gameActive = true;
    currentPlayer = humanPlayer;
}

board.forEach(cell => cell.addEventListener("click", handleClick));