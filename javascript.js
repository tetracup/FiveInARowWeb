let slider = document.querySelector("#resSlider")
let container = document.querySelector(".container")
let textInput = document.querySelector("#textInput")
let dimensions = document.querySelector("#dimensions")
let restart = document.querySelector("#restart")
let isPressed = false
let areGridLinesOn
let pixels = []

function UpdateGrid()
{
    pixels = [[]]
    dimensions.textContent = `${slider.value}x${slider.value}`
    textInput.value = slider.value
    container.style.cssText = `grid-template-columns: repeat(${slider.value}, auto)`
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
    for(let i = 0; i < slider.value; i++)
    {
        
          for(let i = 0; i < slider.value; i++)
         {
        
        const newElement = document.createElement("pixel")
        pixels[i, i] = newElement
        newElement.addEventListener("mousedown", PlaceMarker)
        newElement.ondragstart = () => {return false;}
        container.appendChild(newElement)
         }
    }
    
}

function PlaceMarker(evt)
{
    evt.target.style.backgroundColor = `rgba(0, 0, 255, 0.3)`
}
function UpdateSlider()
{
    if(textInput.value > 30)
        textInput.value = 30
    else if(textInput.value < 15)
        textInput.value = 15

    slider.value = textInput.value
    UpdateGrid();
}

UpdateGrid();


slider.onchange = UpdateGrid;
textInput.onchange = UpdateSlider
restart.onclick = UpdateGrid