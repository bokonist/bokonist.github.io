let roundCount = 0;
let playerScore=0 , computerScore=0;

// game matrix  is a 2d array, stores values such that GAME_MATRIX[row][column] will say if row won or column won. 1 is row wins, 0 is row loses, -1 is draw.
//  0 represents ROCK, 1 represents PAPER, 2 represents SCISSORS
// GAME_MATRIX [0][2] can be read as "who wins between [0] (rock) and [2] scissors. Value is 0, so row wins, i.e [0] i.e. ROCK"
/*
            rock0   paper1   scissors2
rock0        -1      1       0

paper1       0       -1      1

scissors2    1       0       -1
*/
let GAME_MATRIX = [];
for (let i = 0; i < 3; i++) {
  GAME_MATRIX[i] = [];
}
GAME_MATRIX[0][0]= -1; GAME_MATRIX[0][1]= 1; GAME_MATRIX[0][2]= 0;
GAME_MATRIX[1][0]= 0; GAME_MATRIX[1][1]= -1; GAME_MATRIX[1][2]= 1;
GAME_MATRIX[2][0]= 1; GAME_MATRIX[2][1]= 0; GAME_MATRIX[2][2]= -1;

// a few DOM selectors
const ROUND_DISPLAY = document.getElementById('round-result');
const PLAYER_SCORE = document.getElementById('player-score');
const COMPUTER_SCORE = document.getElementById('computer-score');
const GAME_LOG = document.getElementById('game-log');
const PLAY_AGAIN = document.getElementById('restart');
const OPTIONS_CONTAINER = document.getElementsByClassName('options-container');
const SCORE_CONTAINER = document.querySelector('.score-container');
const TITLE_CONTAINER = document.querySelector('.main-title');

//set game to initial state
setInitial();

//adding event listeners for main 3 options
let inputHandler = document.querySelectorAll('.options');
for (let i of inputHandler){

    i.addEventListener('click', (e) => {
        if((PLAY_AGAIN.style.display === 'none')) // game is over and restart option is visible on screen, so game is not playable till user confirms
        {
            playRound(i.getAttribute('value'), computerPlay());
        }

    });
}

//play again confirmation after game is over
PLAY_AGAIN.addEventListener('click', (e) => {
    setInitial(); //reset to initial state and hide the restart button
    PLAY_AGAIN.style.display='none';
});


// function to make a random computer selection
function computerPlay()
{
    let randomNumber = Math.floor((Math.random() * 3) + 1);
    randomNumber = randomNumber%3;
    if(randomNumber ==0)
    {
        return 'ROCK';
    }
    if(randomNumber ==1)
    {
        return 'PAPER';
    }
    if(randomNumber ==2)
    {
        return 'SCISSORS';
    }
}

function playRound (playerSelection, computerSelection)
{
    if(roundCount===0)
    {
        TITLE_CONTAINER.style.display="none";
    }
    GAME_LOG.innerText = `Computer plays ${computerSelection}, you played ${playerSelection}!`;
    // convert the selections to it's number representation, 0 for ROCK, 1 for PAPER, 2 for scissors
    if (computerSelection === 'ROCK')
    {
        computerSelection = 0;
    }
    else if (computerSelection === 'PAPER')
    {
        computerSelection=1;
    }
    else if (computerSelection === 'SCISSORS')
    {
        computerSelection=2;
    }
    if (playerSelection === 'ROCK')
    {
        playerSelection = 0;
    }
    else if (playerSelection === 'PAPER')
    {
        playerSelection=1;
    }
    else if (playerSelection === 'SCISSORS')
    {
        playerSelection=2;
    }


    let winner = -1; //draw
    winner = GAME_MATRIX[computerSelection][playerSelection];
    // looks up the game matrix,  -1 if draw, 0 if computer wins, 1 if player wins

    //update the scores
    if (winner === 0)
    {
        computerScore++;
        COMPUTER_SCORE.innerText=`Computer Score: ${computerScore}`;
        ROUND_DISPLAY.innerText=`ROUND #${roundCount+1} WINNER: COMPUTER`;
    }
    else if (winner === 1)
    {
        playerScore++;
        PLAYER_SCORE.innerText=`Player Score: ${playerScore}`;
        ROUND_DISPLAY.innerText=`ROUND #${roundCount+1} WINNER: YOU!`;
    }
    else {
        ROUND_DISPLAY.innerText=`ROUND #${roundCount+1}: THAT'S A DRAW!`;
    }
    roundCount++;
    checkAndDeclareWinner();
    return;
}

function checkAndDeclareWinner()
{
    if (playerScore === 5 || computerScore === 5)
    {
        if (playerScore === 5 && computerScore === 5)
        {
            GAME_LOG.innerText='';
            ROUND_DISPLAY.innerText=`DRAW!`
            //code never comes here since it's first to 5 and draw has no points
        }
        else if (playerScore === 5)
        {
            GAME_LOG.innerText='';
            ROUND_DISPLAY.innerText=`${roundCount} rounds played! \nGAME OVER! YOU WIN! \n ${playerScore}-${computerScore}, ${roundCount-playerScore-computerScore} draws!`;
            PLAY_AGAIN.style.display="block";

        }
        else if (computerScore === 5 )
        {
            GAME_LOG.innerText='';
            ROUND_DISPLAY.innerText=`${roundCount} rounds played! \nGAME OVER! COMPUTER WINS! \n ${computerScore}-${playerScore}, ${roundCount-playerScore-computerScore} draws!`;
            PLAY_AGAIN.style.display="block";
            
        }
        SCORE_CONTAINER.style.display="none";
        GAME_LOG.style.display="none";

    } 
    return;
}

//function to set/reset to initial game state
function setInitial()
{
    playerScore =0;
    computerScore=0;
    roundCount=0;
    ROUND_DISPLAY.innerText=`First to 5 points win!`;
    TITLE_CONTAINER.style.display="flex";
    SCORE_CONTAINER.style.display="flex";
    GAME_LOG.style.display="flex";
    PLAYER_SCORE.innerText=`Player Score: ${playerScore}`;
    COMPUTER_SCORE.innerText=`Computer Score: ${computerScore}`;
    GAME_LOG.innerText='Pick your weapon to start the game!';
    PLAY_AGAIN.style.display="none";
}