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

function create_states(db) {
    for(tStateKey in lStates) {
        tName = null
        dStates=db.collection("States");
        tState = lStates[tStateKey]
        dStates.doc(tStateKey)
            .set(tState)
            .then(() => {
                console.log("INFO:CreateStates:", tStateKey, "Added to States Collection");
            })
            .catch((error) => {
                console.log("ERRR:CreateStates:", tStateKey, "Failed adding to States Collection");
            })
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
            } else {
                console.log(tStateKey, tName, tKey, tState[tKey])
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


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
