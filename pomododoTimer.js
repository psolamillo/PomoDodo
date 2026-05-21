let countdownTimeInMins = 0;
let leftOverTime = 0;
let leftOverTotalTime = 0;
let isPaused = false;
let currentMode;
let refreshId;
let totalTime = 0;
let startTime;
let targetEndTime;
let customWorkTime = 0;
let customBreakTime = 0;


const countdownTimerDisplay = document.querySelector(".timer__display p");

const currentModeDisplay = document.querySelector(".timer__display h3");

const buttonTimerControls = document.querySelectorAll(".timer__controls button");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

const customSettingForm = document.querySelector(".custom-settings-menu form");

function handleRestart(){
    clearInterval(refreshId);
    totalTime = 0;
    leftOverTime = 0;
}
function handlePause(){
    isPaused = true;
    if (currentMode === 'Custom' || currentMode === 'Standard'){
        leftOverTime = targetEndTime - Date.now();
    }
    else if (currentMode === 'Timer'){
        leftOverTotalTime = totalTime;
    }

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

async function startTimer(){
    if (currentMode === 'Custom') {
        await timerCountdown((customWorkTime || 25) * 60000);
        alert("Time for a break! Click ok to continue");
        currentModeDisplay.textContent = "Take a break!"
        await timerCountdown((customBreakTime || 5) * 60000);
        alert("Break Complete! Start another session!")
      

    } else if (currentMode === 'Standard'){
        currentModeDisplay.textContent = "Time to Work!"
        await timerCountdown(25 * 60000);
        alert("Time for a break! Click ok to continue");
        currentModeDisplay.textContent = "Take a break!"
        await timerCountdown(5 * 60000);
        alert("Break Complete! Start another session!")
    } else if (currentMode === 'Timer'){
        timerCountUp();
    }
    
}

function handleStandard(){
    currentMode = 'Standard';
}
function handleCustom(workTime, breakTime){
    currentMode = 'Custom';
    if (workTime !== undefined) {
        customWorkTime = workTime;
    }
    if (breakTime !== undefined) {
        customBreakTime = breakTime;
    }
}
function handleTimer(){
    currentMode = 'Timer';
    console.log("Current Mode: Timer");
}


function timerCountdown(timeInMillisec){
    
    
    return new Promise ((resolve) => {
        clearInterval(refreshId);
        //All times stored in milliseconds
        targetEndTime = Date.now() + timeInMillisec;
        
        refreshId = setInterval(() => {

            
            let difference = targetEndTime - Date.now();

            //Convert the time in millisec to respective time units
            var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((difference % (1000 * 60)) / 1000);

            countdownTimerDisplay.textContent =  hours + "h "+ minutes + "m " + seconds + "s ";

            if (difference < 0){
                clearInterval(refreshId);
                resolve();
            }
            
        }, 1000)
    })

}

function timerCountUp(){

    clearInterval(refreshId);
    startTime = Date.now();
    refreshId = setInterval(() => {
        
            if (leftOverTotalTime != 0) {
                totalTime = (Date.now() - startTime) + leftOverTotalTime;
            } else {
                totalTime = Date.now() - startTime;
            }
            

            //Convert the time in millisec to respective time units
            var hours = Math.floor((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

            countdownTimerDisplay.textContent =  hours + "h "+ minutes + "m " + seconds + "s ";
            
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
    handleCustom(workTime, breakTime);
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

