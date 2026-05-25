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
let sessionLogEntries = [];
let sessionStartTime = null;


const countdownTimerDisplay = document.querySelector(".timer__display p");

const currentModeDisplay = document.querySelector(".timer__display h3");

const buttonTimerControls = document.querySelectorAll(".timer__controls button");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

const customSettingForm = document.querySelector(".custom-settings-menu form");

const sessionLogContainer = document.querySelector(".session-log__entries");

function hideCustomSettingsMenu(hide){
    if (hide) {
        customSettingForm.style.display = 'none';
    }

    if (!hide){
        customSettingForm.style.display = 'flex';
    }

}

function handleRestart(){
    if (sessionStartTime) {
        const duration = Date.now() - sessionStartTime;
        addLogEntry('Restarted', duration);
    }
    clearInterval(refreshId);
    totalTime = 0;
    leftOverTime = 0;
    leftOverTotalTime = 0;
    sessionStartTime = null;
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

function formatDuration(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addLogEntry(eventName, durationMs) {
    const entry = {
        event: eventName,
        time: new Date(),
        duration: durationMs
    };
    sessionLogEntries.push(entry);
    
    const entryDiv = document.createElement('div');
    entryDiv.className = 'session-log__entry';
    entryDiv.innerHTML = `
        <p>${eventName}</p>
        <div>
            <p>${formatTime(entry.time)}</p>
            <p>${durationMs ? formatDuration(durationMs) : '-'}</p>
        </div>
    `;
    sessionLogContainer.appendChild(entryDiv);
}

async function startTimer(){
    sessionStartTime = Date.now();
    
    if (currentMode === 'Custom') {
        const workDuration = (customWorkTime || 25) * 60000;
        await timerCountdown(workDuration);
        addLogEntry('Work Complete', workDuration);
        alert("Time for a break! Click ok to continue");
        currentModeDisplay.textContent = "Take a break!"
        const breakDuration = (customBreakTime || 5) * 60000;
        await timerCountdown(breakDuration);
        addLogEntry('Break Complete', breakDuration);
        alert("Break Complete! Start another session!")
      

    } else if (currentMode === 'Standard'){
        console.log("StartTimer");
        currentModeDisplay.textContent = "Time to Work!"
        await timerCountdown(25 * 60000);
        addLogEntry('Work Complete', 25 * 60000);
        alert("Time for a break! Click ok to continue");
        currentModeDisplay.textContent = "Take a break!"
        await timerCountdown(5 * 60000);
        addLogEntry('Break Complete', 5 * 60000);
        alert("Break Complete! Start another session!")
    } else if (currentMode === 'Timer'){
        timerCountUp();
    }
    
}

function handleStandard(){
    currentMode = 'Standard';
    hideCustomSettingsMenu(true);
    countdownTimerDisplay.textContent = formatDuration(25 * 60000);
}
function handleCustom(workTime, breakTime){
    currentMode = 'Custom';
    hideCustomSettingsMenu(false);
    if (workTime !== undefined) {
        customWorkTime = workTime;
    }
    if (breakTime !== undefined) {
        customBreakTime = breakTime;
    }
    countdownTimerDisplay.textContent = formatDuration((customWorkTime || 25) * 60000);
}
function handleTimer(){
    currentMode = 'Timer';
    hideCustomSettingsMenu(true);
    countdownTimerDisplay.textContent = formatDuration(0);
    console.log("Current Mode: Timer");
}


function timerCountdown(timeInMillisec){
    
    
    return new Promise ((resolve) => {
        clearInterval(refreshId);
        //All times stored in milliseconds
        targetEndTime = Date.now() + timeInMillisec;
        
        refreshId = setInterval(() => {

            
            let difference = targetEndTime - Date.now();

            countdownTimerDisplay.textContent = formatDuration(difference);

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
            

            countdownTimerDisplay.textContent = formatDuration(totalTime);
            
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
        buttonTypeSelector.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        let currentButton = mode[e.target.dataset.mode];
        
        if (currentButton) {
            currentButton();
        }
    })
})

buttonTimerControls.forEach(button => {
    button.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        let currentButton = actions[btn.dataset.action];

        console.log(`pressed ${btn.dataset.action}`);
        if (currentButton) {
            currentButton();
        }
    })
})

hideCustomSettingsMenu(true);