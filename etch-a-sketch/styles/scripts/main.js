const GRID_DIV = document.querySelector('#main-grid');
const RESET_BUTTON = document.querySelector('#restart');

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

    event.target.style['background-color']= 'black';
}

RESET_BUTTON.addEventListener ('click', (e) => {
    for (let i of document.querySelectorAll('.cell'))
    {
        i.style['background-color']= 'white';
    }
})
