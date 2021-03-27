const GRID_DIV = document.querySelector('#main-grid');
const RESET_BUTTON = document.querySelector('#restart');
let currentBrushColor = 'black';
let randomModeON = false;

const GRID_SIZE= 60;

for (let i=0; i< GRID_SIZE; i++){
    const CURRENT_ROW = document.createElement('div');
    for (let j=0; j< GRID_SIZE; j++){
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('mouseover', colorCell);
        CURRENT_ROW.appendChild(cell);
    }
    GRID_DIV.appendChild(CURRENT_ROW);
}

function colorCell (event) {

    if(randomModeON)
    {
        let rvalue = Math.floor((Math.random() * 256) + 1);
        let bvalue = Math.floor((Math.random() * 256) + 1);
        let gvalue = Math.floor((Math.random() * 256) + 1);
        currentBrushColor=`rgb(${rvalue},${gvalue},${bvalue})`;
    }
    event.target.style['background-color']= currentBrushColor;
    
}

RESET_BUTTON.addEventListener ('click', (e) => {
    for (let i of document.querySelectorAll('.cell'))
    {
        i.style['background-color']= 'white';
    }
})

for (let i of document.querySelectorAll('.palette-button')) {
    i.addEventListener('click', (e) => {
        if(e.target.getAttribute('value') !== 'random')
        {
            randomModeON = false;
            currentBrushColor= e.target.getAttribute('value');
        }
        else {
            randomModeON = true;
        }
    });
}