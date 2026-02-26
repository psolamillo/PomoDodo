document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const timerDisplay = document.querySelector('.timer-display');
    const progressFill = document.querySelector('.progress-fill');
    const timerNotification = document.querySelector('.timer-notification');
    const workTimerHours = document.querySelector('.work-timer-hours');
    const workTimerMinutes = document.querySelector('.work-timer-minutes');
    const breakTimerHours = document.querySelector('.break-timer-hours');
    const breakTimerMinutes = document.querySelector('.break-timer-minutes');
    
    let timerInterval;
    let totalSeconds = 25 * 60;
    let currentSeconds = totalSeconds;
    let isRunning = false;
    let activeTab = 'Regular';
    let timerStartTime = 0;
    let isBreakTimer = false;
    let breakSeconds = 5 * 60;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeTab = this.textContent;
            
            resetTimer();
        });
    });
    
    playBtn.addEventListener('click', function() {
        if (!isRunning) {
            startTimer();
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        }
    });
    
    // Update timer display when work timer inputs change
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
            // For Timer tab, start counting up from zero
            if (currentSeconds === 0) {
                timerStartTime = Date.now();
            } else {
                // Resume from where we left off
                timerStartTime = Date.now() - (currentSeconds * 1000);
            }
            
            timerInterval = setInterval(function() {
                currentSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
                updateTimerDisplay();
                updateTimerProgress();
            }, 100);
        } else {
            timerInterval = setInterval(function() {
                if (currentSeconds > 0) {
                    currentSeconds--;
                    updateDisplay();
                    updateProgress();
                } else {
                    pauseTimer();
                    
                    if (!isBreakTimer && (activeTab === 'Regular' || activeTab === 'Custom')) {
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
        
        // Auto-start break timer
        setTimeout(() => {
            if (isBreakTimer) {
                startTimer();
            }
        }, 100);
    }
    
    function endBreakTimer() {
        isBreakTimer = false;
        timerNotification.textContent = '';
        
        // Reset to work timer
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
        
        if (activeTab === 'Timer') {
            // For Timer tab, reset to zero
            currentSeconds = 0;
            timerStartTime = 0;
            updateTimerDisplay();
            updateTimerProgress();
        } else if (activeTab === 'Custom') {
            // For Custom tab, use work timer values
            const hours = parseInt(workTimerHours.value) || 0;
            const minutes = parseInt(workTimerMinutes.value) || 0;
            totalSeconds = (hours * 60 + minutes) * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        } else {
            // For Regular tab, use default 25 minutes
            totalSeconds = 25 * 60;
            currentSeconds = totalSeconds;
            updateDisplay();
            updateProgress();
        }
    }
    
    function updateDisplay() {
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    }
    
    function updateTimerProgress() {
        // For Timer tab, progress bar fills up instead of depleting
        // Cap at 100% after 60 minutes
        const maxTime = 60 * 60; // 60 minutes in seconds
        const progress = Math.min((currentSeconds / maxTime) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }
});
