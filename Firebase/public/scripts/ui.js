

function list_anchors(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<a>${lCur[1]}</a> `
    }
}

/* vim: set ts=4 sts=4 sw=4 expandtab :*/
