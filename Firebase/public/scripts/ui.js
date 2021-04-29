/*
 * UI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


function ui_list_anchors(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<a>${lCur[1]}</a> `
    }
}


function ui_list_buttons(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<button name="${lCur[0]}">${lCur[1]}</button> `
    }
}


function ui_sync() {
    if (gStateId === null) {
        db_get_states(gDB).then((lStates) => {
            console.log(lStates)
            ui_list_buttons(elStates, lStates);
            });
    } else {
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
