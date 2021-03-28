const GRID_DIV = document.querySelector('#main-grid');
const RESET_BUTTON = document.querySelector('#restart');
const RANDOM_BUTTON = document.querySelector("#generate-random");
const GRID_CHECKBOX = document.querySelector('#grid-checkbox');
const OUTLINE_CHECK = document.querySelector('#outline-button');
const COLOR_PICKER = document.querySelector('#color-picker-button');
const DRAW_GRID = document.querySelector('#draw-grid');
let currentBrushColor = 'black';
let randomModeON = true;
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE= 60;

//stuff for the custom cursor
const MOUSE_CURSOR= document.querySelector('.cursor');
window.addEventListener('mousemove', cursor);
function cursor (e)
{
    MOUSE_CURSOR.style.top = e.pageY + "px";
    MOUSE_CURSOR.style.left = e.pageX + "px";
}

//populate the main grid with cells for drawing
for (let i=0; i< GRID_SIZE; i++){
    const CURRENT_ROW = document.createElement('div');
    CURRENT_ROW.classList.add('row');
    for (let j=0; j< GRID_SIZE; j++){
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('row', j);
        cell.setAttribute('column', i);
        cell.addEventListener('mouseover', colorCell);
        CURRENT_ROW.appendChild(cell);
    }
    GRID_DIV.appendChild(CURRENT_ROW);
}
//funtion to color a cell and the corresponding position on canvas on the side
function colorCell (event) {

    if(randomModeON)
    {
        let rvalue = Math.floor((Math.random() * 256) + 1);
        let bvalue = Math.floor((Math.random() * 256) + 1);
        let gvalue = Math.floor((Math.random() * 256) + 1);
        currentBrushColor=`rgb(${rvalue},${gvalue},${bvalue})`;
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        event.target.style['background-color']= currentBrushColor;
        ctx.fillStyle=currentBrushColor;
        ctx.fillRect(event.target.getAttribute('column')*10,event.target.getAttribute('row')*10,10,10);
    }
    else{
        MOUSE_CURSOR.style['background-color']=currentBrushColor;
        event.target.style['background-color']= currentBrushColor;
        ctx.fillStyle=currentBrushColor;
        ctx.fillRect(event.target.getAttribute('column')*10,event.target.getAttribute('row')*10,10,10);
    }

    if(OUTLINE_CHECK.value=== "true")
    {
        ctx.strokeStyle='black';
        ctx.lineWidth=2;//outline thickness
        ctx.strokeRect(event.target.getAttribute('column')*10,event.target.getAttribute('row')*10,10,10);
    }
    
}

//function to reset canvas and main grid to initial state
RESET_BUTTON.addEventListener ('click', (e) => {
    for (let i of document.querySelectorAll('.cell'))
    {
        i.style['background-color']= '#c7c7c7';
        canvas.height= GRID_SIZE*10;
        canvas.width= GRID_SIZE*10;
        ctx.fillStyle='#c7c7c7';
        ctx.fillRect(0,0,GRID_SIZE*10, GRID_SIZE*10);
    }
})

//function to generate random image. basically simulates a mouseover event for all cells
RANDOM_BUTTON.addEventListener('click', (e) => {
    randomModeON=true;
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
        ctx.strokeRect(i.getAttribute('column')*10, i.getAttribute('row')*10,10,10);
    }
        
})

OUTLINE_CHECK.addEventListener('click', (e) => {
    if((OUTLINE_CHECK.value === "false")) // type issue, also solved with == instead of ===
    {
        OUTLINE_CHECK.style['background-color']= 'green';
        
        OUTLINE_CHECK.value=true;
        console.log(OUTLINE_CHECK.value);
    }
    else{
        OUTLINE_CHECK.value=false;
        OUTLINE_CHECK.style['background-color']= 'red';
        
        console.log(OUTLINE_CHECK.value);
    }
    
})

// function to switch brush color, and turn outline on if the user wants to
for (let i of document.querySelectorAll('.palette-button')) {

    i.addEventListener('click', (e) => {
        switch (e.target.getAttribute('id')) {
            case 'eraser-button':
                //eraser blocks must have no outline
                OUTLINE_CHECK.value=false;
                OUTLINE_CHECK.style['background-color']='red';
                currentBrushColor= e.target.getAttribute('value');
                MOUSE_CURSOR.style['background-color']=currentBrushColor;
                randomModeON=false;
                break;
            case 'outline-button': 

                break;
            case 'random-button': 
                randomModeON = true;
                MOUSE_CURSOR.style['background-color']=currentBrushColor;
                break;
            
            default:
                randomModeON = false;
                currentBrushColor= e.target.getAttribute('value');
                MOUSE_CURSOR.style['background-color']=currentBrushColor;
                break;
        }
        console.log(COLOR_PICKER.value);
        
    });
}
//funtion to fire when a new color is picked with color picker
COLOR_PICKER.addEventListener('input', (e) => {
    console.log("Color changed to ", COLOR_PICKER.value);
    currentBrushColor= COLOR_PICKER.value;
    MOUSE_CURSOR.style['background-color']=currentBrushColor;
})

//draw the main canvas when the page loads
window.addEventListener('load', () => {

    canvas.height= GRID_SIZE*10;
    canvas.width= GRID_SIZE*10;
    ctx.fillStyle='#c7c7c7';
    ctx.fillRect(0,0,GRID_SIZE*10, GRID_SIZE*10);
})

//function to download the sketch, points the URL of the image data file to the download location
function downloadSketch ()
{
    let dataURL = canvas.toDataURL();
    document.querySelector('#download-button').setAttribute('href',dataURL);
}