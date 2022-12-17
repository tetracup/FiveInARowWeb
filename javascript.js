let slider = document.querySelector("#resSlider")
let container = document.querySelector(".container")
var containerChildren 
let textInput = document.querySelector("#textInput")
let dimensions = document.querySelector("#dimensions")
let restart = document.querySelector("#restart")
let isPressed = false
let gameInProgress = true
let areGridLinesOn
const SlotStatus = {
    None: 0,
	Player: 1,
	Computer: 2
}
function UpdateGrid()
{
    dimensions.textContent = `${slider.value}x${slider.value}`
    textInput.value = slider.value
    container.style.cssText = `grid-template-columns: repeat(${slider.value}, auto)`
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
    for(let i = slider.value -1; i >= 0; i--)
    {
        
        for(let a = 0; a < slider.value; a++)
        {
            const newElement = document.createElement("pixel")
            newElement.addEventListener("mousedown", PlaceMarker)
            newElement.ondragstart = () => {return false;}
            newElement.dataset.x = a
            newElement.dataset.y = i
            newElement.setAttribute('status', SlotStatus.None)
            container.appendChild(newElement)
            containerChildren = Array.from(container.childNodes);
        }
    }
    gameInProgress = true
}
function PlaceMarker(evt)
{
    if(evt.target.getAttribute('status') != SlotStatus.None || !gameInProgress)
        return;
    evt.target.setAttribute('status', SlotStatus.Player)
    evt.target.style.backgroundColor = `rgba(0, 0, 255, 0.3)`
    containerChildren.splice(containerChildren.indexOf(evt.target), 1)

    if(CheckTie())
        return
    PlaceComputerMarker()
    
}

function isTargetValue(x1, y1, x2, y2)
{
    return (x1 == x2 && y1 == y2)
}

function PlaceComputerMarker()
{
    const randIndex = Math.floor(Math.random() * containerChildren.length)
    containerChildren[randIndex].style.backgroundColor = `rgba(255, 0, 0, 0.3)`
    containerChildren[randIndex].setAttribute('status', SlotStatus.Computer)
    containerChildren.splice(randIndex, 1)
    if(CheckTie())
        return
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

function CheckTie()
{
    if(containerChildren.length <= 0)
    {
        setTimeout(function() {
            alert("Tie!");
          }, 0)
        gameInProgress = false
        return true
    }
    return false
}

UpdateGrid();


slider.onchange = UpdateGrid;
textInput.onchange = UpdateSlider
restart.onclick = UpdateGrid