

let slider = document.querySelector("#resSlider")
let container = document.querySelector(".container")
var containerChildren 
let textInput = document.querySelector("#textInput")
let dimensions = document.querySelector("#dimensions")
let restart = document.querySelector("#restart")
let endText = document.querySelector("#endText")
let isPressed = false
let gameInProgress = true
let areGridLinesOn
var gameboard = [[]]
let maxVal = 0
let playerWon = true
let previousPlayerMove
const SlotStatus = {
    None: 0,
	Player: 1,
	Computer: 2
}
function UpdateGrid()
{
    //Reinitialise values based on restart or dimension change
    endText.textContent = ""
    document.body.style.backgroundColor = "white"
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
    maxVal = parseInt(slider.value)
}
function PlaceMarker(evt)
{
    //Check that marker is empty and game is ongoing
    if(evt.target.getAttribute('status') != SlotStatus.None || !gameInProgress)
        return;
    //Set Player values to slot
    evt.target.setAttribute('status', SlotStatus.Player)
    evt.target.style.backgroundColor = `rgba(0, 0, 255, 0.3)`
    containerChildren.splice(containerChildren.indexOf(evt.target), 1)
    previousPlayerMove = evt.target

    //Check if placed marker was a win
    if(CheckWin(false, evt.target.dataset.x, evt.target.dataset.y))
    {
        playerWon = true
        UpdateBackgroundOnEnd()
        gameInProgress = false
        return 
    }
    //If No avaliable slots left then its a tie
    if(CheckTie())
        return

    //Perform Computers Move 
    PlaceComputerMarker()

    
}

function PlaceComputerMarker()
{
    //Get new index and initialise slot
    const newIndex = ChooseNextComputerMove()
    containerChildren[newIndex].style.backgroundColor = `rgba(255, 0, 0, 0.3)`
    containerChildren[newIndex].setAttribute('status', SlotStatus.Computer)
    
    //Check if its a win, if so end game
    if(CheckWin(true, containerChildren[newIndex].dataset.x, containerChildren[newIndex].dataset.y))
    {
        playerWon = false
        UpdateBackgroundOnEnd()
        gameInProgress = false
        return 
    }
    containerChildren.splice(newIndex, 1)
    //Check if its a loss, if so end game
    if(CheckTie())
        return
    
}

function ChooseNextComputerMove()
{
    //Computer moves based on players move, "defensive"
    startX = parseInt(previousPlayerMove.dataset.x)
    startY = parseInt(previousPlayerMove.dataset.y)
    let increments = 
    [
        [0,1],
        [1,1],
        [1,0],
        [1,-1],
        [0,-1],
        [-1, -1],
        [-1, 0],
        [-1, 1]
    ]
    let emptyCells = []
    let newIndex = -1
    //Check every slot surrounding previous players move
    increments.every(function(element)
    {
        newX = startX + element[0]
        newY = startY + element[1]
        oppositeX = startX - element[0]
        oppositeY = startY - element[1]
        if(!CheckBounds(newX, newY))
            return true
        if(gameboard[newX][newY].getAttribute('status') == SlotStatus.None)
        {
            //Push empty cells to array
            emptyCells.push(gameboard[newX][newY])
            return true
        }
        else if(CheckBounds(oppositeX, oppositeY))
        {
            if(gameboard[newX][newY].getAttribute('status') == SlotStatus.Player)
            {
                //If there is another player slot next to previous players move place computer marker
                //on opposite side
                if(gameboard[oppositeX][oppositeY].getAttribute('status') == SlotStatus.None)
                {
                    containerChildren.every(function (element) {
                        if(oppositeX == element.dataset.x && oppositeY == element.dataset.y)
                        {
                            newIndex = containerChildren.indexOf(element)
                            return false
                        }
                        return true
                    })
                }
            }
            return true
        }
    })
    
    if(newIndex != -1)
        return newIndex
    if(emptyCells.length != 0)
    {
        //If no player slot next to previous player move place on random empty 
        //slot near to previous player move
        eIdx = Math.floor(Math.random() * emptyCells.length)
        newX = emptyCells[eIdx].dataset.x
        newY = emptyCells[eIdx].dataset.y
        newIndex = containerChildren.indexOf(emptyCells[eIdx])
        return newIndex
    }
    // Given that all slots are filled around players last move, place on random slot
    return Math.floor(Math.random() * containerChildren.length)
}

function UpdateSlider()
{
    //If slider is changed update and restart grid
    if(textInput.value > 30)
        textInput.value = 30
    else if(textInput.value < 15)
        textInput.value = 15

    slider.value = textInput.value
    UpdateGrid();
}

function CheckTie()
{
    //If no more empty slots end game in tie
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
    var checkState
    isComputer ? checkState = SlotStatus.Computer : checkState = SlotStatus.Player
    x = parseInt(x)
    y = parseInt(y)
    const increments = 
    [
        [0,1],
        [1,1],
        [1,0],
        [1,-1]
    ]
    counterEnough = false
    //Cycle through each increment checking how many slots computer/player has in a line, 
    //each increment has a counter which when over 5 ends game
    increments.every(element => 
        {
            var counter = 1
            var incX = 0
            var incY = 0
            incX = x+parseInt(element[0])
            incY = y+parseInt(element[1])
            if(CheckBounds(incX,incY))
            {
                while(gameboard[incX][incY].getAttribute('status') == checkState)
                {
                    counter++
                    incX = incX+parseInt(element[0])
                    incY = incY+parseInt(element[1])
                    if(!CheckBounds(incX,incY))
                        break;
                }
            }
            incX = x-parseInt(element[0])
            incY = y-parseInt(element[1])
            if(CheckBounds(incX,incY))
            {
                while(gameboard[incX][incY].getAttribute('status') == checkState)
                {
                    counter++
                    incX = incX-parseInt(element[0])
                    incY = incY-parseInt(element[1])
                    if(!CheckBounds(incX,incY))
                        break;
                }
            }
            if(counter >= 5)
            {
                counterEnough = true
                return false
            }
            return true
                
        })
        return counterEnough
}

function CheckBounds(x, y)
{
    //Only perform actions if x and y in bounds
    return x >= 0 && y >= 0 && x < maxVal && y < maxVal
}

function UpdateBackgroundOnEnd()
{
    //Update background on game end
    if(playerWon)
    {
        endText.textContent = "You Win!"
        endText.style.color = "blue"
        document.body.style.backgroundColor = "rgb(93, 93, 255)"
    }
    else
    {
        endText.textContent = "Computer Won!"
        endText.style.color = "red"
        document.body.style.backgroundColor = "rgb(255, 93, 93)"
    }
}


UpdateGrid();
slider.onchange = UpdateGrid;
textInput.onchange = UpdateSlider
restart.onclick = UpdateGrid