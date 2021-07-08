exports.activity = class activity {
    constructor(activityDateTime, category, contents, activityTime, activityDate) {
        this.activityDateTime = activityDateTime;
        this.category = category
        this.contents = contents;
        this.activityTime = activityTime;
        this.activityDate = activityDate;
    }
}