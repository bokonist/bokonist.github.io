const MAIN_GRID = document.querySelector('#main-grid');
const GRID_ADJUSTOR = document.querySelector('#grid-adjustor');
const RESET_BUTTON = document.querySelector('#restart');
const RANDOM_BUTTON = document.querySelector("#generate-random");
const OUTLINE_BUTTON = document.querySelector('#outline-button');
const COLOR_PICKER = document.querySelector('#color-picker-button');
const DRAW_GRID = document.querySelector('#draw-grid');
const CURRENT_COLOR = document.querySelector('#current-color');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let currentBrushColor;
let randomModeON;
let eraserModeON;
let GRID_SIZE=50;
let cellSize= 500/GRID_SIZE;

//stuff for the custom cursor
const MOUSE_CURSOR= document.querySelector('.cursor');
window.addEventListener('mousemove', cursorTrack);
function cursorTrack (e)
{
    MOUSE_CURSOR.style.top = `${e.pageY}px`;
    MOUSE_CURSOR.style.left = `${e.pageX}px`;
}

//function to drawInitial grid and set initial default values
function drawInitial()
{
    MAIN_GRID.innerHTML=''; //clear the main grid if it already exists
    randomModeON = true;
    setOutline(true);
    setCurrentBrush("random", OUTLINE_BUTTON.value);
    cellSize= 500/GRID_SIZE;
    let CURRENT_ROW, cell;
    //populate the main grid with cells for drawing
    for (let i=0; i< GRID_SIZE; i++){
        CURRENT_ROW = document.createElement('div');
        CURRENT_ROW.classList.add('row');
        for (let j=0; j< GRID_SIZE; j++){
            cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('row', j);
            cell.setAttribute('column', i);
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.addEventListener('mouseover', colorCell);
            CURRENT_ROW.appendChild(cell);
        }
        MAIN_GRID.appendChild(CURRENT_ROW);

        //draw the main canvas element
        canvas.height= 500;
        canvas.width= 500;
        ctx.fillStyle='#c7c7c7';
        ctx.fillRect(0,0,GRID_SIZE*cellSize, GRID_SIZE*cellSize);
    }
}
drawInitial();

//funtion to color a cell and the corresponding position on canvas element on the side
function colorCell (event) {

    if(randomModeON)
    {
        let rvalue = Math.floor((Math.random() * 256) + 1);
        let bvalue = Math.floor((Math.random() * 256) + 1);
        let gvalue = Math.floor((Math.random() * 256) + 1);
        currentBrushColor=`rgb(${rvalue},${gvalue},${bvalue})`;
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        CURRENT_COLOR.style['background-color']= currentBrushColor;
        event.target.style['background-color']= currentBrushColor;
        ctx.fillStyle=currentBrushColor;
        ctx.fillRect(event.target.getAttribute('column')*cellSize, event.target.getAttribute('row')*cellSize, cellSize, cellSize);
    }
    else if (eraserModeON) {
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        event.target.style['background-color']= currentBrushColor;
        ctx.fillStyle=currentBrushColor;
        //hacky piece of code to erase just a few pixels more to accomodate for the border on a canvas cell. 
        ctx.fillRect((event.target.getAttribute('column')*cellSize)-2, (event.target.getAttribute('row')*cellSize)-2, cellSize+2, cellSize+2);  
    }
    else{
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        event.target.style['background-color']= currentBrushColor;
        ctx.fillStyle=currentBrushColor;
        ctx.fillRect(event.target.getAttribute('column')*cellSize, event.target.getAttribute('row')*cellSize, cellSize, cellSize);
    }

    if(OUTLINE_BUTTON.value=== "true")
    {
        ctx.strokeStyle='black';
        ctx.lineWidth=2;//outline thickness
        ctx.strokeRect(event.target.getAttribute('column')*cellSize, event.target.getAttribute('row')*cellSize, cellSize, cellSize);
    }
    
}

function setCurrentBrush (brushColor, brushStyle) //brushStyle is true/false for OUTLINE preference 
{
    if(eraserModeON) // previous selection was eraser and we toggled outline off automatically for that, this just turns it back on
    {
        eraserModeON=false;
        setOutline(true);
    }
           
    if(brushColor === "random")
    {
        randomModeON = true;
        CURRENT_COLOR.style['background-color']='black'; 
        CURRENT_COLOR.style['border-top']= '5px solid red';
        CURRENT_COLOR.style['border-right']= '5px solid green';
        CURRENT_COLOR.style['border-bottom']= '5px solid blue';
        CURRENT_COLOR.style['border-left']= '5px solid yellow';
        MOUSE_CURSOR.style['border-top']= '2px solid red';
        MOUSE_CURSOR.style['border-right']= '2px solid green';
        MOUSE_CURSOR.style['border-bottom']= '2px solid blue';
        MOUSE_CURSOR.style['border-left']= '2px solid yellow';
    }
    else {
        randomModeON= false;
         
        MOUSE_CURSOR.style.border= '2px solid black';
        switch (brushColor) {
            case "red":
                currentBrushColor='red';
                break;
            case "green":
                currentBrushColor='green';
                break;
            case "yellow":
                currentBrushColor='yellow';
                break;
            case "blue":
                currentBrushColor='blue';
                break;
            case "black":
                currentBrushColor='black';
                break;
            case "eraser":
                currentBrushColor='#c7c7c7';
                eraserModeON=true;
                setOutline(false); //eraser brush will have no outline
                break;
            default: // color was picked with random color picker
                currentBrushColor= brushColor;
                break;
        }
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        CURRENT_COLOR.style['background-color']=currentBrushColor;
        if(brushColor !== 'eraser' || brushStyle == true) // user picked a color that's not eraser or outline is on, thss code block is kinda buggy
            CURRENT_COLOR.style.border= '5px solid black';
        else
            CURRENT_COLOR.style.border= 'none';
    }
}

//function to reset canvas and main grid to initial state
RESET_BUTTON.addEventListener ('click', (e) => {
    for (let i of document.querySelectorAll('.cell'))
    {
        i.style['background-color']= '#c7c7c7';
        canvas.height= 500;
        canvas.width= 500;
        ctx.fillStyle='#c7c7c7';
        ctx.fillRect(0,0,GRID_SIZE*cellSize, GRID_SIZE*cellSize);
    }
    drawInitial();
})

//function to generate random image. basically turns random mode on and simulates a mouseover event for all cells
RANDOM_BUTTON.addEventListener('click', (e) => {
    setCurrentBrush("random", OUTLINE_BUTTON.value);
    let canvasNodes = document.querySelectorAll('.cell');
    for (let i of canvasNodes){
        let mouseoverEvent = new Event('mouseover');
        i.dispatchEvent(mouseoverEvent);
    }
})

//function to fire if the user wants a grid on their final image
DRAW_GRID.addEventListener('click', (e)=> {
    let canvasNodes = document.querySelectorAll('.cell');
    for (let i of canvasNodes){
        ctx.strokeStyle='black';
        ctx.lineWidth=2;//outline thickness
        ctx.strokeRect(i.getAttribute('column')*cellSize, i.getAttribute('row')*cellSize,cellSize,cellSize);
    }
        
})

function toggleOutline (event)
{
    if((OUTLINE_BUTTON.value === "false")) // type issue, also solved with == instead of ===
    {
        setOutline(true);
    }
    else{
        setOutline(false);
    }
}
function setOutline(preference)
{
    if(preference === true)
    {
        OUTLINE_BUTTON.style['background-color']= 'red';
        OUTLINE_BUTTON.innerText="TURN OUTLINE OFF";
        if(randomModeON)
        {
            CURRENT_COLOR.style['border-top']= '5px solid red';
            CURRENT_COLOR.style['border-right']= '5px solid green';
            CURRENT_COLOR.style['border-bottom']= '5px solid blue';
            CURRENT_COLOR.style['border-left']= '5px solid yellow';
        }
        else
            CURRENT_COLOR.style.border='5px solid black';
    }
    else {
        OUTLINE_BUTTON.style['background-color']= 'green';
        OUTLINE_BUTTON.innerText="TURN OUTLINE ON";
        CURRENT_COLOR.style.border='none';
    }
    OUTLINE_BUTTON.value=preference;
}
OUTLINE_BUTTON.addEventListener('click',toggleOutline);

// function to fire when one of the palette buttons are clicked to pick a new color
for (let i of document.querySelectorAll('.palette-button')) {
    i.addEventListener('click', (e) => {
       setCurrentBrush(e.target.value, OUTLINE_BUTTON.value);
    });
}

//funtions to fire when a new color is picked with color picker, or just clicked and no new value is picked
COLOR_PICKER.addEventListener('input', (e) => {
    console.log("Color changed to ", COLOR_PICKER.value);
    currentBrushColor= COLOR_PICKER.value;
    CURRENT_COLOR.style['background-color']= currentBrushColor;
    MOUSE_CURSOR.style['background-color']=currentBrushColor;
    if(OUTLINE_BUTTON.value=== "false")
    {
        CURRENT_COLOR.style['border']= "none";
    }
    else{
        CURRENT_COLOR.style['border']= "4px solid black";
    }
})
COLOR_PICKER.addEventListener('click', (e) => {
    console.log("Color changed to ", COLOR_PICKER.value);
    currentBrushColor= COLOR_PICKER.value;
    CURRENT_COLOR.style['background-color']= currentBrushColor;
    MOUSE_CURSOR.style['background-color']=currentBrushColor;
    if(OUTLINE_BUTTON.value=== "false")
    {
        CURRENT_COLOR.style['border']= "none";
    }
    else{
        CURRENT_COLOR.style['border']= "4px solid black";
    }
})



//function to download the sketch, points the URL of the image data file to the download location
function downloadSketch ()
{
    let dataURL = canvas.toDataURL();
    document.querySelector('#download-button').setAttribute('href',dataURL);
}

//functions for grid size adjustor
GRID_ADJUSTOR.addEventListener('mouseup', (e) => {
    GRID_SIZE =  Number(e.target.value);
    document.querySelector('#grid-size-label').innerText= `${GRID_SIZE} X ${GRID_SIZE}`;
    drawInitial();
})

GRID_ADJUSTOR.addEventListener('input', (e) => {
    GRID_SIZE =  Number(e.target.value);
    document.querySelector('#grid-size-label').innerText= `${GRID_SIZE} X ${GRID_SIZE}`;
})