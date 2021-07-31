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

// chartの設定
const chartOtions = {
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

// chartのbaseData
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

// chartの生成
export function createActivityChart(ctx, labelData, chartData, currentDate, chartTitle) {
    let activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: chartData
        },
        options: chartOtions
    });
    activityChart['options']['plugins']['title'].text = `${chartTitle}Chart:${currentDate.toLocaleDateString()}`;
    return activityChart;
}

// chartの更新
export function updateActivityChart(activityChart, labelData, chartData, currentDate, chartTitle) {

    activityChart['data'].labels = labelData;
    activityChart['data'].datasets = chartData;
    activityChart['options'] = setChartOptions(currentDate, chartTitle);

    activityChart.update();

    return activityChart;
}

// optionsの設定
function setChartOptions(currentDate, chartTitle) {
    chartOtions.scales.y.ticks.stepSize = chartTitle === 'Day' ? 0.5 : 5;
    chartOtions.scales.y.ticks.suggestedMax = chartTitle === 'Day' ? 24 : 200;
    chartOtions.plugins.title.text = `${chartTitle}Chart:${currentDate.toLocaleDateString()}`;

    return chartOtions;
}