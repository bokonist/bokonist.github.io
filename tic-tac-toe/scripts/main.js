const gameBoardModule = (function (){
  let gameBoard = ['A', 'B', 'C','D', 'E', 'F','G', 'H', 'I'];
  let currentPlayer = 1; // player 1 plays first by default
  let gameWinner = 0; // 0 is tie, 1 is player 1 wins, 2 is player 2 wins
  function getGameBoard() { return gameBoard; }
  function getWinner () { return gameWinner; }
  function getCurrentPlayer () { return currentPlayer; }
  function setCurrentPlayer (currentPlayerParam) {
    currentPlayer = currentPlayerParam;
  }
  function isBoardFull() {
    for (let i = 0; i < gameBoard.length; i++) {
      if(/[A-I]/.test(gameBoard[i]))
        return false;
    }
    return true;
  }
  function checkForWinner()
  {
    //write logic to check is game is over and update gameWinner with winning Player'd ID;
    gameWinner = 0;
    for(let i=0; i<=6; i=i+3) //checks if a row has same elements
    {
        if (gameBoard[i] === gameBoard [i+1] && gameBoard[i+1] == gameBoard [i+2])
        {
          if(gameBoard[i] == 'X')
            gameWinner = 1;
          else if(gameBoard[i] == 'O')
            gameWinner = 2;
          displayControllerModule.highlightWin(i/3,-1,-1); //i values are 0,3,6 so i/3 tells highlightWin to highlight row number (i/3)
        }
  
    }
    for(let i=0; i<3; i++) //checks if a column has same elements
    {
        if (gameBoard[i] === gameBoard [i+3] && gameBoard[i+3] == gameBoard [i+6])
        {
          if(gameBoard[i] == 'X')
            gameWinner = 1;
          else if(gameBoard[i] == 'O')
            gameWinner = 2;
          displayControllerModule.highlightWin(-1,i,-1);
        }
    
  
    }
    if((gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard [8])) //checks first diagonal
    {
      if(gameBoard[0] == 'X')
          gameWinner = 1;
      else if(gameBoard[0] == 'O')
          gameWinner = 2;
      displayControllerModule.highlightWin(-1,-1,0);

    }
    if((gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard [6])) //checks second diagonal
    {
      if(gameBoard[2] == 'X')
          gameWinner = 1;
      else if(gameBoard[2] == 'O')
          gameWinner = 2;
      displayControllerModule.highlightWin(-1,-1,1);
    }
    if(isBoardFull())
    {
      if(gameWinner === 0) //no winner and board is full
      {
        //alert(`It's a tie`);
        displayControllerModule.updateDisplay(false, true);
        displayControllerModule.setIsPlayable(false);
      }
    }
    
    return gameWinner;

  } 
  function modifyBoard(position, value)
  {
    gameBoard[position] = value;
    displayControllerModule.updateDisplay();
    console.log(gameBoard);
    let winner = checkForWinner();
    if(winner !== 0) // one of the players won
    {
 //     alert(`${gameBoardModule.getCurrentPlayer()} wins!`);
        displayControllerModule.setIsPlayable(false); //disable the board

    }
    
  }
  function gameBoardReset (){
    gameBoard = ['A', 'B', 'C','D', 'E', 'F','G', 'H', 'I'];
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
    getWinner
  }

})();

const displayControllerModule = (function (){
  let isPlayable = true;
  function setIsPlayable (value){
    isPlayable = value;
  }
  function highlightWin (rowNumber=-1, columnNumber=-1, diagonalNumber=-1){
    
    if(rowNumber !== -1)
    {
      let rowArray = [[0,1,2], [3,4,5] , [6,7,8]];
      rowArray[rowNumber].forEach(rowElement => {
        let currentDiv = document.querySelector(`#square-${rowElement}`);
        currentDiv.style['background-color'] = 'white';
      })
    }
    else if(columnNumber !== -1)
    {
      let colArray = [[0,3,6],[1,4,7],[2,5,8]];
      colArray[columnNumber].forEach(columnElement => {
        let currentDiv = document.querySelector(`#square-${columnElement}`);
        currentDiv.style['background-color'] = 'white';
      });
    }
    else if(diagonalNumber !== -1)
    {
      let diagonalArray = [[0,4,8],[2,4,6]];
      diagonalArray[diagonalNumber].forEach(diagonalElement => {
        let currentDiv = document.querySelector(`#square-${diagonalElement}`);
        currentDiv.style['background-color'] = 'white';
      });
    }
  }
  function updateDisplay(reset=false, tie=false)
  {
    if(tie === true)
    {
      document.querySelectorAll('.game-square').forEach( square =>{
        square.style['background-color'] = 'white';
      });
      document.querySelector('#player-2-details').style['background-color']= '#ffbc00'; //yellow
      document.querySelector('#player-1-details').style['background-color']= '#ffbc00'; //blue
    }
    else
    {
        let gameBoard = gameBoardModule.getGameBoard();
        document.querySelectorAll('.game-square').forEach(square =>{
          let gameBoardElement = gameBoard[square.getAttribute('value')]; // get the corresponding element on the gameBoard array
          if(gameBoardElement == 'X' || gameBoardElement == 'O') // gameboard[index] contains X or O, ie. none of the default filler values A to I
          {
              square.innerText = gameBoardElement;
          }
          else
          {
            square.innerText = '';
          }
        });
        let currentPlayer = gameBoardModule.getCurrentPlayer();
        let gameWinner = gameBoardModule.getWinner();
        if(gameWinner!== 0) //game has ended
        {
            if(gameWinner ==1)
            {
              document.querySelector('#player-2-details').style['background-color']= 'red';
              document.querySelector('#player-1-details').style['background-color']= 'green';
              
            }
            else if(gameWinner ==2)
            {
              document.querySelector('#player-1-details').style['background-color']= 'red';
              document.querySelector('#player-2-details').style['background-color']= 'green';
            }
            return;
        }
        else { //game is still ongoing
          if(currentPlayer ==1)
          {
            document.querySelector('#player-1-details').style['background-color']= '#ffbc00'; //yellow
            document.querySelector('#player-2-details').style['background-color']= '#003049'; //blue
            
          }
          else if(currentPlayer ==2)
          {
            document.querySelector('#player-2-details').style['background-color']= '#ffbc00'; //yellow
            document.querySelector('#player-1-details').style['background-color']= '#003049'; //blue
          }
        }
        if(reset === true)
        {
          document.querySelectorAll('.game-square').forEach( square =>{
            square.style['background-color'] = '#00000086';
            square.innerText='';
          });
        }
    }
  }
  document.querySelector('#restart-button').addEventListener('click', (e)=>{
    gameBoardModule.gameBoardReset();
    displayControllerModule.updateDisplay(true);
  });

  document.querySelectorAll('.game-square').forEach( square => {
  square.addEventListener('click', (e) =>{
    console.log(e.target.getAttribute('value'));
    if( e.target.innerText !== 'X' && e.target.innerText !== 'O' && isPlayable)
    {
      let currentPlayer = gameBoardModule.getCurrentPlayer();
      if(currentPlayer == 1)
      {
        playerOne.playTurn(e.target.getAttribute('value'));
        gameBoardModule.setCurrentPlayer(2);
      }
      else
      {
        playerTwo.playTurn(e.target.getAttribute('value'));
        gameBoardModule.setCurrentPlayer(1);
      }
      displayControllerModule.updateDisplay();
    }

  });
  
});
  return {
  
    updateDisplay,
    setIsPlayable,
    highlightWin
  }
})();

function Player (playerName, playerID, playerMarker) {
  var obj = Object.assign(Object.create(Player.proto), { playerName, playerID, playerMarker} );
  return obj;
}

Player.proto = {
  playTurn: function (position) {
    gameBoardModule.modifyBoard(position, this.playerMarker);
  }
}
let playerOne = Player('jay', 1, 'X');
let playerTwo = Player ('p2', 2, 'O');