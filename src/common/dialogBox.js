// dialogMessage
export function message(SET_TITLE, SET_MESSAGE) {
    let w = remote.getCurrentWindow();
    let writeSuccessMessage = dialog.showMessageBox(w, {
        title: SET_TITLE,
        message: SET_MESSAGE,
    });
    console.log(writeSuccessMessage);
}