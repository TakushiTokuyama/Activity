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
var secounds = timerNumbers.w_zero;

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
        secounds = advanceTime(secounds);
        if (secounds > timerNumbers.fifty_six) {
            secounds = timerNumbers.w_zero;
            minutes = advanceTime(minutes);
            if (minutes > timerNumbers.fifty_six) {
                minutes = timerNumbers.w_zero;
                hour = advanceTime(hour);
            }
        }
        // 画面に表示
        show.innerHTML = `${hour} : ${minutes} : ${secounds}`;
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
    secounds = timerNumbers.w_zero;
    show.innerHTML = `${hour} : ${minutes} : ${secounds}`;
}