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

function timerCountdown(timeInMins){
    
    //All times stored in milliseconds
    let countdownTime = new Date().getTime() + (timeInMins * 60 * 1000);
    let now = new Date().getTime();
    let difference = countdownTime - now;
    
    let refreshId = setInterval(() => {
        

        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        difference = difference - 1000;
    
        countdownTimerDisplay.textContent =  hours + "h "+ minutes + "m " + seconds + "s ";

        if (difference < -1){
            alert("countdown complete");
            clearInterval(refreshId);
        }
        
    }, 1000)
    

}

timerCountdown(1)
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

