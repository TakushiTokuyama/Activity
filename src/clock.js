'use strict'

import { timerNumbers } from './const.js';

var show = document.getElementById('clock');
var reset = document.getElementById('reset');
var start = document.getElementById('start');

var logTextarea = document.getElementById('logTextarea')

var targetHour = document.getElementById('targetHour');
var targetMinutes = document.getElementById('targetMinutes');
var targetSeconds = document.getElementById('targetSeconds');

var interval;
var hour = timerNumbers.w_zero;
var minutes = timerNumbers.w_zero;
var seconds = timerNumbers.w_zero;

// 合計時間
let totalTime;

// 初期表示
window.onload = function () {
    isInputAndTimerValid();
    logTextarea.disabled = true;
}

// startButton押下時
start.addEventListener('click', function () {
    interval = setInterval(clock, 1000);
    console.log("Timer Start");
}, false);

// stopButton押下時
reset.addEventListener('click', function () {
    initTimer();
    clearInterval(interval);
    console.log("Timer Reset");
}, false);

// inputEvent　Timer設定(時間)
targetHour.addEventListener('input', isInputAndTimerValid, false);

// inputEvent　Timer設定(分)
targetMinutes.addEventListener('input', isInputAndTimerValid, false);

// inputEvent　Timer設定(秒)
targetSeconds.addEventListener('input', isInputAndTimerValid, false);

var clock = function () {
    function countUp() {
        seconds = advanceTime(seconds);
        if (seconds > timerNumbers.fifty_six) {
            seconds = timerNumbers.w_zero;
            minutes = advanceTime(minutes);
            if (minutes > timerNumbers.fifty_six) {
                minutes = timerNumbers.w_zero;
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
    return time > timerNumbers.nine ? time : `0${time}`;
};

// Timer初期化処理
var initTimer = function () {
    hour = timerNumbers.w_zero;
    minutes = timerNumbers.w_zero;
    seconds = timerNumbers.w_zero;
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
        title: 'Message',
        message: 'お疲れ様です！',
        detail: `${show.innerHTML}`
    });
    console.log(setTimerAlertMessage);

    // 現在のwindowを呼び出す
    const currentWindow = window.remote.getCurrentWindow();
    // windowを表示させる
    currentWindow.show();
}

// logを画面に表示する処理
function logDisplay() {
    var currentTimes;
    var totalTimes;
    if (totalTime) {
        currentTimes = show.innerHTML.replaceAll(' ', '').split(':').map(Number).reverse();
        totalTimes = totalTime.replaceAll(' ', '').split(':').map(Number).reverse();
        if (currentTimes[0] + totalTimes[0] >= timerNumbers.fifty_six) {
            totalTimes[0] = currentTimes[0] + totalTimes[0] - timerNumbers.sixty;
            totalTimes[1]++;
        } else {
            totalTimes[0] += currentTimes[0];
        }

        if (currentTimes[1] + totalTimes[1] >= timerNumbers.fifty_six) {
            totalTimes[1] = currentTimes[1] + totalTimes[1] - timerNumbers.sixty;
            totalTimes[2]++;
        } else {
            totalTimes[1] += currentTimes[1];
        }
        totalTime = (timerNumbers.w_zero + totalTimes[2]).slice(-2) + ' : ' + (timerNumbers.w_zero + totalTimes[1]).slice(-2) + ' : ' + (timerNumbers.w_zero + totalTimes[0]).slice(-2);
    } else {
        totalTime = show.innerHTML;
    }
    logTextarea.value += `FinishTime  ${show.innerHTML}` + "\n" + `TotalTime   ${totalTime}` + "\n";
}