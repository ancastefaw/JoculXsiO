const board = document.getElementById('board');
const cells = board.querySelectorAll('[data-cell]');
let currentPlayer = 'X';
const computerPlayer = 'O';
let isGameActive = true;

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    if (!isGameActive) return;

    const cell = event.target;
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        if (checkWin(currentPlayer)) {
            setTimeout(() => {
                alert(`${currentPlayer} a câștigat!`);
            }, 10); // Delay for visual update before showing the alert
            isGameActive = false;
        } else if (checkDraw()) {
            setTimeout(() => {
                alert("Remiză!");
            }, 10); // Delay for visual update before showing the alert
            isGameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === computerPlayer) {
                setTimeout(makeComputerMove, 500); // Delay for visual update before computer move
            }
        }
    }
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => cells[index].textContent === player);
    });
}

function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function resetGame() {
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    isGameActive = true;
}

function makeComputerMove() {
    let bestScore = -Infinity;
    let move;

    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            cell.textContent = computerPlayer;
            let score = minimax(cells, 0, false);
            cell.textContent = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    cells[move].textContent = computerPlayer;
    currentPlayer = 'X';
}

const scores = {
    X: -10,
    O: 10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    if (checkWin('X')) {
        return scores.X - depth;
    } else if (checkWin('O')) {
        return scores.O - depth;
    } else if (checkDraw()) {
        return scores.tie;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell.textContent === '') {
                cell.textContent = computerPlayer;
                let score = minimax(board, depth + 1, false);
                cell.textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                let score = minimax(board, depth + 1, true);
                cell.textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}
