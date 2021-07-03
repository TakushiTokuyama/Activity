import { createCalender, splitWeeks, getCurrentWeekDays } from './calender.js';

const ctx = document.getElementById('myActivityChart');

// メインプロセスからデータを受け取る
ipcRenderer.on('setActivity', (event, activity) => {
    let currentWeek = [];
    var glaphData = [];

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

    let currentDate = new Date();

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

        glaphData.push(data);
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentWeek[0],
            datasets: glaphData
        },
        options: {
            plugins: {
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
                        callback: function (value, index, values) {
                            return value + 'h'
                        }
                    },
                    stacked: true,
                },
            }
        }
    });
});

