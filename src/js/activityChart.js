import { createCalender, splitWeeks } from './calender.js';

const ctx = document.getElementById('myActivityChart');

let labelData = [];
let activityData = [];

// メインプロセスからデータを受け取る
ipcRenderer.on('setActivity', (event, datas) => {
    datas.forEach(data => {
        labelData.push(data.category);
        activityData.push(data.activityTime);
    });
});

let weeks = splitWeeks(createCalender(new Date(), 0));

// 現在の週
let currentWeek = weeks.map((week, index) => {
    if (week.includes(new Date().getDate())) {
        console.log(index);
        return weeks[index];
    }
})

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

var glaphData = [{
    label: 'java',
    data: [0.25, 0, 1, 0, 1, 0, 0],
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: 1
}, {
    label: 'java',
    data: [0.25, 1, 2, 3, 4, 5, 6],
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: 1
}]

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: currentWeek[0],
        datasets: glaphData
    },
    options: {
        plugins: {
            legend: {
                display: false
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
                    callback: function (value, index, values) {
                        return value + 'h'
                    }
                },
                stacked: true,
            },
        }
    }
});