const countdownTimerDisplay = document.querySelector(".timer__display p");

const buttonTimerControls = document.querySelectorAll(".timer__controls button");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

function handleRestart(){
    console.log("restart logic handler");
}
function handlePause(){
    console.log("pause logic handler");
}
function handleContinue(){
    console.log("continue logic handler");
}

function handleStandard(){
    console.log("standard timer");
}
function handleCustom(){
    console.log("Cusom timer");
}
function handleTimer(){
    console.log("count up timer");
}


const actions = {
    Restart: handleRestart,
    Pause: handlePause,
    Continue: handleContinue,
}

const mode = {
    Standard: handleStandard,
    Custom: handleCustom,
    Timer: handleTimer,

}

buttonTypeSelector.forEach(button => {
    button.addEventListener('click', (e) => {
        let currentButton = mode[e.target.dataset.mode];
        
        if (currentButton) {
            currentButton();
        }
    })
})

buttonTimerControls.forEach(button => {
    button.addEventListener('click', (e) => {
        let currentButton = actions[e.target.dataset.action];

        if (currentButton) {
            currentButton();
        }
    })
})

