/*
 * Create the Data schema in Firestore
 * HanishKVC, 2021
 * GPL
 */

var admin = require('firebase-admin');
var regions = require('./regions');
var goStates = require("./statesuts_districts");
var hospitals = require('./hospitals');
var dbx = require('./dbx');


console.log('INFO: HBCIn Setup States/UTs and their Districts/Regions')
console.log('INFO: Also setup sample hospital data for now')


function create_testdata() {
    console.log("INFO:creating testdata...");
    regions.create_states(db, goStates)
    hospitals.create_hosps(db, goStates)
}


function import_collection(db, cName, cFile) {
    console.log(`INFO:importing collection [${cName}] [${cFile}]...`);
    dbx.import_collection(db, cName, cFile);
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
    } else if (appArgs[0] === 'import_collection') {
        import_collection(db, appArgs[1], appArgs[2])
    }
} catch(error) {
    console.error("ERRR:AdminTool:", error);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
