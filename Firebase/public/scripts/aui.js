/*
 * UI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


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


function dbupdate_callback(bSuccess, sKey, sMsg, elUI) {
    if (elUI === null) return;
    if (bSuccess) {
        elUI.style.backgroundColor='#a0c0a0';
    } else {
        elUI.style.backgroundColor='#c0a0a0';
    }
}


const gINBedsICU = "ICU";
const gINBedsNormal = "Normal";
const gINBedsVntltr = "Vntltr";
/**
 * Handle sync button click wrt hospitals in update mode
 */
function updtbl_handler(e) {
    //console.debug("DBUG:UTHandler:",e);
    e.target.style.backgroundColor = '#a0a0c0';
    tId = e.target.id;
    hospId = e.target.name;
    iBedsICU = 0
    tIns = document.getElementsByName(gINBedsICU);
    for(i=0; i<tIns.length; i++) {
        //console.log("DBUG:UTHandler:BedsICU:",tIns[i]);
        if (tIns[i].id === tId) {
            iBedsICU = parseInt(tIns[i].value)
        }
    }
    iBedsNormal = 0
    tIns = document.getElementsByName(gINBedsNormal);
    for(i=0; i<tIns.length; i++) {
        //console.log("DBUG:UTHandler:BedsNormal:",tIns[i]);
        if (tIns[i].id === tId) {
            iBedsNormal = Number(tIns[i].value)
        }
    }
    iBedsVntltr = 0
    tIns = document.getElementsByName(gINBedsVntltr);
    for(i=0; i<tIns.length; i++) {
        if (tIns[i].id === tId) {
            iBedsVntltr = Number(tIns[i].value)
        }
    }
    console.debug("DBUG:UpdTblHandler:", iBedsICU, iBedsNormal, iBedsVntltr);
    db_update_hospital(gDB, hospId, iBedsICU, iBedsNormal, iBedsVntltr, dbupdate_callback, e.target);
}


var gHospParam =  'BedsICU'
function selparam_change(e) {
    console.log(e.target.value);
    gHospParam = e.target.value;
    ui_sync();
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
    el.innerHTML = "<h1>For use by authorised people updating hospital beds+ status</h1>"
    el.innerHTML += "<h2>People checking availability status, do not sign in, there is no need for same</h2>"
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
    console.log("INFO:Auth:Ok", redirectUrl);
    gGotAuth = authResult.user.uid;
    if (!authResult.user.emailVerified) {
        authResult.user.sendEmailVerification().then(function() {
                console.log("INFO:AuthHandler:Sent verification email");
            }).catch(function(error) {
                console.error("ERRR:AuthHandler:Failed to send verification email");
            });
    } else {
        console.log("INFO:AuthHandler: User with verified email");
    }
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
    lHead = [ "HospId", gINBedsICU, gINBedsNormal, gINBedsVntltr, "Name", 'Pincode', 'SyncIt' ]
    mTypes = { [gINBedsICU]: 'input', [gINBedsNormal]: 'input', [gINBedsVntltr]: 'input', 'SyncIt': 'button', 'HospId': 'hide' }
    db_get_adminhospitals(gDB, gGotAuth)
        .then((lHosps) => {
            for(i = 0; i < lHosps.length; i++) {
                lHosps[i].push("sync");
            }
            ui_table(el, {}, lHosps, lHead, mTypes, updtbl_handler);
            if (lHosps.length === 0)
                el.innerHTML = "<h1> No Hospitals assigned yet </h1>"
        })
        .catch((error) => {
            console.log("ERRR:UIUpdate:", error);
        });
}


function set_loadingdata_timeout() {
    gLoadingDataTimeOut = window.setTimeout(function() {
        elAuth.innerHTML = "<p> Loading data...</p>"
        elAuth.innerHTML += "<p> If it is taking too much time, cross check internet connection once </p>"
        elAuth.innerHTML += "<p> You could either wait or try reloading...</p>"
        }, 10*1000);
}


function clear_loadingdata_timeout() {
    window.clearTimeout(gLoadingDataTimeOut);
    gLoadingDataTimeOut = null;
    elAuth.innerHTML = "";
}


let gLoadingDataTimeOut = null
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
            //console.log(lStates)
            ui_list_buttons(elMain, lStates, state_handler);
            });
    }
    if ((gStateId !== null) && (gDistrictId === null)) {
        fixup_elcurpath(gStateName)
        db_get_state(gDB, gStateId).then((lDists) => {
            //console.log(lDists)
            ui_list_buttons(elMain, lDists, district_handler);
            });
        elAuth.innerHTML = "";
    }
    if ((gStateId !== null) && (gDistrictId !== null)) {
        fixup_elcurpath(` ${gStateName} [${gDistrictName}] `)
        set_loadingdata_timeout();
        lHead = [ "HospId", gINBedsICU, gINBedsNormal, gINBedsVntltr, "Name", 'Pincode', 'TimeStamp' ]
        db_get_hospitals(gDB, gStateId, gDistrictId, gHospParam)
            .then((lHosps) => {
                //console.log(lHosps)
                clear_loadingdata_timeout();
                ui_select(elMain, 'hospParam', [ 'BedsICU', 'BedsNormal', 'BedsVntltr' ], gHospParam);
                ui_table(elMain, { 'bOverwrite': false, 'TableClass': '.h7table' }, lHosps, lHead, { 'HospId': 'hide' });
                ui_select_changehandler('hospParam', selparam_change);
                elAuth.innerHTML = "Upto a maximum of 10 hospitals from sorted list will be shown";
            })
            .catch((error) => {
                console.log("ERRR:UISync:State+Dist", error);
            })
    }
}


function aui_init() {
    window.onpopstate = popstate_handler;
    elHome.onclick = home_handler;
    elUpdateMode.onclick = update_handler;
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
