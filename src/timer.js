'use strict'

import * as constants from './common/const.js';

var show = document.getElementById('timer');
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var reset = document.getElementById('reset');


var logTextarea = document.getElementById('logTextarea')

var targetHour = document.getElementById('targetHour');
var targetMinutes = document.getElementById('targetMinutes');
var targetSeconds = document.getElementById('targetSeconds');

var interval;
var hour = constants.TIMERNUMBER.W_ZERO;
var minutes = constants.TIMERNUMBER.W_ZERO;
var seconds = constants.TIMERNUMBER.W_ZERO;

// 合計時間
let totalTime;

// 初期表示
window.onload = function () {
    isInputAndTimerValid();
    logTextarea.disabled = true;
    reset.disabled = true;
}

// startButton押下時
start.addEventListener('click', function () {
    interval = setInterval(timer, 1000);
    start.disabled = true;
    reset.disabled = false;
    console.log("Timer Start");
}, false);

// stopButton押下時
stop.addEventListener('click', function () {
    clearInterval(interval);
    console.log('Timer Stop');
}, false);

// resetButton押下時
reset.addEventListener('click', function () {
    initTimer();
    clearInterval(interval);
    start.disabled = false;
    reset.disabled = true;
    console.log("Timer Reset");
}, false);

// inputEvent　Timer設定(時間)
targetHour.addEventListener('input', isInputAndTimerValid, false);

// inputEvent　Timer設定(分)
targetMinutes.addEventListener('input', isInputAndTimerValid, false);

// inputEvent　Timer設定(秒)
targetSeconds.addEventListener('input', isInputAndTimerValid, false);

var timer = function () {
    function countUp() {
        seconds = advanceTime(seconds);
        if (seconds > constants.TIMERNUMBER.FIFTY_SIX) {
            seconds = constants.TIMERNUMBER.W_ZERO;
            minutes = advanceTime(minutes);
            if (minutes > constants.TIMERNUMBER.FIFTY_SIX) {
                minutes = constants.TIMERNUMBER.w_zero;
                hour = advanceTime(hour);
            }
        }
        // 画面に表示
        show.innerHTML = `${hour} : ${minutes} : ${seconds}`;
    }
    if (show.innerHTML === `${targetHour.value} : ${targetMinutes.value} : ${targetSeconds.value}`) {
        setTimeAlert();
        logDisplay();
        clearInterval(interval);
        initTimer();
        return;
    }
    return countUp();
};

// 1秒づつ時間を進める
var advanceTime = (time) => {
    time++;
    return time > constants.TIMERNUMBER.NINE ? time : `0${time}`;
};

// Timer初期化処理
var initTimer = function () {
    hour = constants.TIMERNUMBER.W_ZERO;
    minutes = constants.TIMERNUMBER.W_ZERO;
    seconds = constants.TIMERNUMBER.W_ZERO;
    show.innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

// Timerの妥当性確認
var setTimerValidation = function () {
    if ((0 <= parseInt(targetHour.value) && parseInt(targetHour.value) <= 60) &&
        (0 <= parseInt(targetMinutes.value) && parseInt(targetMinutes.value) <= 60) &&
        (0 < parseInt(targetSeconds.value) && parseInt(targetSeconds.value) <= 60)) {
        return true;
    }
    return false;
}

// 入力値の存在確認
function isInputCheck() {
    console.log(targetHour.value);
    if (targetHour.value && targetMinutes.value && targetSeconds.value) {
        return true;
    }
    return false;
}

// 入力値の存在確認とTimerの妥当性確認
function isInputAndTimerValid() {
    if (isInputCheck() && setTimerValidation()) {
        start.disabled = false;
    } else {
        start.disabled = true;
    }
}

// 設定時間が来た時のAlert
function setTimeAlert() {
    let w = remote.getCurrentWindow();
    let setTimerAlertMessage = dialog.showMessageBox(w, {
        title: constants.TITLE.FINISH,
        message: constants.MESSAGE.FINISH,
        detail: `${show.innerHTML}`
    }).then((event) => {
        if (event) {
            start.disabled = false;
            reset.disabled = true;
            ipcRenderer.send('show-window');
        }
    });
    console.log(setTimerAlertMessage);
}

// logを画面に表示する処理
function logDisplay() {
    var currentTimes;
    var totalTimes;
    if (totalTime) {
        currentTimes = show.innerHTML.replaceAll(' ', '').split(':').map(Number).reverse();
        totalTimes = totalTime.replaceAll(' ', '').split(':').map(Number).reverse();
        if (currentTimes[0] + totalTimes[0] >= constants.TIMERNUMBER.FIFTY_SIX) {
            totalTimes[0] = currentTimes[0] + totalTimes[0] - constants.TIMERNUMBER.SIXTY;
            totalTimes[1]++;
        } else {
            totalTimes[0] += currentTimes[0];
        }

        if (currentTimes[1] + totalTimes[1] >= constants.TIMERNUMBER.FIFTY_SIX) {
            totalTimes[1] = currentTimes[1] + totalTimes[1] - constants.TIMERNUMBER.SIXTY;
            totalTimes[2]++;
        } else {
            totalTimes[1] += currentTimes[1];
        }
        totalTime = (constants.TIMERNUMBER.W_ZERO + totalTimes[2]).slice(-2) + ' : ' + (constants.TIMERNUMBER.W_ZERO + totalTimes[1]).slice(-2) + ' : ' + (constants.TIMERNUMBER.W_ZERO + totalTimes[0]).slice(-2);
    } else {
        totalTime = show.innerHTML;
    }
    logTextarea.value += `FinishTime  ${show.innerHTML}` + "\n" + `TotalTime   ${totalTime}` + "\n";
}