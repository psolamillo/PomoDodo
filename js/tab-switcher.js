document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const timerDisplay = document.querySelector('.timer-display');
    const progressFill = document.querySelector('.progress-fill');
    const workTimerHours = document.querySelector('.work-timer-hours');
    const workTimerMinutes = document.querySelector('.work-timer-minutes');
    
    let timerInterval;
    let totalSeconds = 25 * 60;
    let currentSeconds = totalSeconds;
    let isRunning = false;
    let activeTab = 'Regular';
    let timerStartTime = 0; // For Timer functionality
    
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
    
    function updateCustomTimerDisplay() {
        const hours = parseInt(workTimerHours.value) || 0;
        const minutes = parseInt(workTimerMinutes.value) || 0;
        totalSeconds = (hours * 60 + minutes) * 60;
        currentSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
    }
    
    function startTimer() {
        isRunning = true;
        
        if (activeTab === 'Timer') {
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
                    alert('Timer completed!');
                }
            }, 1000);
        }
    }
    
    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }
    
    function resetTimer() {
        pauseTimer();
        
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
        // Cap is 100% after 60 minutes
        const maxTime = 60 * 60;
        const progress = Math.min((currentSeconds / maxTime) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }
});
