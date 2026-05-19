let timerMode = "Standard";

const countdownTimerDisplay = document.querySelector(".timer__display p");

const buttonTypeSelector = document.querySelectorAll(".timer__type-selection button");

console.log(buttonTypeSelector);
buttonTypeSelector.forEach(button => {
    button.addEventListener('click', (e) => {
        timerMode = `${e.target.textContent}`
        console.log(`Timer Mode set to ${timerMode}`)
    })
})