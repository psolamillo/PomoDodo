document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const playBtn = document.querySelector('.play-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const timerDisplay = document.querySelector('.timer-display');
    const progressFill = document.querySelector('.progress-fill');
    const timerNotification = document.querySelector('.timer-notification');
    const workTimerHours = document.querySelector('.work-timer-hours');
    const workTimerMinutes = document.querySelector('.work-timer-minutes');
    const breakTimerHours = document.querySelector('.break-timer-hours');
    const breakTimerMinutes = document.querySelector('.break-timer-minutes');
    const sessionList = document.querySelector('.session-list');
    const totalTimeElement = document.getElementById('total-time');
    const totalSessionsElement = document.getElementById('total-sessions');
    
    let timerInterval;
    let totalSeconds = 25 * 60;
    let currentSeconds = totalSeconds;
    let isRunning = false;
    let activeTab = 'Regular';
    let timerStartTime = 0;
    let isBreakTimer = false;
    let breakSeconds = 5 * 60;
    let sessionStartTime = 0;
    let currentSessionName = '';
    let sessionCounter = 1;
    let sessions = [];
    
    function updateTabTitle() {
        if (isRunning) {
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            let timerType = '';
            if (isBreakTimer) {
                timerType = 'Break';
            } else if (activeTab === 'Regular') {
                timerType = 'Work';
            } else if (activeTab === 'Custom') {
                timerType = 'Work(Custom)';
            } else if (activeTab === 'Timer') {
                timerType = 'Count-up';
            }
            
            document.title = `${timeString} - ${timerType} - PomoDodo`;
        } else {
            document.title = 'PomoDodo';
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeTab = this.textContent;
            
            resetTimer();
            updateTabTitle();
        });
    });
    
    playBtn.addEventListener('click', function() {
        if (!isRunning) {
            startTimer();
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        if (isRunning && !isBreakTimer) {
            cancelSession();
        }
    });
    
    function cancelSession() {
        if (currentSessionName) {
            const workedTime = totalSeconds - currentSeconds;
            addSessionToLog(currentSessionName, workedTime);
        }
      
        pauseTimer();
        isBreakTimer = false;
        timerNotification.textContent = '';
        
        if (activeTab === 'Timer') {
            currentSeconds = 0;
            timerStartTime = 0;
            updateTimerDisplay();
            updateTimerProgress();
        } else if (activeTab === 'Custom') {
            const hours = parseInt(workTimerHours.value) || 0;
            const minutes = parseInt(workTimerMinutes.value) || 0;
            totalSeconds = (hours * 60 + minutes) * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        } else {
            totalSeconds = 25 * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        }
        
        currentSessionName = '';
        updateTabTitle();
    }
    
    function addSessionToLog(name, workedSeconds) {
        const session = {
            name: name,
            time: workedSeconds,
            timestamp: new Date()
        };
        
        sessions.push(session);
        updateSessionList();
        updateStats();
    }
    
    function updateSessionList() {
        sessionList.innerHTML = '';
        
        sessions.forEach(session => {
            const sessionItem = document.createElement('div');
            sessionItem.className = 'session-item';
            
            const minutes = Math.floor(session.time / 60);
            const seconds = session.time % 60;
            const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            
            sessionItem.innerHTML = `
                <span class="session-name">${session.name}</span>
                <span class="session-time">${timeString}</span>
            `;
            
            sessionList.appendChild(sessionItem);
        });
        
        sessionList.scrollTop = sessionList.scrollHeight;
    }
    
    function updateStats() {
        const totalSessions = sessions.length;
        const totalSeconds = sessions.reduce((sum, session) => sum + session.time, 0);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        let timeString = '';
        if (hours > 0) {
            timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            timeString = `${minutes}m ${seconds}s`;
        } else {
            timeString = `${seconds}s`;
        }
        
        totalTimeElement.textContent = timeString;
        totalSessionsElement.textContent = totalSessions;
    }
    
    workTimerHours.addEventListener('input', function() {
        if (activeTab === 'Custom') {
            updateCustomTimerDisplay();
        }
    });
    
    workTimerMinutes.addEventListener('input', function() {
        if (activeTab === 'Custom') {
            updateCustomTimerDisplay();
        }
    });
    
    breakTimerHours.addEventListener('input', function() {
        if (activeTab === 'Custom') {
            updateBreakTimerDuration();
        }
    });
    
    breakTimerMinutes.addEventListener('input', function() {
        if (activeTab === 'Custom') {
            updateBreakTimerDuration();
        }
    });
    
    function updateCustomTimerDisplay() {
        const hours = parseInt(workTimerHours.value) || 0;
        const minutes = parseInt(workTimerMinutes.value) || 0;
        totalSeconds = (hours * 60 + minutes) * 60;
        currentSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
    }
    
    function updateBreakTimerDuration() {
        const hours = parseInt(breakTimerHours.value) || 0;
        const minutes = parseInt(breakTimerMinutes.value) || 0;
        breakSeconds = (hours * 60 + minutes) * 60;
        
        if (isBreakTimer && activeTab === 'Custom') {
            totalSeconds = breakSeconds;
            currentSeconds = breakSeconds;
            updateDisplay();
            updateProgress();
        }
    }
    
    function startTimer() {
        isRunning = true;
        
        if (activeTab === 'Timer') {
            if (currentSeconds === 0) {
                timerStartTime = Date.now();
            } else {
                timerStartTime = Date.now() - (currentSeconds * 1000);
            }
            
            timerInterval = setInterval(function() {
                currentSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
                updateTimerDisplay();
                updateTimerProgress();
            }, 100);
        } else {
            if (!isBreakTimer && !currentSessionName) {
                currentSessionName = `Task #${sessionCounter}`;
                sessionCounter++;
            }
            
            if (!isBreakTimer && !sessionStartTime) {
                sessionStartTime = Date.now();
            }
            
            timerInterval = setInterval(function() {
                if (currentSeconds > 0) {
                    currentSeconds--;
                    updateDisplay();
                    updateProgress();
                } else {
                    pauseTimer();
                    
                    if (!isBreakTimer && (activeTab === 'Regular' || activeTab === 'Custom')) {
                        if (currentSessionName) {
                            const workedTime = totalSeconds;
                            addSessionToLog(currentSessionName, workedTime);
                            currentSessionName = '';
                        }
                        sessionStartTime = 0;
                        
                        alert('Work session completed! Time for a break.');
                        startBreakTimer();
                    } else {
                        endBreakTimer();
                    }
                }
            }, 1000);
        }
    }
    
    function startBreakTimer() {
        isBreakTimer = true;
        
        if (activeTab === 'Custom') {
            updateBreakTimerDuration();
        } else {
            breakSeconds = 5 * 60;
        }
        
        currentSeconds = breakSeconds;
        totalSeconds = breakSeconds;
        timerNotification.textContent = 'Time for a break!';
        updateDisplay();
        updateProgress();
        
        setTimeout(() => {
            if (isBreakTimer) {
                startTimer();
            }
        }, 100);
    }
    
    function endBreakTimer() {
        isBreakTimer = false;
        timerNotification.textContent = '';
        
        if (activeTab === 'Custom') {
            const hours = parseInt(workTimerHours.value) || 0;
            const minutes = parseInt(workTimerMinutes.value) || 0;
            totalSeconds = (hours * 60 + minutes) * 60;
        } else {
            totalSeconds = 25 * 60;
        }
        
        currentSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
        
        updateTabTitle();
        alert('Break completed! Ready for another session?');
    }
    
    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }
    
    function resetTimer() {
        pauseTimer();
        isBreakTimer = false;
        timerNotification.textContent = '';
        sessionStartTime = 0;
        
        if (activeTab === 'Timer') {
            currentSeconds = 0;
            timerStartTime = 0;
            updateTimerDisplay();
            updateTimerProgress();
        } else if (activeTab === 'Custom') {
            const hours = parseInt(workTimerHours.value) || 0;
            const minutes = parseInt(workTimerMinutes.value) || 0;
            totalSeconds = (hours * 60 + minutes) * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        } else {
            totalSeconds = 25 * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        }
        
        updateTabTitle();
    }
    
    function updateDisplay() {
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        updateTabTitle();
    }
    
    function updateProgress() {
        const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
        progressFill.style.width = `${100 - progress}%`;
    }
    
    function updateTimerDisplay() {
        const hours = Math.floor(currentSeconds / 3600);
        const minutes = Math.floor((currentSeconds % 3600) / 60);
        const seconds = currentSeconds % 60;
        
        if (hours > 0) {
            timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        updateTabTitle();
    }
    
    function updateTimerProgress() {
        const maxTime = 60 * 60;
        const progress = Math.min((currentSeconds / maxTime) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }
});
