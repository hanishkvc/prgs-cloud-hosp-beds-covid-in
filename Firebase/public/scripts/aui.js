/*
 * ApplicationUI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


function home_handler(e) {
    //history.deleteAll()
}


function popstate_handler(e) {
    console.log(e);
    if (gMe.prgState >= PRGSTATES.multiface) {
        elAuth.innerHTML = ""
    }
    gMe.prgState = e.state;
    if (gMe.prgState >= PRGSTATES.multiface) {
        window.history.back();
        return;
    }
    if (gMe.prgState === null) gMe.prgState = PRGSTATES.national;
    aui_sync();
}


function hospdbupdate_callback(bSuccess, sKey, sMsg, elUI) {
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
function hospsync_handler(e) {
    //console.debug("DBUG:HospSyncHandler:",e);
    e.target.style.backgroundColor = '#a0a0c0';
    tId = e.target.id;
    hospId = e.target.name;
    iBedsICU = 0
    tIns = document.getElementsByName(gINBedsICU);
    for(i=0; i<tIns.length; i++) {
        //console.log("DBUG:HospSyncHandler:BedsICU:",tIns[i]);
        if (tIns[i].id === tId) {
            iBedsICU = parseInt(tIns[i].value)
        }
    }
    iBedsNormal = 0
    tIns = document.getElementsByName(gINBedsNormal);
    for(i=0; i<tIns.length; i++) {
        //console.log("DBUG:HospSyncHandler:BedsNormal:",tIns[i]);
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
    console.debug("DBUG:HospSyncHandler:", iBedsICU, iBedsNormal, iBedsVntltr);
    db_update_hospital(gDB, hospId, iBedsICU, iBedsNormal, iBedsVntltr, hospdbupdate_callback, e.target);
}


var gHospParam =  'BedsICU'
function hospparam_change(e) {
    console.log(e.target.value);
    gHospParam = e.target.value;
    aui_sync();
}


function aui_update(el) {
    fixup_elcurpath('Update Hospital Beds Availability Data')
    lHead = [ "HospId", gINBedsICU, gINBedsNormal, gINBedsVntltr, "Name", 'Pincode', 'SyncIt' ]
    mTypes = { [gINBedsICU]: 'input', [gINBedsNormal]: 'input', [gINBedsVntltr]: 'input', 'SyncIt': 'button', 'HospId': 'hide' }
    db_get_adminhospitals(gDB, gMe.gotAuth)
        .then((lHosps) => {
            for(i = 0; i < lHosps.length; i++) {
                lHosps[i].push("sync");
            }
            ui_table(el, {}, lHosps, lHead, mTypes, hospsync_handler);
            if (lHosps.length === 0)
                el.innerHTML = "<h1> No Hospitals assigned yet </h1>"
        })
        .catch((error) => {
            console.log("ERRR:AUIUpdate:", error);
        });
}


function updatebeds_handler(e) {
    if (gMe.prgState !== PRGSTATES.beds) {
        gMe.prgState = PRGSTATES.beds;
        history.pushState(gMe.prgState, 'UpdateStatus');
    }
    aui_sync()
}


function patients_handler(e) {
    if (gMe.prgState !== PRGSTATES.add) {
        gMe.prgState = PRGSTATES.add;
        history.pushState(gMe.prgState, 'Patients');
    }
    aui_sync()
}


function state_handler(e) {
    console.log("INFO:StateHandler:", this.id, this.textContent);
    gMe.stateId = this.id;
    gStateName = this.textContent;
    gMe.prgState = PRGSTATES.state;
    history.pushState(gMe.prgState, 'Districts');
    aui_sync();
}


function district_handler(e) {
    console.log("INFO:DistrictHandler:", this.id, this.textContent);
    gMe.districtId = this.id;
    gDistrictName = this.textContent;
    gMe.prgState = PRGSTATES.district;
    history.pushState(gMe.prgState, 'Hospitals');
    aui_sync();
}


function aui_getauth_prep(el) {
    el.innerHTML = "<h1>For use by authorised people updating hospital beds+ status</h1>"
    el.innerHTML += "<h2>People checking availability status, do not sign in, there is no need for same</h2>"
    el.innerHTML += '<div id="firebaseui-auth-container"></div>'
}


function authui_do(el) {
        aui_getauth_prep(el);
        authui_start(authed_handler);
}


function authed_handler(authResult, redirectUrl) {
    console.log("INFO:Auth:Ok", redirectUrl);
    gMe.gotAuth = authResult.user.uid;
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
    setTimeout(updatebeds_handler, 0, null)
    return false;
}


function fixup_elcurpath(msg) {
    elCurPath.textContent = msg
    if (gMe.gotAuth !== null) {
        elCurPath.textContent += ` [${firebase.auth().currentUser.email}] `
    }
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


function best_prgstate() {
    if ((gMe.stateId === null) && (gMe.districtId === null)) gMe.prgState = PRGSTATES.national;
    if ((gMe.stateId !== null) && (gMe.districtId === null)) gMe.prgState = PRGSTATES.state;
    if ((gMe.stateId !== null) && (gMe.districtId !== null)) gMe.prgState = PRGSTATES.district;
}


let gLoadingDataTimeOut = null
function aui_sync() {
    elPatients.hidden = true;
    if ((gMe.prgState >= PRGSTATES.auth) && (gMe.gotAuth === null)) {
        elMain.innerHTML = ""
        authui_init(authui_do, elAuth)
        return;
    }
    if (gMe.prgState === PRGSTATES.beds) {
        elMain.innerHTML = ""
        aui_update(elAuth)
        return;
    }
    if (gMe.prgState === PRGSTATES.national) {
        fixup_elcurpath("Select State - District")
        db_get_states(gDB).then((lStates) => {
            //console.log(lStates)
            ui_list_buttons(elMain, {}, lStates, state_handler);
            });
    }
    if (gMe.prgState === PRGSTATES.state) {
        fixup_elcurpath(gStateName)
        db_get_state(gDB, gMe.stateId).then((lDists) => {
            //console.log(lDists)
            ui_list_buttons(elMain, {}, lDists, district_handler);
            });
        elAuth.innerHTML = "";
    }
    if (gMe.prgState === PRGSTATES.district) {
        fixup_elcurpath(` ${gStateName} [${gDistrictName}] `)
        if (gMe.gotAuth)
            elPatients.hidden = false;
        set_loadingdata_timeout();
        lHead = [ "HospId", gINBedsICU, gINBedsNormal, gINBedsVntltr, "Name", 'Pincode', 'TimeStamp' ]
        db_get_hospitals(gDB, gMe.stateId, gMe.districtId, gHospParam)
            .then((lHosps) => {
                //console.log(lHosps)
                clear_loadingdata_timeout();
                ui_select(elMain, 'hospParam', [ 'BedsICU', 'BedsNormal', 'BedsVntltr' ], gHospParam);
                ui_table(elMain, { 'bOverwrite': false, 'TableClass': 'h7table' }, lHosps, lHead, { 'HospId': 'hide' });
                ui_select_changehandler('hospParam', hospparam_change);
                elAuth.innerHTML = "Upto a maximum of 10 hospitals from sorted list will be shown";
            })
            .catch((error) => {
                console.log("ERRR:AUISync:State+Dist", error);
            })
    }
}


function aui_init() {
    window.onpopstate = popstate_handler;
    elHome.onclick = home_handler;
    elUpdateBeds.onclick = updatebeds_handler;
    elPatients.onclick = patients_handler;
    gMe.prgState = PRGSTATES.national;
    history.replaceState(gMe.prgState, 'States');
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
