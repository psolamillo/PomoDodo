let timerMode = "Standard";

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

const actions = {
    Restart: handleRestart,
    Pause: handlePause,
    Continue: handleContinue,
}

console.log(buttonTypeSelector);
buttonTypeSelector.forEach(button => {
    button.addEventListener('click', (e) => {
        timerMode = `${e.target.textContent}`
        console.log(`Timer Mode set to ${timerMode}`)
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

