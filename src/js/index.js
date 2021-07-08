'use strict'
const show = document.getElementById('timer');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');


const logTextarea = document.getElementById('logTextarea')

const targetHour = document.getElementById('targetHour');
const targetMinutes = document.getElementById('targetMinutes');
const targetSeconds = document.getElementById('targetSeconds');

const category = document.getElementById('category');
const contents = document.getElementById('contents');

let interval;
let hour = CONSTANTS.TIMERNUMBER.W_ZERO;
let minutes = CONSTANTS.TIMERNUMBER.W_ZERO;
let seconds = CONSTANTS.TIMERNUMBER.W_ZERO;

// 合計時間
let totalTime;

// 初期表示
document.addEventListener('DOMContentLoaded', function () {
    isInputAndTimerValid();
    logTextarea.disabled = true;
    reset.disabled = true;
    setAutocompleteCategorys();
});

// startButton押下時
start.addEventListener('click', function () {
    // 設定時間のフォーマット整形
    setCorrectFormatTime();
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
        if (seconds > CONSTANTS.TIMERNUMBER.FIFTY_SIX) {
            seconds = CONSTANTS.TIMERNUMBER.W_ZERO;
            minutes = advanceTime(minutes);
            if (minutes > CONSTANTS.TIMERNUMBER.FIFTY_SIX) {
                minutes = CONSTANTS.TIMERNUMBER.w_zero;
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
        sendActivityData();
        initTimer();
        appendCategory();
        return;
    }
    return countUp();
};

// 1秒づつ時間を進める
var advanceTime = (time) => {
    time++;
    return time > CONSTANTS.TIMERNUMBER.NINE ? time : `0${time}`;
};

// Timer初期化処理
var initTimer = function () {
    hour = CONSTANTS.TIMERNUMBER.W_ZERO;
    minutes = CONSTANTS.TIMERNUMBER.W_ZERO;
    seconds = CONSTANTS.TIMERNUMBER.W_ZERO;
    show.innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

// Timerの妥当性確認
var setTimerValidation = function () {
    if ((CONSTANTS.TIMERNUMBER.ZERO <= parseInt(targetHour.value) && parseInt(targetHour.value) <= CONSTANTS.TIMERNUMBER.SIXTY) &&
        (CONSTANTS.TIMERNUMBER.ZERO <= parseInt(targetMinutes.value) && parseInt(targetMinutes.value) <= CONSTANTS.TIMERNUMBER.SIXTY) &&
        (CONSTANTS.TIMERNUMBER.ZERO < parseInt(targetSeconds.value) && parseInt(targetSeconds.value) <= CONSTANTS.TIMERNUMBER.SIXTY)) {
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

// Timer設定値の整形
function setCorrectFormatTime() {
    targetHour.value = ("00" + targetHour.value).slice(-2);
    targetMinutes.value = ("00" + targetMinutes.value).slice(-2);
    targetSeconds.value = ("00" + targetSeconds.value).slice(-2);
}


// 設定時間が来た時のAlert
function setTimeAlert() {
    let w = remote.getCurrentWindow();
    let setTimerAlertMessage = dialog.showMessageBox(w, {
        title: CONSTANTS.TITLE.FINISH,
        message: CONSTANTS.MESSAGE.FINISH,
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
        if (currentTimes[0] + totalTimes[0] >= CONSTANTS.TIMERNUMBER.FIFTY_SIX) {
            totalTimes[0] = currentTimes[0] + totalTimes[0] - CONSTANTS.TIMERNUMBER.SIXTY;
            totalTimes[1]++;
        } else {
            totalTimes[0] += currentTimes[0];
        }

        if (currentTimes[1] + totalTimes[1] >= CONSTANTS.TIMERNUMBER.FIFTY_SIX) {
            totalTimes[1] = currentTimes[1] + totalTimes[1] - CONSTANTS.TIMERNUMBER.SIXTY;
            totalTimes[2]++;
        } else {
            totalTimes[1] += currentTimes[1];
        }
        totalTime = (CONSTANTS.TIMERNUMBER.W_ZERO + totalTimes[2]).slice(-2) + ' : ' + (CONSTANTS.TIMERNUMBER.W_ZERO + totalTimes[1]).slice(-2) + ' : ' + (CONSTANTS.TIMERNUMBER.W_ZERO + totalTimes[0]).slice(-2);
    } else {
        totalTime = show.innerHTML;
    }
    logTextarea.value += `FinishTime  ${show.innerHTML}` + "\n" + `TotalTime   ${totalTime}` + "\n";
}

var datalist = document.createElement('datalist');

// autocompleteにcategoryを設定する
function setAutocompleteCategorys() {
    datalist.id = 'category_list';
    // メインプロセスに送信
    ipcRenderer.send('getCategory');
    // メインプロセスからデータを受け取る
    ipcRenderer.on('setCategory', (event, data) => {
        // categoryのautocomplete設定
        data.forEach(value => {
            var option = document.createElement('option');
            option.value = value;
            datalist.appendChild(option);
        });
        category.appendChild(datalist);
    });
}

// categoryを要素に追加する
function appendCategory() {
    var option = document.createElement('option');
    option.value = category.value;
    datalist.appendChild(option);
}

// activityDataを送信する
function sendActivityData() {

    let currentDate = new Date();

    let activityData = new modelActivity.activity(
        currentDate.toLocaleDateString(),
        category.value, contents.value,
        activityTimeCalc(), currentDate.getDate());

    // メインプロセスに送信
    ipcRenderer.send('insertActivity', activityData);
}

// 活動時間を計算する
function activityTimeCalc() {
    let activityTime = CONSTANTS.ACTIVITY_TIME.INT_ZERO;
    if (parseInt(targetMinutes.value) >= CONSTANTS.ACTIVITY_TIME.FORTY) {
        activityTime += CONSTANTS.ACTIVITY_TIME.INT_ZERO_POINT_SEVEN_FIVE;
    } else if (parseInt(targetMinutes.value) >= CONSTANTS.ACTIVITY_TIME.THIRTY) {
        activityTime += CONSTANTS.ACTIVITY_TIME.INT_ZERO_POINT_FIVE;
    } else if (parseInt(targetMinutes.value) >= CONSTANTS.ACTIVITY_TIME.FIFTEEN) {
        activityTime += CONSTANTS.ACTIVITY_TIME.INT_ZERO_POINT_TWO_FIVE;
    }

    activityTime += parseInt(targetHour.value);

    return activityTime.toString();
}