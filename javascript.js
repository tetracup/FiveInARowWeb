let slider = document.querySelector("#resSlider")
let container = document.querySelector(".container")
var containerChildren 
let textInput = document.querySelector("#textInput")
let dimensions = document.querySelector("#dimensions")
let restart = document.querySelector("#restart")
let isPressed = false
let gameInProgress = true
let areGridLinesOn
var gameboard = [[]]
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
    for (var g = 0; g < slider.value; g++) {
        gameboard[g] = new Array(slider.value);
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
            gameboard[a][i] = newElement
            container.appendChild(newElement)
        }
    }
    containerChildren = Array.from(container.childNodes)
    gameInProgress = true
}
function PlaceMarker(evt)
{
    if(evt.target.getAttribute('status') != SlotStatus.None || !gameInProgress)
        return;
    evt.target.setAttribute('status', SlotStatus.Player)
    evt.target.style.backgroundColor = `rgba(0, 0, 255, 0.3)`
    containerChildren.splice(containerChildren.indexOf(evt.target), 1)
    

    if(CheckWin(false, evt.target.dataset.x, evt.target.dataset.y))
    {
        setTimeout(function() {
            alert("You Win!");
          }, 0)
        gameInProgress = false
        return 
    }

    if(CheckTie())
        return


    PlaceComputerMarker()
    
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

function CheckWin(isComputer, x, y)
{
    let counter = 1
    var checkState
    isComputer ? checkState = SlotStatus.Computer : checkState = SlotStatus.Player
    var incY = 1
    let originalX = x
    let originalY = y
    while(gameboard[x][++y].getAttribute('status') == checkState)
    {
        counter++
    }
    y = originalY
    while(gameboard[x][--y].getAttribute('status') == checkState)
    {
        counter++
    }
    console.log(counter)
    if(counter == 5)
            return true
    return false
    /*
    for(i = -1; i <= 1; i++)
    {
        for(a = -1; a <= 1; a++)
        {
            if(i == 0 && a == 0)
                continue
            if(gameboard[x + i][y + a].getAttribute('status') == checkState)
            {
                
            }
        }
    }
    */
}

UpdateGrid();


slider.onchange = UpdateGrid;
textInput.onchange = UpdateSlider
restart.onclick = UpdateGrid