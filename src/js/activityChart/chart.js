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

const dailyChartOtions = {
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

const weeklyChartOtions = {
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

// 基本となるdata
export function getBaseData() {
    let baseData = {
        label: '',
        data: [],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
    }
    return baseData;
}

// 日ごとのグラフ生成
export function createActivityChart(ctx, labelData, chartData, currentDate, chartTitle) {
    let chartOptions = chartTitle === 'Day' ? dailyChartOtions : weeklyChartOtions;
    let activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: chartData
        },
        options: chartOptions
    });
    activityChart['options']['plugins']['title'].text = `${chartTitle}Chart:${currentDate.toLocaleDateString()}`;
    return activityChart;
}

export function updateActivityChart(activityChart, labelData, chartData, currentDate, chartTitle) {
    let chartOptions = chartTitle === 'Day' ? dailyChartOtions : weeklyChartOtions;
    activityChart['data'].labels = labelData;
    activityChart['data'].datasets = chartData;
    activityChart['options'] = chartOptions;
    activityChart['options']['plugins']['title'].text = `${chartTitle}Chart:${currentDate.toLocaleDateString()}`;
    activityChart.update();

    return activityChart;
}