import { createActivityChart, getBaseData, updateActivityChart } from './chart.js';
import { createCalender, splitWeeks, getCurrentWeekDays } from '../calender.js';

const ctx = document.getElementById('myActivityChart');
const a = document.getElementById('a');

const week = document.getElementById('week');
const day = document.getElementById('day');

let activityChart;
let currentDate;

// 週
week.addEventListener('click', () => {
    // メインプロセスに送信
    ipcRenderer.send('getWeekActivity');

    // メインプロセスからデータを受け取る
    ipcRenderer.on('sendActivity', (event, activity) => {

        let weekData = [0, 0, 0, 0, 0, 0];

        currentDate = new Date();

        let weeks = splitWeeks(createCalender(currentDate, 0));

        for (var x = 0; x < weeks.length; x++) {
            for (var y = 0; y < activity.length; y++) {
                if (weeks[x].includes(parseInt(activity[y].activityDate))) {
                    weekData[x] += parseInt(activity[y].activityTime);
                }
            }
        }

        let labelData = ["1week", "2week", "3week", "4week", "5week", "6week"];

        let weekChartData = getBaseData();

        weekChartData['data'] = weekData;

        activityChart = updateActivityChart(activityChart, labelData, [weekChartData], currentDate, 'Week');
    });
});

// 日
day.addEventListener('click', () => {


});

// メインプロセスからデータを受け取る
ipcRenderer.on('setActivity', (event, activity) => {

    // 現在の日時
    currentDate = new Date();

    let weeks = splitWeeks(createCalender(currentDate, 0));

    // 現在週の日付配列
    let currentWeekDays = weeks.filter((week) => {
        return week.includes(currentDate.getDate());
    })[0];

    // yyyy/mm/dd形式の現在週日付配列
    let currentWeekDays_yyymmdd = getCurrentWeekDays(currentWeekDays, currentDate);

    // 取得したActivityを現在週の日付でFilter
    let currentMonthActivity = activity.filter((act) => {
        return currentWeekDays_yyymmdd.includes(act.activityDateTime);
    });


    let dailyChartData = [];

    for (var num = 0; num < currentMonthActivity.length; num++) {

        let data = getBaseData();

        data['label'] = currentMonthActivity[num].category;
        for (var i = 0; i < currentWeekDays_yyymmdd.length; i++) {
            if (currentWeekDays_yyymmdd[i] === currentMonthActivity[num].activityDateTime) {
                data['data'].push(currentMonthActivity[num].activityTime);
            } else {
                data['data'].push(0);
            }
        }

        dailyChartData.push(data);
    }

    // グラフ生成
    activityChart = createActivityChart(ctx, currentWeekDays, dailyChartData, currentDate, 'Day');
});

