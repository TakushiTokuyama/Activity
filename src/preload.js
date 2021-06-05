const { remote } = require('electron');
const { dialog } = remote;

window.remote = remote;
window.dialog = dialog;