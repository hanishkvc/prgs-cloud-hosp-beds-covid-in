

function list_anchors(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<a>${lCur[1]}</a> `
    }
}

function ui_sync() {
    if (gStateId === null) {
        get_states(gDB).then((lStates) => {
            console.log(lStates)
            list_anchors(elStates, lStates);
            });
    } else {
    }
}

/* vim: set ts=4 sts=4 sw=4 expandtab :*/
