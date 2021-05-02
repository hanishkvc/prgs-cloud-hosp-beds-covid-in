/*
 * Create the Data schema in Firestore
 * HanishKVC, 2021
 * GPL
 */

var admin = require('firebase-admin');

var goStates = require("./statesuts_districts");

console.log('INFO: HBCIn Setup States/UTs and their Districts/Regions')
console.log('INFO: Also setup sample hospital data for now')

function msg_success(sStateKey, sMsg) {
    console.log("DONE:",sMsg, sStateKey);
}

function msg_failure(sStateKey, sMsg, error) {
    console.error("ERRR:", sMsg, sStateKey, error.message);
}

function create_states(db, oStates) {
    dcStates=db.collection("States");
    for(tStateKey in oStates) {
        tName = null
        tState = oStates[tStateKey]
        dcStates.doc(tStateKey)
            .set(tState)
            .then(msg_success.bind(null, tStateKey, "CreateStates:Adding"))
            .catch(msg_failure.bind(null, tStateKey, "CreateStates:Adding"))
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
            } else {
                console.log(tStateKey, tName, tKey, tState[tKey])
            }
        }
    }
}


function busy_sleep(x,y) {
    for(t1=0; t1 < x; t1++) {
        for(t2=0; t2 < y; t2++) {
        }
    }
}

async function create_hosps(db, oStates) {
    dcHosps = db.collection('Hospitals');
    iHosp = 0
    for(tStateK in oStates) {
        tState = oStates[tStateK];
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
                continue;
            }
            tHospNums = Math.round(Math.random()*5);
            if (iHosp === 0) tHospsNum = 15;
            for(i = 0; i < tHospNums; i++) {
                iHosp += 1
                tHosp = {
                    'Name': 'HospName',
                    'PinCode': 123456,
                    'DistrictId': tKey,
                    'StateId': tStateK,
                    'BedsICU': Math.round(Math.random()*20),
                    'BedsNormal': Math.round(Math.random()*20),
                    'TimeStamp': admin.firestore.FieldValue.serverTimestamp(),
                    }
                await new Promise(r => setTimeout(r, 500));
                tHospKey = `H${tStateK}${tKey}-${iHosp}`
                dcHosps.doc(tHospKey)
                    .set(tHosp)
                    .then(msg_success.bind(null, tHospKey, "CreateHosps:Adding"))
                    .catch(msg_failure.bind(null, tHospKey, "CreateHosps:Adding"));
            }
        }
    }
}

try {
    var app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://hosp-beds-covid-in.firebaseio.com"
        });
    var db = app.firestore();
    create_states(db, goStates)
    create_hosps(db, goStates)
} catch(error) {
    console.error("ERRR:CreateSampleDataMain:", error.errorInfo);
}




/* vim: set ts=4 sts=4 sw=4 expandtab :*/
