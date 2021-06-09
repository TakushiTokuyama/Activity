const { remote } = require('electron');
const { dialog } = remote;
const fs = require('fs');

window.remote = remote;
window.dialog = dialog;
window.fs = fs;