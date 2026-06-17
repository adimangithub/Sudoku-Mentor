const board = document.getElementById("board");
const message = document.getElementById("message");

const hint1Btn = document.getElementById("hint1");
const hint2Btn = document.getElementById("hint2");
const solveBtn = document.getElementById("solve");
const clearBtn = document.getElementById("clear");
const randomBtn = document.getElementById("random");

let selectedHintCell = null;
let solvedBoard = null;

const puzzles = [
  [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ],
  [
    [0,0,0,2,6,0,7,0,1],
    [6,8,0,0,7,0,0,9,0],
    [1,9,0,0,0,4,5,0,0],
    [8,2,0,1,0,0,0,4,0],
    [0,0,4,6,0,2,9,0,0],
    [0,5,0,0,0,3,0,2,8],
    [0,0,9,3,0,0,0,7,4],
    [0,4,0,0,5,0,0,3,6],
    [7,0,3,0,1,8,0,0,0]
  ],
  [
    [0,2,0,6,0,8,0,0,0],
    [5,8,0,0,0,9,7,0,0],
    [0,0,0,0,4,0,0,0,0],
    [3,7,0,0,0,0,5,0,0],
    [6,0,0,0,0,0,0,0,4],
    [0,0,8,0,0,0,0,1,3],
    [0,0,0,0,2,0,0,0,0],
    [0,0,9,8,0,0,0,3,6],
    [0,0,0,3,0,6,0,9,0]
  ]
];

function createBoard() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement("input");
    input.classList.add("cell");
    input.maxLength = 1;

    input.addEventListener("input", () => {
      if (!/^[1-9]$/.test(input.value)) {
        input.value = "";
      }

      resetHints();
      checkWin();
    });

    board.appendChild(input);
  }
}

function getBoardValues() {
  const cells = document.querySelectorAll(".cell");
  const grid = [];

  for (let row = 0; row < 9; row++) {
    grid[row] = [];

    for (let col = 0; col < 9; col++) {
      const value = cells[row * 9 + col].value;
      grid[row][col] = value === "" ? 0 : Number(value);
    }
  }

  return grid;
}

function clearHighlights() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("hint-cell");
  });
}

function highlightCell(row, col) {
  clearHighlights();
  const cells = document.querySelectorAll(".cell");
  cells[row * 9 + col].classList.add("hint-cell");
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.classList.remove("error", "success");

  if (type) {
    message.classList.add(type);
  }
}

randomBtn.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  const puzzle = copyGrid(puzzles[randomIndex]);

  setBoardValues(puzzle, true);
  resetHints();

  showMessage("Random puzzle loaded. Good luck!", "success");
});

function setBoardValues(grid, lockGiven = false) {
  const cells = document.querySelectorAll(".cell");

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = cells[row * 9 + col];
      const value = grid[row][col];

      cell.value = value === 0 ? "" : value;
      cell.classList.remove("given", "hint-cell");

      if (lockGiven && value !== 0) {
        cell.disabled = true;
        cell.classList.add("given");
      } else {
        cell.disabled = false;
      }
    }
  }
}

function isValidPlacement(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) {
              return true;
            }

            grid[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
}

function copyGrid(grid) {
  return grid.map(row => [...row]);
}

function resetHints() {
  hint2Btn.disabled = true;
  selectedHintCell = null;
  solvedBoard = null;
  clearHighlights();
  showMessage("");
}

function isBoardValid(grid) {
  for (let row = 0; row < 9; row++) {
    const seen = new Set();

    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];

      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  for (let col = 0; col < 9; col++) {
    const seen = new Set();

    for (let row = 0; row < 9; row++) {
      const num = grid[row][col];

      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set();

      for (let row = boxRow; row < boxRow + 3; row++) {
        for (let col = boxCol; col < boxCol + 3; col++) {
          const num = grid[row][col];

          if (num !== 0) {
            if (seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
  }

  return true;
}

function isBoardFull(grid) {
  return grid.every(row => row.every(num => num !== 0));
}

function checkWin() {
  const currentBoard = getBoardValues();

  if (isBoardFull(currentBoard) && isBoardValid(currentBoard)) {
    showMessage("Congratulations! You solved the puzzle!", "success");
    clearHighlights();
  }
}

hint1Btn.addEventListener("click", () => {
  const currentBoard = getBoardValues();
  if (!isBoardValid(currentBoard)) {
    showMessage("Invalid Sudoku: duplicate numbers found in a row, column, or 3x3 box.", "error");
  return;
}
  const boardCopy = copyGrid(currentBoard);

  if (!solveSudoku(boardCopy)) {
    showMessage("This Sudoku puzzle cannot be solved.", "error");
    return;
  }

  solvedBoard = boardCopy;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (currentBoard[row][col] === 0) {
        selectedHintCell = { row, col };

        const possibleValues = [];

        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(currentBoard, row, col, num)) {
            possibleValues.push(num);
          }
        }

        highlightCell(row, col);
        showMessage(`Hint 1: Possible values for the highlighted cell are ${possibleValues.join(", ")}.`);
        hint2Btn.disabled = false;
        return;
      }
    }
  }

  message.textContent = "The board is already complete.";
});

hint2Btn.addEventListener("click", () => {
  if (!selectedHintCell || !solvedBoard) return;

  const { row, col } = selectedHintCell;
  const answer = solvedBoard[row][col];
  highlightCell(row, col);
  showMessage(`Hint 2: Row ${row + 1}, Column ${col + 1} should be changed to ${answer}.`);
});

solveBtn.addEventListener("click", () => {
  const currentBoard = getBoardValues();
  if (!isBoardValid(currentBoard)) {
  message.textContent = "Invalid Sudoku: there are duplicate numbers in a row, column, or 3x3 box.";
  return;
}
  const boardCopy = copyGrid(currentBoard);

  if (solveSudoku(boardCopy)) {
    setBoardValues(boardCopy);
    showMessage("Sudoku solved!", "success");
  } else {
    showMessage("This Sudoku puzzle cannot be solved.", "error");
  }
});

clearBtn.addEventListener("click", () => {
  setBoardValues(Array.from({ length: 9 }, () => Array(9).fill(0)), false);
  resetHints();
  showMessage("Board cleared.");
});

createBoard();