/*
 * Create the Data schema in Firestore
 * HanishKVC, 2021
 * GPL
 */

var admin = require('firebase-admin');

let lStates = {
    'KA': {
        'Name': 'Karnataka',
        'DId0': 'Tumakuru',
        'DId1': 'Bengaluru',
        },
    'KL': {
        'Name': 'Kerala',
        'DId0': 'Ernakulam',
        'DId1': 'Thiruvananthapuram',
        },
    'TN': {
        'Name': 'Tamilnadu',
        'DId0': 'Chennai',
        'DId1': 'Vellore',
        }
    }

console.log('Hello world')
console.log(lStates['KA'])

function msg_success(sStateKey, sMsg) {
    console.log("DONE:",sMsg, sStateKey);
}

function msg_failure(sStateKey, sMsg, error) {
    console.log("ERRR:", sMsg, sStateKey, error.details);
}

function create_states(db) {
    dcStates=db.collection("States");
    for(tStateKey in lStates) {
        tName = null
        tState = lStates[tStateKey]
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


function create_hosps(db, lStates) {
    dcHosps = db.collection('Hospitals');
    iHosp = 0
    for(tStateK in lStates) {
        tState = lStates[tStateK];
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
                continue;
            }
            tHospNums = Math.round(Math.random()*10);
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
                tHospKey = `H${tStateK}${tKey}-${iHosp}`
                dcHosps.doc(tHospKey)
                    .set(tHosp)
                    .then(msg_success.bind(null, tHospKey, "CreateHosps:Adding"))
                    .catch(msg_failure.bind(null, tHospKey, "CreateHosps:Adding"));
            }
        }
    }
}


var app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://hosp-beds-covid-in.firebaseio.com"
    });
var db = app.firestore();


create_states(db)
create_hosps(db, lStates)


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
