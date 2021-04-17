const gameBoardModule = (function () {
  let gameBoard = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let currentPlayer = 1; // player 1 plays first by default
  let gameWinner = 0; // 0 is tie, 1 is player 1 wins, 2 is player 2 wins
  function getGameBoard() {
    return gameBoard;
  }
  function getWinner() {
    return gameWinner;
  }
  function getCurrentPlayer() {
    return currentPlayer;
  }
  function setCurrentPlayer(currentPlayerParam) {
    currentPlayer = currentPlayerParam;
  }
  function isBoardFull(gameBoard = getGameBoard()) {
    for (let i = 0; i < gameBoard.length; i++) {
      if (/[A-I]/.test(gameBoard[i])) return false;
    }
    return true;
  }
  function checkForWinner() {
    //write logic to check is game is over and update gameWinner with winning Player'd ID;
    gameWinner = 0;
    for (
      let i = 0;
      i <= 6;
      i = i + 3 //checks if a row has same elements
    ) {
      if (
        gameBoard[i] === gameBoard[i + 1] &&
        gameBoard[i + 1] == gameBoard[i + 2]
      ) {
        if (gameBoard[i] == "X") gameWinner = 1;
        else if (gameBoard[i] == "O") gameWinner = 2;
        displayControllerModule.highlightWin(i / 3, -1, -1); //i values are 0,3,6 so i/3 tells highlightWin to highlight row number (i/3)
      }
    }
    for (
      let i = 0;
      i < 3;
      i++ //checks if a column has same elements
    ) {
      if (
        gameBoard[i] === gameBoard[i + 3] &&
        gameBoard[i + 3] == gameBoard[i + 6]
      ) {
        if (gameBoard[i] == "X") gameWinner = 1;
        else if (gameBoard[i] == "O") gameWinner = 2;
        displayControllerModule.highlightWin(-1, i, -1);
      }
    }
    if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8]) {
      //checks first diagonal
      if (gameBoard[0] == "X") gameWinner = 1;
      else if (gameBoard[0] == "O") gameWinner = 2;
      displayControllerModule.highlightWin(-1, -1, 0);
    }
    if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6]) {
      //checks second diagonal
      if (gameBoard[2] == "X") gameWinner = 1;
      else if (gameBoard[2] == "O") gameWinner = 2;
      displayControllerModule.highlightWin(-1, -1, 1);
    }
    if (isBoardFull()) {
      if (gameWinner === 0) {
        //no winner and board is full
        //alert(`It's a tie`);
        displayControllerModule.updateDisplay(false, true);
        displayControllerModule.setIsPlayable(false);
      }
    }
    return gameWinner;
  }
  function modifyBoard(position, value) {
    gameBoard[position] = value;
    if (value === "X")
      //switch the players
      gameBoardModule.setCurrentPlayer(2);
    else gameBoardModule.setCurrentPlayer(1);
    displayControllerModule.updateDisplay();
    let winner = checkForWinner();
    if (winner !== 0) {
      // one of the players won
      //     alert(`${gameBoardModule.getCurrentPlayer()} wins!`);
      displayControllerModule.setIsPlayable(false); //disable the board
      displayControllerModule.updateDisplay(); // now that gameWinner is determined, update the display to show the winners
    }
  }
  function gameBoardReset() {
    gameBoard = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    currentPlayer = 1;
    gameWinner = 0;
    displayControllerModule.setIsPlayable(true);
  }
  return {
    modifyBoard,
    getCurrentPlayer,
    setCurrentPlayer,
    gameBoardReset,
    getGameBoard,
    getWinner,
    isBoardFull,
  };
})();

const displayControllerModule = (function () {
  let isPlayable = true;

  function setIsPlayable(value) {
    isPlayable = value;
  }
  function highlightWin(
    rowNumber = -1,
    columnNumber = -1,
    diagonalNumber = -1
  ) {
    if (rowNumber !== -1) {
      let rowArray = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ];
      rowArray[rowNumber].forEach((rowElement) => {
        let currentDiv = document.querySelector(`#square-${rowElement}`);
        currentDiv.classList.add("highlight");
      });
    } else if (columnNumber !== -1) {
      let colArray = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ];
      colArray[columnNumber].forEach((columnElement) => {
        let currentDiv = document.querySelector(`#square-${columnElement}`);
        currentDiv.classList.add("highlight");
      });
    } else if (diagonalNumber !== -1) {
      let diagonalArray = [
        [0, 4, 8],
        [2, 4, 6],
      ];
      diagonalArray[diagonalNumber].forEach((diagonalElement) => {
        let currentDiv = document.querySelector(`#square-${diagonalElement}`);
        currentDiv.classList.add("highlight");
      });
    }
  }
  function updateDisplay(reset = false, tie = false) {
    if (tie === true) {
      document.querySelectorAll(".game-square").forEach((square) => {
        square.classList.add("highlight");
      });
      document
        .querySelector("#player-2-details")
        .classList.add("active-player");
      document
        .querySelector("#player-1-details")
        .classList.add("active-player");
    } else {
      let gameBoard = gameBoardModule.getGameBoard();
      document.querySelectorAll(".game-square").forEach((square) => {
        let gameBoardElement = gameBoard[square.getAttribute("value")]; // get the corresponding element on the gameBoard array
        if (gameBoardElement == "X" || gameBoardElement == "O") {
          // gameboard[index] contains X or O, ie. none of the default filler values A to I
          square.innerText = gameBoardElement;
        } else {
          square.innerText = "";
        }
      });
      let currentPlayer = gameBoardModule.getCurrentPlayer();
      let gameWinner = gameBoardModule.getWinner();
      if (gameWinner !== 0) {
        //game has ended
        document
          .querySelector("#player-2-details")
          .classList.remove("active-player");
        document
          .querySelector("#player-1-details")
          .classList.remove("active-player");
        if (gameWinner == 1) {
          document
            .querySelector("#player-2-details")
            .classList.add("losing-player");
          document
            .querySelector("#player-1-details")
            .classList.add("winning-player");
        } else if (gameWinner == 2) {
          document
            .querySelector("#player-2-details")
            .classList.add("winning-player");
          document
            .querySelector("#player-1-details")
            .classList.add("losing-player");
        }
        return;
      } else {
        //game is still ongoing
        document
          .querySelector("#player-2-details")
          .classList.toggle("active-player");
        document
          .querySelector("#player-1-details")
          .classList.toggle("active-player");
      }
      if (reset === true) {
        document.querySelectorAll(".game-square").forEach((square) => {
          square.classList.remove("highlight");
          square.innerText = "";
        });
        document
          .querySelector("#player-1-details")
          .classList.remove("losing-player");
        document
          .querySelector("#player-2-details")
          .classList.remove("losing-player");
        document
          .querySelector("#player-1-details")
          .classList.remove("winning-player");
        document
          .querySelector("#player-2-details")
          .classList.remove("winning-player");
        document
          .querySelector("#player-1-details")
          .classList.add("active-player");
        document
          .querySelector("#player-2-details")
          .classList.remove("active-player");
      }
    }
  }
  function setUpButtonListeners() {
    document.querySelectorAll(".game-square").forEach((square) => {
      square.addEventListener("click", (e) => {
        // console.log(e.target.getAttribute("value"));
        if (
          e.target.innerText !== "X" &&
          e.target.innerText !== "O" &&
          isPlayable
        ) {
          let currentPlayer = gameBoardModule.getCurrentPlayer();
          if (currentPlayer == 1) {
            playerOne.playTurn(square.getAttribute("value")); //the value attribute has the square index
          } else {
            playerTwo.playTurn(square.getAttribute("value"));
          }
        }
      });
    });
    document.querySelector("#restart-button").addEventListener("click", (e) => {
      gameBoardModule.gameBoardReset();
      displayControllerModule.updateDisplay(true); //reset is set to true
    });
    document.getElementById("show-best-move").addEventListener("click", (e) => {
      let currentPlayer = gameBoardModule.getCurrentPlayer();
      let playerMarker = currentPlayer === 1 ? "X" : "O";
      let squareIndex = robotModule.findBestMove(
        gameBoardModule.getGameBoard(),
        playerMarker
      );
      console.log(
        `Best Move possible for ${playerMarker} is at ${squareIndex}`
      );
      let square = document.querySelector(`#square-${squareIndex}`);
      square.classList.add("highlight");
      setTimeout(() => {
        square.classList.remove("highlight");
      }, 500);
    });
    document
      .querySelector("#player-1-details")
      .classList.toggle("active-player");
  }

  setUpButtonListeners();
  return {
    updateDisplay,
    setIsPlayable,
    highlightWin,
  };
})();

const robotModule = (function () {
  let initialBoard = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  function evaluateBoard(gameBoard) {
    let score = 0; //board is tied or has no winner
    for (
      let i = 0;
      i <= 6;
      i = i + 3 //checks if a row has same elements
    ) {
      if (
        gameBoard[i] === gameBoard[i + 1] &&
        gameBoard[i + 1] == gameBoard[i + 2]
      ) {
        if (gameBoard[i] == "X") score = 10;
        else if (gameBoard[i] == "O") score = -10;
      }
    }
    for (
      let i = 0;
      i < 3;
      i++ //checks if a column has same elements
    ) {
      if (
        gameBoard[i] == gameBoard[i + 3] &&
        gameBoard[i + 3] == gameBoard[i + 6]
      ) {
        if (gameBoard[i] == "X") score = 10;
        else if (gameBoard[i] == "O") score = -10;
      }
    }
    if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8]) {
      //checks first diagonal
      if (gameBoard[0] == "X") score = 10;
      else if (gameBoard[0] == "O") score = -10;
    }
    if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6]) {
      //checks second diagonal
      if (gameBoard[2] == "X") score = 10;
      else if (gameBoard[2] == "O") score = -10;
    }

    return score;
  }
  function minimax(gameBoard, depth, isXTurn) {
    //  console.log("Evaluating board: ", gameBoard, "Depth here is ", depth);
    let score = evaluateBoard(gameBoard);
    if (score === 10) return score - depth; //logic to find the closest win in the search tree
    if (score === -10) return score + depth;
    if (gameBoardModule.isBoardFull(gameBoard)) {
      return 0; //tie
    }

    if (isXTurn) {
      let best = -10000;
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] !== "X" && gameBoard[i] !== "O") {
          // move can be made here at i
          gameBoard[i] = "X"; //making the move
          best = Math.max(best, minimax(gameBoard, depth + 1, !isXTurn));
          gameBoard[i] = initialBoard[i]; //undo the move, setting it to default value
        }
      }
      //after the above for loop, we have the best value updated to the best possible move out of all moves possible
      return best;
    } else {
      let best = 10000;
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] !== "X" && gameBoard[i] !== "O") {
          // move can be made here at i
          gameBoard[i] = "O"; //making the move
          best = Math.min(best, minimax(gameBoard, depth + 1, !isXTurn));
          gameBoard[i] = initialBoard[i]; //undo the move, setting it to default value
        }
      }
      //after the above for loop, we have the best value updated to the best possible move out of all moves possible
      return best;
    }
  }
  function findBestMove(gameBoard, playerMarker) {
    let bestMoveScore;
    if (playerMarker == "X") bestMoveScore = -10000;
    else bestMoveScore = 10000;
    let currentMoveScore = 0;
    let bestMoveIndex = -1;
    let isXTurn = playerMarker === "X" ? true : false;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] !== "X" && gameBoard[i] !== "O") {
        // move can be made here at i
        gameBoard[i] = playerMarker; //making the move
        currentMoveScore = minimax(gameBoard, 0, !isXTurn);
        gameBoard[i] = initialBoard[i]; //undo the move, setting it to default value
        if (playerMarker === "X") {
          if (currentMoveScore > bestMoveScore) {
            bestMoveIndex = i;
            bestMoveScore = currentMoveScore;
          }
        } else {
          if (currentMoveScore < bestMoveScore) {
            bestMoveIndex = i;
            bestMoveScore = currentMoveScore;
          }
        }
      }
    }
    return bestMoveIndex;
  }
  return {
    evaluateBoard,
    minimax,
    findBestMove,
  };
})();

function Player(playerName, playerID, playerMarker) {
  var obj = Object.assign(Object.create(Player.proto), {
    playerName,
    playerID,
    playerMarker,
  });
  return obj;
}

Player.proto = {
  playTurn: function (position) {
    gameBoardModule.modifyBoard(position, this.playerMarker);
  },
};
let playerOne = Player("jay", 1, "X");
let playerTwo = Player("p2", 2, "O");
