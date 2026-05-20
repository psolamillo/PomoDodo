let countdownTimeInMins = 0;
let leftOverTime = 0;
let isPaused = false;
let currentMode;
let refreshId;
let targetEndTime;

const countdownTimerDisplay = document.querySelector(".timer__display p");

const buttonTimerControls = document.querySelectorAll(".timer__controls button");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

const customSettingForm = document.querySelector(".custom-settings-menu form");

console.log(customSettingForm)
function handleRestart(){
    console.log("restart logic handler");
}
function handlePause(){
    isPaused = true;
    leftOverTime = targetEndTime - Date.now();
    clearInterval(refreshId);
}
function handleContinue(){
    isPaused = false;
    timerCountdown(leftOverTime);
}

function handleStandard(){
    countdownTimeInMins = 25;
    timerCountdown(countdownTimeInMins * 60000);
}
function handleCustom(workTime){
    console.log("Cusom timer");
    timerCountdown(workTime * 60000);
   
}
function handleTimer(){
    console.log("count up timer");
}

function timerCountdown(timeInMillisec){
    
    //All times stored in milliseconds
    targetEndTime = Date.now() + timeInMillisec;

    refreshId = setInterval(() => {

        
        let difference = targetEndTime - Date.now();

        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownTimerDisplay.textContent =  hours + "h "+ minutes + "m " + seconds + "s ";

        if (difference < 0){
            alert("countdown complete");
            clearInterval(refreshId);
        }
        
    }, 1000)
    

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

customSettingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let workTime = e.target.sessiontime.value;
    let breakTime = e.target.breaktime.value;
    console.log(workTime, breakTime);
    handleCustom(workTime);
});

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

