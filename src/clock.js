'use strict'

import { timerNumbers } from './const.js';

var show = document.getElementById('clock');
var reset = document.getElementById('reset');
var start = document.getElementById('start');

var targetHour = document.getElementById('targetHour');
var targetMinutes = document.getElementById('targetMinutes');
var targetSeconds = document.getElementById('targetSeconds');

var interval;
var hour = timerNumbers.w_zero;
var minutes = timerNumbers.w_zero;
var seconds = timerNumbers.w_zero;

// 初期表示
window.onload = function () {
    isInputAndTimerValid();
}

// startButton押下時
start.addEventListener('click', function () {
    interval = setInterval(clock, 1000);
}, false);

// stopButton押下時
reset.addEventListener('click', function () {
    initTimer();
    clearInterval(interval);
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
        alert("stop!!");
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
    if ((0 < parseInt(targetHour.value) && parseInt(targetHour.value) <= 60) &&
        (0 < parseInt(targetMinutes.value) && parseInt(targetMinutes.value) <= 60) &&
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
