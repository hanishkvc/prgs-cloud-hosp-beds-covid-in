/*
 * UI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


function ui_onclick_handler(e) {
    console.log(this.id, e);
}


function home_handler(e) {
    //history.deleteAll()
}

function popstate_handler(e) {
    if (gbGetAuth) {
        gbGetAuth = false
        elAuth.innerHTML = ""
    } else if (gbUpdateMode) {
        gbUpdateMode = false
        elAuth.innerHTML = ""
    } else if (gDistrictId !== null) {
        gDistrictId = null;
    } else {
        gStateId = null;
    }
    ui_sync();
}


function updtbl_handler(e) {
    tId = e.id;
    iBedsICU = 0
    tIns = document.getElementsByName('BedsICU');
    for(i=0; i<tIns.length; i++) {
        if (tIns[i].id === tId) {
            iBedsICU = tIns[i].value
        }
    }
    iBedsNormal = 0
    tIns = document.getElementsByName('BedsNormal');
    for(i=0; i<tIns.length; i++) {
        if (tIns[i].id === tId) {
            iBedsNormal = tIns[i].value
        }
    }
}


function ui_table(el, lDataMxN, lHead, mTypes={}, clickHandler=null) {
    tHTML = "<table> ";
    tHTML += "<thead> <tr> ";
    for (lPart of lHead) {
        //console.log(lPart)
        tHTML += ` <th>${lPart}</th> `;
    }
    tHTML += " </tr> </thead> ";
    tHTML += "<tbody> ";
    r = -1
    for (lCur of lDataMxN) {
        r += 1
        tHTML += "<tr> ";
        //console.log(lCur)
        c = -1
        for (lPart of lCur) {
            c += 1
            //console.log(lPart)
            tField = lHead[c]
            tType = mTypes[tField]
            //console.log("ui_table:", mTypes, lHead[i], tType);
            if (tType === 'input') {
                tHTML += ` <td> <input type="number" class="h7in" id="${r}" name="${tField}" value="${lPart}"> </td> `;
            } else if (tType === 'button') {
                tHTML += ` <td> <button type="button" class="h7btn" id="${r}" name="${tField}"> ${lPart} </button> </td> `;
            } else {
                tHTML += ` <td>${lPart}</td> `;
            }
        }
        tHTML += " </tr>";
    }
    tHTML += " </tbody>";
    tHTML += " </table>";
    el.innerHTML = tHTML;
    if (clickHandler === null) return;
    elBtns = document.getElementsByClassName('h7btn')
    for(i = 0; i < elBtns.length; i++) {
        elBtns[i].onclick = clickHandler
        console.log(elBtns[i])
    }
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
    if (gGotAuth === null) {
        if (!gbGetAuth) {
            gbGetAuth = true
            history.pushState({state: 'ATH'}, 'UserAuth');
        }
    } else {
        if (!gbUpdateMode) {
            gbUpdateMode = true
            history.pushState({state: 'UPD'}, 'UpdateStatus');
        }
    }
    ui_sync()
}


function ui_getauth(el) {
    el.innerHTML = "<h1>For use by authorised people updating freebeds status</h1>"
    el.innerHTML += "<h2>People checking free bed status, do not sign in</h2>"
    el.innerHTML += '<div id="firebaseui-auth-container"></div>'
}


function state_handler(e) {
    console.log("INFO:StateHandler:", this.id, this.textContent);
    gStateId = this.id;
    gStateName = this.textContent;
    history.pushState({state: 'S2D'}, 'Districts');
    ui_sync();
}


function district_handler(e) {
    console.log("INFO:DistrictHandler:", this.id, this.textContent);
    gDistrictId = this.id;
    gDistrictName = this.textContent;
    history.pushState({state: 'D2H'}, 'Hospitals');
    ui_sync();
}


function authed_handler(authResult, redirectUrl) {
    console.log("INFO:Auth:Ok", authResult, redirectUrl);
    gGotAuth = authResult.user.uid;
    elAuth.innerHTML = "";
    setTimeout(update_handler, 0, null)
    return false;
}


function fixup_elcurpath(msg) {
    elCurPath.textContent = msg
    if (gGotAuth !== null) {
        elCurPath.textContent += ` [${firebase.auth().currentUser.email}] `
    }
}

function ui_update(el) {
    fixup_elcurpath('Update Free Hospital Beds info')
    lHead = [ "HospId", "Name", 'Pincode', 'BedsICU', 'BedsNormal', 'SyncIt' ]
    mTypes = { 'BedsICU': 'input', 'BedsNormal': 'input', 'SyncIt': 'button' }
    db_get_adminhospitals(gDB, gGotAuth)
        .then((lHosps) => {
            for(i = 0; i < lHosps.length; i++) {
                lHosps[i].push("sync");
            }
            ui_table(el, lHosps, lHead, mTypes);
            if (lHosps.length === 0)
                el.innerHTML = "<h1> No Hospitals assigned yet </h1>"
        })
        .catch((error) => {
            console.log("ERRR:UIUpdate:", error);
        });
}


function ui_sync() {
    if ((gGotAuth === null) && gbGetAuth) {
        elMain.innerHTML = ""
        ui_getauth(elAuth);
        aui_start(authed_handler);
        return;
    }
    if ((gGotAuth !== null) && gbUpdateMode) {
        elMain.innerHTML = ""
        ui_update(elAuth)
        return;
    }
    if (gStateId === null) {
        fixup_elcurpath("Select State - District")
        db_get_states(gDB).then((lStates) => {
            console.log(lStates)
            ui_list_buttons(elMain, lStates, state_handler);
            });
    }
    if ((gStateId !== null) && (gDistrictId === null)) {
        fixup_elcurpath(gStateName)
        db_get_state(gDB, gStateId).then((lDists) => {
            console.log(lDists)
            ui_list_buttons(elMain, lDists, district_handler);
            });
    }
    if ((gStateId !== null) && (gDistrictId !== null)) {
        fixup_elcurpath(` ${gStateName} [${gDistrictName}] `)
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
