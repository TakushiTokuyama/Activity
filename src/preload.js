const { remote } = require('electron');
const { dialog } = remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const Chart = require('chart.js');

const utility = require('./common/utility');
const constants = require('./common/const');

window.remote = remote;
window.dialog = dialog;
window.ipcRenderer = ipcRenderer;
window.fs = fs;
window.Chart = Chart;

window.utility = utility;
window.constants = constants;