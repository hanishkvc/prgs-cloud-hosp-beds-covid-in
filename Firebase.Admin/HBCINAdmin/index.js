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

function cs_success(sStateKey) {
    console.log("DONE:CreateStates:adding ", sStateKey, "to States Collection");
}

function cs_failure(sStateKey, error) {
    console.log("ERRR:CreateStates:adding", sStateKey, "to States Collection:", error.details);
}

function create_states(db) {
    dcStates=db.collection("States");
    for(tStateKey in lStates) {
        tName = null
        tState = lStates[tStateKey]
        dcStates.doc(tStateKey)
            .set(tState)
            .then(cs_success.bind(null, tStateKey))
            .catch(cs_failure.bind(null, tStateKey))
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
            iHosp += 1
            if (tKey === 'Name') {
                tName = tState[tKey]
                continue;
            }
            tHosp = {
                'Name': 'HospName',
                'PinCode': 123456,
                'DistrictId': tKey,
                'StateId': tStateK,
                'BedsICU': 1,
                'BedsNormal': 2,
                }
            tHospKey = `Hosp${iHosp}`
            dcHosps.doc(tHospKey)
                .set(tHosp)
                .then(cs_success.bind(null, tHospKey))
                .catch(cs_failure.bind(null, tHospKey));
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
