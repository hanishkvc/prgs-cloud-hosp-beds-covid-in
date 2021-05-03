/*
 * Create the Data schema in Firestore
 * HanishKVC, 2021
 * GPL
 */

var admin = require('firebase-admin');
var regions = require('./regions');
var goStates = require("./statesuts_districts");
var hospitals = require('./hospitals');


console.log('INFO: HBCIn Setup States/UTs and their Districts/Regions')
console.log('INFO: Also setup sample hospital data for now')


function msg_success(sStateKey, sMsg) {
    console.log("DONE:",sMsg, sStateKey);
}


function msg_failure(sStateKey, sMsg, error) {
    console.error("ERRR:", sMsg, sStateKey, error.message);
}


function busy_sleep(x,y) {
    for(t1=0; t1 < x; t1++) {
        for(t2=0; t2 < y; t2++) {
        }
    }
}


function create_testdata() {
    console.log("INFO:creating testdata...");
    regions.create_states(db, goStates)
    hospitals.create_hosps(db, goStates)
}


var appArgs=process.argv.slice(2); // skip node and scriptName args
try {
    var app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://hosp-beds-covid-in.firebaseio.com"
        });
    var db = app.firestore();
    if (appArgs[0] === 'create_testdata') {
        create_testdata();
    }
} catch(error) {
    console.error("ERRR:AdminTool:", error);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
