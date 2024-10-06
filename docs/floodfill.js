"use strict";

(() => {
  window.addEventListener("load", (event) => {
    console.log(event);
    // *****************************************************************************
    // #region Constants and Variables

    // Canvas references
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // UI references
    const restartButton = document.querySelector("#restart");
    const undoButton = document.querySelector("#undo");

    // Constants
    const CELLS_PER_AXIS = 3;
    const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
    const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;

    // Game objects
    let grids;
    let lastMove = null; // To store only the last move
    let currentPlayer = "X";
    let gameOver = false;

    // #endregion

    // *****************************************************************************
    // #region Game Logic

    function startGame() {
      grids = initializeGrid();
      render(grids);
      gameOver = false;
      currentPlayer = "X"; // X always starts first
      lastMove = null; // Clear last move on new game
    }

    function initializeGrid() {
      const newGrid = [];
      for (let i = 0; i < CELLS_PER_AXIS * CELLS_PER_AXIS; i++) {
        newGrid.push("");
      }
      return newGrid;
    }

    function render(grid) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each render
      for (let i = 0; i < grid.length; i++) {
        const col = i % CELLS_PER_AXIS;
        const row = Math.floor(i / CELLS_PER_AXIS);
        const xPos = col * CELL_WIDTH;
        const yPos = row * CELL_HEIGHT;

        ctx.strokeStyle = "black";
        ctx.strokeRect(xPos, yPos, CELL_WIDTH, CELL_HEIGHT);

        // Draw X or O
        if (grid[i]) {
          ctx.font = "48px Arial";
          ctx.fillText(
            grid[i],
            xPos + CELL_WIDTH / 3,
            yPos + CELL_HEIGHT / 1.5
          );
        }
      }
    }

    function updateGridAt(mouseX, mouseY) {
      if (gameOver) return; // Prevent moves after the game is over

      const gridCoordinates = convertCartesiansToGrid(mouseX, mouseY);
      const index =
        gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;

      if (grids[index] === "") {
        // Only mark if the cell is empty
        lastMove = grids.slice(); // Save the current grid state to lastMove
        grids[index] = currentPlayer;
        render(grids);

        if (checkWinCondition()) {
          alert(`${currentPlayer} wins!`);
          gameOver = true;
        } else if (grids.every((cell) => cell !== "")) {
          alert("It's a tie!");
          gameOver = true;
        } else {
          currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        }
      }
    }

    function checkWinCondition() {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
      ];

      return winPatterns.some((pattern) => {
        return (
          grids[pattern[0]] !== "" &&
          grids[pattern[0]] === grids[pattern[1]] &&
          grids[pattern[1]] === grids[pattern[2]]
        );
      });
    }

    function convertCartesiansToGrid(xPos, yPos) {
      return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT),
      };
    }

    function restart() {
      startGame();
    }

    function undoLastMove() {
      if (lastMove) {
        grids = lastMove.slice(); // Restore the last move
        lastMove = null; // Clear last move, so undo can only happen once
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch back to the previous player
        render(grids); // Re-render the grid with the previous state
        gameOver = false; // Allow the game to continue after undo
      }
    }

    // #region Event Listeners

    canvas.addEventListener("mousedown", (event) => {
      updateGridAt(event.offsetX, event.offsetY);
    });

    restartButton.addEventListener("mousedown", restart);

    undoButton.addEventListener("mousedown", undoLastMove);

    // #endregion

    // Start game
    startGame();
  });
})();
