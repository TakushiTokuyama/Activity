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

// startButton押下時
start.addEventListener('click', function () {
    interval = setInterval(clock, 1000);
}, false);

// stopButton押下時
reset.addEventListener('click', function () {
    initTimer();
    clearInterval(interval);
}, false);

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
        if (show.innerHTML === `${targetHour.value} : ${targetMinutes.value} : ${targetSeconds.value}`) {
            alert("stop!!");
            initTimer();
            clearInterval(interval);
        }
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

// validation
var setTimerValidation = function (validHour, validMinutes, validSeconds) {
    if (!(0 < parseInt(validHour) && parseInt(validHour) <= 60)) {
        return true;
    }

    if (!(0 < parseInt(validMinutes) && parseInt(validMinutes) <= 60)) {
        return true;
    }

    if (!(0 < parseInt(validSeconds) && parseInt(validSeconds) <= 60)) {
        return true;
    }
    return false;
}