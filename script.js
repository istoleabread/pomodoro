// It works!!!!!! 😭
// The theme too!
// Also click on the timer when a background is enabled, it'll make the timer more clear
// Btw, the notification tone is Far Away by GRX & Florian Picasso:)
// Why does the js not work correctly in mobile devices?

function getId(id) {
    return document.getElementById(id);
}

var settingsVisible = false;
const MENU = getId("menu");
const TOPHEADER = getId("topHeader");
const BAR1 = getId("bar1");
const BAR2 = getId("bar2");
const BAR3 = getId("bar3");
function showSettings() {
    if (settingsVisible) {
        if (window.innerWidth >= 1024) {
            MENU.style.right = "-50%";
        } else if (window.innerWidth >= 768) {
            MENU.style.right = "-60%";
        } else {
            MENU.style.right = "-101%";
        }
        if (workRunning) {
            TOPHEADER.style.backgroundColor = "#ff5a5a";
        } else if (shortBreakRunning) {
            TOPHEADER.style.backgroundColor = "#03c03c";
        } else if (longBreakRunning) {
            TOPHEADER.style.backgroundColor = "#1e90ff";
        }
        MENU.style.filter = "blur(3px)";
        BAR1.style.transform = "rotateZ(0deg)";
        BAR3.style.transform = "rotateZ(0deg)";
        BAR2.style.opacity = "1";
        settingsVisible = false;
    } else {
        TOPHEADER.style.backgroundColor = "#AAA";
        MENU.style.right = "0%";
        MENU.style.filter = "blur(0px)";
        BAR1.style.transform = "rotateZ(45deg)";
        BAR3.style.transform = "rotateZ(-45deg)";
        BAR2.style.opacity = "0";
        settingsVisible = true;
    }

}

var workRunning = true;
var shortBreakRunning = false;
var longBreakRunning = false;
const MINUTES = getId("minutes");
const SECONDS = getId("seconds");
const WORKSLIDER = getId("workSlider");
const SHORTBREAKSLIDER = getId("breakSlider");
const LONGBREAKSLIDER = getId("longBreakSlider");
function changeWork() {
    getId("workTime").textContent = WORKSLIDER.value;
    if (workRunning) {
        MINUTES.textContent = `${WORKSLIDER.value}`.padStart(2, '0');
        SECONDS.textContent = `00`;
    }
}
function changeShortBreak() {
    getId("breakTime").textContent = SHORTBREAKSLIDER.value;
    if (shortBreakRunning) {
        MINUTES.textContent = `${SHORTBREAKSLIDER.value}`.padStart(2, '0');
        SECONDS.textContent = `00`;
    }
}
function changeLongBreak() {
    getId("longBreakTime").textContent = LONGBREAKSLIDER.value;
    if (longBreakRunning) {
        MINUTES.textContent = `${LONGBREAKSLIDER.value}`.padStart(2, '0');
        SECONDS.textContent = `00`;
    }
}
// You may wonder why not just combine these 3 upper functions with the one below and remove the repetition!!
// That's because I've spent more than an hour figuring out how to do it and failed miserably
// So **** this, 3 extra functions may not be that bad for the browser I guess (cries in old pc)
function changeTime() {
    if (workRunning) {
        MINUTES.textContent = `${WORKSLIDER.value}`.padStart(2, '0');
    } else if (shortBreakRunning) {
        MINUTES.textContent = `${SHORTBREAKSLIDER.value}`.padStart(2, '0');
    } else if (longBreakRunning) {
        MINUTES.textContent = `${LONGBREAKSLIDER.value}`.padStart(2, '0');
    }
    SECONDS.textContent = `00`;
}

const BODY = document.getElementsByTagName("body")[0];
var backgroundImage = false;
var TIMERBACKGROUNDCOLOR = getId("toggleBGColor");
// It sometimes fetches random unrelated images for some reason, but it works nonetheless
function changeBackground() {
    var bckgrnd = document.querySelectorAll("input[name='backgroundOption']:checked");
    let randomNum = Math.round(Math.random() * 561247)
    let url = `https://source.unsplash.com/random/1920x1080/?`;
    for (let i = 0; i < bckgrnd.length; i++) {
        console.log(bckgrnd[i].value);
        url += bckgrnd[i].value + ",";
    }
    url += `sig=${randomNum}`
    BODY.style.backgroundImage = `url("${url}")`;
    backgroundImage = true;
    TIMERBACKGROUNDCOLOR.style.cursor = "pointer";
}

const RESETBUTTON = getId("reset");
const STARTBUTTON = getId("start");
RESETBUTTON.addEventListener("click", function () {
    clearInterval(startTheTimer);
    changeTime();
    STARTBUTTON.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
})

var isPaused = true;
function togglePlayPause() {
    if (isPaused) {
        if (Notification.permission !== "granted") {
            notify("Notifications are now enabled!");
        }
        STARTBUTTON.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
        isPaused = false;
        runTimer();
    } else {
        STARTBUTTON.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
        isPaused = true;
        clearInterval(startTheTimer);
    }
}
STARTBUTTON.addEventListener("click", togglePlayPause)

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        togglePlayPause();
    }
});

BGVisible = false;
TIMERBACKGROUNDCOLOR.addEventListener("click", function () {
    if (backgroundImage) {
        if (BGVisible) {
            TIMERBACKGROUNDCOLOR.style.backgroundColor = "transparent";
            BGVisible = false;
        } else {
            TIMERBACKGROUNDCOLOR.style.backgroundColor = "rgba(255,255,255,0.9)"
            BGVisible = true;
        }
    } audio.currentTime = 0;
})

// I am using the Notification API to notify the user, alert seemed kinda annoying
// and also it blocks the execution of js while its running:/
function notify(msg) {
    const ICON = "duckwithbread.png"; // This for some reason isn't visible in firefox?
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification("Pomodoro Timer", { body: msg, icon: ICON });
                notification.onclick = function () {
                    window.focus();
                    audio.pause();
                }
            }
        });
    } else if (Notification.permission === "granted") {
        const notification = new Notification("Pomodoro Timer! (Click to turn sound off)", { body: msg, icon: ICON });
        notification.onclick = function () {
            window.focus();
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

var startTheTimer;
var shortCount = 0;
var pomodoroCount = 0;
var audio = new Audio("faraway.mp3");
const WORKANDBREAKTEXT = getId("time");
// The logic is basically fetch the data from the timer div instead of sliders
// Amd when the time reaches 0, update the values from sliders to the divs, stop the interval and start interval again
// Works flawlessly!! (or so I think)
function runTimer() {
    var minutes = getId("minutes");
    var seconds = getId("seconds");
    var totalSeconds = (minutes.textContent * 60) + +(seconds.textContent);
    startTheTimer = setInterval(function () {
        totalSeconds--;
        minutes.textContent = `${Math.floor(totalSeconds / 60)}`.padStart(2, '0');
        seconds.textContent = `${(totalSeconds % 60)}`.padStart(2, '0');
        if (totalSeconds <= 0) {
            if (getId("notify").checked) {
                audio.play();
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, 15000);
                if (workRunning) {
                    if (shortCount == 5) {
                        notify("Your work time has ended. You can now take a looooong break. Enjoy!");
                    } else {
                        notify("Your work time has ended. Now you can take a short break!");
                    }
                } else if (shortBreakRunning) {
                    notify("Your short break has ended! Get back to work.");
                } else if (longBreakRunning) {
                    notify("Your loooong break has ended! Get to work now!");
                }
            }
            if (getId("autoRestart").checked) {
                if (shortBreakRunning || longBreakRunning) {
                    WORKANDBREAKTEXT.textContent = "Work Time";
                    document.querySelector("body").style.backgroundColor = "#ff5a5a";
                    TOPHEADER.style.backgroundColor = "#ff5a5a";
                }
                if (workRunning) {
                    if (shortCount == 5) {
                        workRunning = false;
                        shortBreakRunning = false;
                        longBreakRunning = true;
                        shortCount = 0;
                        WORKANDBREAKTEXT.textContent = "Long Break";
                        document.querySelector("body").style.backgroundColor = "#1e90ff";
                        TOPHEADER.style.backgroundColor = "#1e90ff";
                    } else {
                        WORKANDBREAKTEXT.textContent = "Short Break";
                        document.querySelector("body").style.backgroundColor = "#03c03c";
                        TOPHEADER.style.backgroundColor = "#03c03c";
                        workRunning = false;
                        shortBreakRunning = true;
                        shortCount++;
                        getId("shortBreakCount").textContent = shortCount;
                    }
                } else if (shortBreakRunning) {
                    shortBreakRunning = false;
                    workRunning = true;
                } else if (longBreakRunning) {
                    pomodoroCount++;
                    getId("pomodoroCount").textContent = pomodoroCount;
                    getId("shortBreakCount").textContent = 0;
                    longBreakRunning = false;
                    workRunning = true;
                }
                changeTime();
                clearInterval(startTheTimer);
                runTimer();
            } else {
                clearInterval(startTheTimer);
                STARTBUTTON.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
            }
        }
    }, 1000);
}

var infoVisible = false;
const CROSS = getId("cross");
const INFODIV = getId("infoDiv");
const WRAPPER = getId("wrapper");
const BARS = getId("bars");
function toggleInfoVisibility() {
    if (infoVisible) {
        CROSS.style.scale = "0";
        CROSS.style.opacity = "0.2";
        INFODIV.style.scale = "0";
        INFODIV.style.opacity = "0.2";
        WRAPPER.style.filter = "blur(0px)";
        BARS.style.pointerEvents = "all";
        infoVisible = false;
    } else {
        CROSS.style.scale = "1";
        CROSS.style.opacity = "1";
        INFODIV.style.scale = "1";
        INFODIV.style.opacity = "1";
        WRAPPER.style.filter = "blur(2px)";
        BARS.style.pointerEvents = "none"; // Just to annoy the user so they can't click on the hamborger while info is shown
        infoVisible = true;
    }
}
getId("info").addEventListener("click", toggleInfoVisibility);
CROSS.addEventListener("click", function () {
    toggleInfoVisibility();
})
