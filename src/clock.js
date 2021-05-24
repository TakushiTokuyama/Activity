'use strict'

var show = document.getElementById('clock');
var reset = document.getElementById('reset');
var start = document.getElementById('start');

const zero = "00";

var interval;
var hour = zero;
var minutes = zero;
var secounds = zero;

start.addEventListener('click', function () {
    interval = setInterval(clock, 1000);
}, false);

reset.addEventListener('click', function () {
    hour = zero;
    minutes = zero;
    secounds = zero;
    show.innerHTML = `${hour} : ${minutes} : ${secounds}`;
    clearInterval(interval);
}, false);

var clock = function () {
    function countUp() {
        secounds++;
        secounds = secounds > 9 ? secounds : `0${secounds}`;
        if (secounds > 59) {
            secounds = zero;
            minutes++;
            minutes = minutes > 9 ? minutes : `0${minutes}`;
            if (minutes > 59) {
                minutes = zero;
                hour++;
                hour = hour > 9 ? hour : `0${hour}`;
            }
        }
        // 画面に表示
        show.innerHTML = `${hour} : ${minutes} : ${secounds}`;
    }
    return countUp();
};


