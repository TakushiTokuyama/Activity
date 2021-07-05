// calender作成
export function createCalender(today, addMonth) {
    // 月初と月末を返却する
    var [beginingOfTheMonth, lastOfTheMonth] = returnFirstDayAndlastDay(today, addMonth);
    // 月初の曜日
    let beginingOfTheMonthDayOfTheWeek = beginingOfTheMonth.getDay();
    // 月末日
    let lastOfTheMonthDay = lastOfTheMonth.getDate();
    // 1か月分の日にち
    let weeks = new Array(42);
    // 日数を格納
    for (var i = 1; i < lastOfTheMonthDay + 1; i++) {
        weeks[beginingOfTheMonthDayOfTheWeek - 1 + i] = i;
    }
    return weeks;
}

// 月初と月末を返却する
function returnFirstDayAndlastDay(today, addMonth) {
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    return [new Date(currentYear, currentMonth + addMonth, 1), new Date(currentYear, currentMonth + 1 + addMonth, 0)];
}

// １週ごとに分割
export function splitWeeks(weeks) {
    let weekly = [];
    let week = [];

    // 6weekに分割
    for (var x = 0; x < weeks.length; x++) {
        week.push(weeks[x]);
        if (week.length % 7 === 0) {
            weekly.push(week);
            week = [];
        }
    }
    return weekly;
}

// yyyy/mm/dd書式の現在週の日付配列に格納
export function getCurrentWeekDays(weeks, currentDate) {

    let currentWeek = weeks.filter((week) => {
        return week.includes(currentDate.getDate());
    });

    let result = currentWeek[0].map((currentDay) => {
        return currentDay !== "" ? new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay).toLocaleDateString() : "";
    });

    return result;
}