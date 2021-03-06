const { remote } = require('electron');
const { dialog } = remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const Chart = require('chart.js');

const utility = require('./common/utility');
const CONSTANTS = require('./common/const');
const modelActivity = require('./model/activity');
const modelLink = require('./model/link');

window.remote = remote;
window.dialog = dialog;
window.ipcRenderer = ipcRenderer;
window.fs = fs;
window.Chart = Chart;

window.utility = utility;
window.CONSTANTS = CONSTANTS;
window.modelActivity = modelActivity;
window.modelLink = modelLink;