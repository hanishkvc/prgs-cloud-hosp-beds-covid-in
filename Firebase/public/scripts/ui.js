/*
 * UI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


function ui_onclick_handler(e) {
    console.log(this.id, e);
}


function back_handler(e) {
    if (gDistrictId !== null) {
        gDistrictId = null;
        elCurPath.textContent = gStateName
    } else {
        gStateId = null;
        elCurPath.textContent = "Select State - District"
    }
    if (!gbNavSystem) {
        history.back();
    }
    ui_sync();
}


let gbNavSystem = false
function popstate_handler(e) {
    gbNavSystem = true
    back_handler(e)
    gbNavSystem = false
}


function ui_table(el, lDataMxN, lHead) {
    tHTML = "<table> ";
    tHTML += "<thead> <tr> ";
    for (lPart of lHead) {
        //console.log(lPart)
        tHTML += ` <th>${lPart}</th> `;
    }
    tHTML += " </tr> </thead> ";
    tHTML += "<tbody> ";
    for (lCur of lDataMxN) {
        tHTML += "<tr> ";
        //console.log(lCur)
        for (lPart of lCur) {
            //console.log(lPart)
            tHTML += ` <td>${lPart}</td> `;
        }
        tHTML += " </tr>";
    }
    tHTML += " </tbody>";
    tHTML += " </table>";
    el.innerHTML = tHTML;
}


function ui_list_anchors(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<a>${lCur[1]}</a> `
    }
}


function ui_list_buttons(el, lDataNx2, clickHandler) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<button id="${lCur[0]}" name="${lCur[0]}">${lCur[1]}</button> `;
    }
    for(lCur of lDataNx2) {
        elBtn = document.getElementById(lCur[0]);
        elBtn.onclick = clickHandler;
    }
}


function update_handler(e) {
    if (!gbGotPass) {
        gbGetPass = true
    }
    ui_sync()
}


function ui_getpass(el) {
    el.innerHTML = "<h1>This is needed only for people updating status</h1>"
    el.innerHTML += '<div id="firebaseui-auth-container"></div>'
}


function state_handler(e) {
    console.log("INFO:StateHandler:", this.id, this.textContent);
    gStateId = this.id;
    gStateName = this.textContent;
    elCurPath.textContent = gStateName;
    history.pushState({state: 'S2D'}, 'Districts');
    ui_sync();
}


function district_handler(e) {
    console.log("INFO:DistrictHandler:", this.id, this.textContent);
    gDistrictId = this.id;
    gDistrictName = this.textContent;
    elCurPath.textContent = ` ${gStateName} [${gDistrictName}] `
    history.pushState({state: 'D2H'}, 'Hospitals');
    ui_sync();
}


function ui_sync() {
    if (!gbGotPass && gbGetPass) {
        ui_getpass(elMain);
        aui_start();
        return;
    }
    if (gStateId === null) {
        db_get_states(gDB).then((lStates) => {
            console.log(lStates)
            ui_list_buttons(elMain, lStates, state_handler);
            });
    }
    if ((gStateId !== null) && (gDistrictId === null)) {
        db_get_state(gDB, gStateId).then((lDists) => {
            console.log(lDists)
            ui_list_buttons(elMain, lDists, district_handler);
            });
    }
    if ((gStateId !== null) && (gDistrictId !== null)) {
        lHead = [ "HospId", "Name", 'Pincode', 'BedsICU', 'BedsNormal', 'TimeStamp' ]
        db_get_hospitals(gDB, gStateId, gDistrictId)
            .then((lHosps) => {
                console.log(lHosps)
                ui_table(elMain, lHosps, lHead);
            })
            .catch((error) => {
                console.log("ERRR:UISync:State+Dist", error);
            })
    }
}


function ui_init() {
    window.onpopstate = popstate_handler;
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
