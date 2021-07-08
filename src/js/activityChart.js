import { createCalender, splitWeeks, getCurrentWeekDays } from './calender.js';

const ctx = document.getElementById('myActivityChart');

const week = document.getElementById('week');
const day = document.getElementById('day');

let activityChart;
let currentDate;
let dailyGlaphData = [];
let currentWeek = [];
const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 159, 64, 0.2)'
];

const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 159, 64, 1)'
];

const dailyGraphOtions = {
    plugins: {
        tooltip: {
            filter: function (item) {
                return (item.parsed.y > 0);
            }
        },
        title: {
            display: true,
            text: ''

        },
        legend: {
            display: false,
        }
    },
    scales: {
        x: {
            stacked: true
        },
        y: {
            ticks: {
                stepSize: 0.5,
                suggestedMax: 24,
                beginAtZero: true,
                callback: function (value) {
                    return value + 'h'
                }
            },
            stacked: true,
        },
    },
}

const weeklyGraphOtions = {
    plugins: {
        tooltip: {
            filter: function (item) {
                return (item.parsed.y > 0);
            }
        },
        title: {
            display: true,
            text: ''

        },
        legend: {
            display: false,
        }
    },
    scales: {
        x: {
            stacked: true
        },
        y: {
            ticks: {
                stepSize: 10,
                suggestedMax: 200,
                beginAtZero: true,
                callback: function (value) {
                    return value + 'h'
                }
            },
            stacked: true,
        },
    },
}

// 週
week.addEventListener('click', () => {
    activityChart.destroy();

    // メインプロセスに送信
    ipcRenderer.send('getWeekActivity');

    // メインプロセスからデータを受け取る
    ipcRenderer.on('sendActivity', (event, activity) => {

        let weekGlaphData = [0, 0, 0, 0, 0, 0];

        currentDate = new Date();

        let weeks = splitWeeks(createCalender(currentDate, 0));

        for (var x = 0; x < weeks.length; x++) {
            for (var y = 0; y < activity.length; y++) {
                console.log(activity[y].activityDate);
                if (weeks[x].includes(parseInt(activity[y].activityDate))) {
                    weekGlaphData[x] += parseInt(activity[y].activityTime);
                }
            }
        }
        var labelData = ["1week", "2week", "3week", "4week", "5week", "6week"];

        var data = {
            label: '',
            data: weekGlaphData,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
        }

        let glaphData = [data];

        activityChart = createActivityChart(labelData, glaphData, weeklyGraphOtions);

        activityChart['options']['plugins']['title'].text = 'Week';
        activityChart.update();
    });
});

// 日
day.addEventListener('click', () => {
    activityChart.destroy();

    activityChart = createActivityChart(labelData, graphData, options);
});

// メインプロセスからデータを受け取る
ipcRenderer.on('setActivity', (event, activity) => {

    // 現在の日時
    currentDate = new Date();

    let weeks = splitWeeks(createCalender(currentDate, 0));

    // 現在週の日付
    weeks.forEach((week, index) => {
        if (week.includes(currentDate.getDate())) {
            currentWeek.push(week);
        }
    });

    // yyyy/mm/dd形式の現在週日付配列
    let currentWeekDays = getCurrentWeekDays(weeks, currentDate);

    // 取得したActivityを現在週の日付でFilter
    let currentMonthActivity = activity.filter((act) => {
        return currentWeekDays.includes(act.activityDateTime);
    });

    for (var num = 0; num < currentMonthActivity.length; num++) {
        var data = {
            label: '',
            data: [],
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
        }

        data['label'] = currentMonthActivity[num].category;
        for (var i = 0; i < currentWeekDays.length; i++) {
            if (currentWeekDays[i] === currentMonthActivity[num].activityDateTime) {
                data['data'].push(currentMonthActivity[num].activityTime);
            } else {
                data['data'].push(0);
            }
        }

        dailyGlaphData.push(data);
    }

    // グラフ生成
    activityChart = createActivityChart(currentWeek[0], dailyGlaphData, dailyGraphOtions);

    activityChart['options']['plugins']['title'].text = `today:${currentDate.toLocaleDateString()}`;
});

// グラフ生成
function createActivityChart(labelData, graphData, graphOptions) {
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: graphData
        },
        options: graphOptions
    });
    return myChart;
}