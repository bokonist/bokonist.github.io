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

let currentBrushColor = 'black';
CURRENT_COLOR.style['background-color']= currentBrushColor;

let randomModeON = true;


let GRID_SIZE=50;
let cellSize= 500/GRID_SIZE;

//stuff for the custom cursor
const MOUSE_CURSOR= document.querySelector('.cursor');
window.addEventListener('mousemove', cursor);
function cursor (e)
{
    MOUSE_CURSOR.style.top = e.pageY + "px";
    MOUSE_CURSOR.style.left = e.pageX + "px";
}

function drawInitial()
{
    MAIN_GRID.innerHTML=''; //clear the grid if it already exists
    cellSize= 500/GRID_SIZE;
    //populate the main grid with cells for drawing
    for (let i=0; i< GRID_SIZE; i++){
        const CURRENT_ROW = document.createElement('div');
        CURRENT_ROW.classList.add('row');
        for (let j=0; j< GRID_SIZE; j++){
            let cell = document.createElement('div');
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
//funtion to color a cell and the corresponding position on canvas on the side
console.log(canvas.height, canvas.width);
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
})

//function to generate random image. basically simulates a mouseover event for all cells
RANDOM_BUTTON.addEventListener('click', (e) => {
    randomModeON=true;
    CURRENT_COLOR.style['background-color']='black'; 
    CURRENT_COLOR.style['border-top']= '5px solid red';
    CURRENT_COLOR.style['border-right']= '5px solid green';
    CURRENT_COLOR.style['border-bottom']= '5px solid blue';
    CURRENT_COLOR.style['border-left']= '5px solid yellow';
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

OUTLINE_BUTTON.addEventListener('click', (e) => {
    if((OUTLINE_BUTTON.value === "false")) // type issue, also solved with == instead of ===
    {
        OUTLINE_BUTTON.style['background-color']= 'green';
        
        OUTLINE_BUTTON.value=true;
        OUTLINE_BUTTON.innerText="TURN OUTLINE OFF"
        MOUSE_CURSOR.style.border="3px solid black";

        console.log(OUTLINE_BUTTON.value);
    }
    else{
        OUTLINE_BUTTON.value=false;
        OUTLINE_BUTTON.style['background-color']= 'red';
        OUTLINE_BUTTON.innerText="TURN OUTLINE ON"
        MOUSE_CURSOR.style.border="1px solid black";
        console.log(OUTLINE_BUTTON.value);
    }
    
})

// function to switch brush color, and turn outline on if the user wants to
for (let i of document.querySelectorAll('.palette-button')) {

    i.addEventListener('click', (e) => {
        switch (e.target.getAttribute('id')) {
            case 'eraser-button':
                //eraser blocks must have no outline
                OUTLINE_BUTTON.value=false;
                OUTLINE_BUTTON.style['background-color']='red';
                OUTLINE_BUTTON.innerText="TURN OUTLINE ON";
                CURRENT_COLOR.style['border']= "0px";
                currentBrushColor= e.target.getAttribute('value');
                CURRENT_COLOR.style['background-color']= currentBrushColor;
                MOUSE_CURSOR.style['background-color']=currentBrushColor;
                randomModeON=false;
                break;
            case 'outline-button': //toggle outline ON/OFF
                if(OUTLINE_BUTTON.value=== "false")
                {
                    CURRENT_COLOR.style['border']= "none";
                }
                else{
                    CURRENT_COLOR.style['border']= "4px solid black";
                }
                break;
            case 'random-button': 
                randomModeON = true;
                CURRENT_COLOR.style['background-color']='black'; 
                CURRENT_COLOR.style['border-top']= '5px solid red';
                CURRENT_COLOR.style['border-right']= '5px solid green';
                CURRENT_COLOR.style['border-bottom']= '5px solid blue';
                CURRENT_COLOR.style['border-left']= '5px solid yellow';
                break;
            
            default:
                randomModeON = false;
                currentBrushColor= e.target.getAttribute('value');
                MOUSE_CURSOR.style['background-color']=currentBrushColor;
                CURRENT_COLOR.style['background-color']= currentBrushColor;
                if(CURRENT_COLOR.style['border']== "none")
                    CURRENT_COLOR.style['border']= "4px solid black";
                break;
        }
        console.log(COLOR_PICKER.value);
        
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
GRID_ADJUSTOR.addEventListener('mouseup', (e) => {
    GRID_SIZE =  Number(e.target.value);
    drawInitial();
})