let countdownTimeInMins = 0;
let leftOverTime = 0;
let isPaused = false;
let currentMode;
let refreshId;
let targetEndTime;
let customWorkTime = 0;

const countdownTimerDisplay = document.querySelector(".timer__display p");

const buttonTimerControls = document.querySelectorAll(".timer__controls button");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

const customSettingForm = document.querySelector(".custom-settings-menu form");

console.log(customSettingForm)
function handleRestart(){
    clearInterval(refreshId);
    leftOverTime = 0;
    startTimer();
}
function handlePause(){
    isPaused = true;
    leftOverTime = targetEndTime - Date.now();
    clearInterval(refreshId);
}
function handleContinue(){
    isPaused = false;
    if (leftOverTime > 0) {
        timerCountdown(leftOverTime);
    } else {
        startTimer();
    }
}

function startTimer(){
    if (currentMode === 'Custom') {
        timerCountdown((customWorkTime || 25) * 60000);
    } else {
        timerCountdown(25 * 60000);
    }
}

function handleStandard(){
    currentMode = 'Standard';
}
function handleCustom(workTime){
    currentMode = 'Custom';
    if (workTime !== undefined) {
        customWorkTime = workTime;
    }
}
function handleTimer(){
    currentMode = 'Timer';
}

function timerCountdown(timeInMillisec){
    clearInterval(refreshId);
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
    console.log("Form submitted");

    let workTime = parseInt(e.target.sessiontime.value);
    let breakTime = parseInt(e.target.breaktime.value);
    console.log("workTime:", workTime, "breakTime:", breakTime);
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

