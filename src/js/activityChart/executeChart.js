import { createActivityChart, getBaseData, updateActivityChart } from './chart.js';
import { createCalender, splitWeeks, getCurrentWeekDays } from '../calender.js';

const ctx = document.getElementById('myActivityChart');

const week = document.getElementById('week');
const day = document.getElementById('day');

let activityChart;
let currentDate;

// WeekButton押下時の処理
week.addEventListener('click', () => {
    // メインプロセスに送信
    ipcRenderer.send('getWeekActivity');

    // メインプロセスからデータを受け取る
    ipcRenderer.on('sendActivity', (event, activity, date) => {
        let weekData = [0, 0, 0, 0, 0, 0];

        currentDate = date;

        let weeks = splitWeeks(createCalender(currentDate, 0));

        for (var x = 0; x < weeks.length; x++) {
            for (var y = 0; y < activity.length; y++) {
                if (weeks[x].includes(parseInt(activity[y].activityDate))) {
                    weekData[x] += parseFloat(activity[y].activityTime);
                }
            }
        }

        let labelData = ["1week", "2week", "3week", "4week", "5week", "6week"];

        let weekChartData = getBaseData();

        weekChartData['data'] = weekData;

        activityChart = updateActivityChart(activityChart, labelData, [weekChartData], currentDate, 'Week');
    });
});

// DayButton押下時の処理
day.addEventListener('click', () => {
    // メインプロセスに送信
    ipcRenderer.send('getWeekActivity');

    // メインプロセスからデータを受け取る
    ipcRenderer.on('sendActivity', (event, activity, date) => {

        // 現在の日時
        currentDate = date;

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

        // chartData生成
        let chartData = createChartData(currentMonthActivity, currentWeekDays_yyymmdd);

        activityChart = updateActivityChart(activityChart, currentWeekDays, chartData, currentDate, 'Day');
    });
});

// メインプロセスからデータを受け取る
ipcRenderer.on('setActivity', (event, activity, date) => {

    // 現在の日時
    currentDate = date;

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

    // chartData生成
    let chartData = createChartData(currentMonthActivity, currentWeekDays_yyymmdd);

    // chart生成
    activityChart = createActivityChart(ctx, currentWeekDays, chartData, currentDate, 'Day');
});

function createChartData(currentMonthActivity, currentWeekDays_yyymmdd) {
    let chartData = [];
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

        chartData.push(data);
    }
    return chartData;
}