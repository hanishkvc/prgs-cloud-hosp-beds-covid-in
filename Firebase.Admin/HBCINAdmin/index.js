/*
 * Create the Data schema in Firestore
 * HanishKVC, 2021
 * GPL
 */

var admin = require('firebase-admin');
var regions = require('./regions');
var goStates = require("./statesuts_districts");
var hospitals = require('./hospitals');
var hospAdmins = require('./hospadmins');
var dbx = require('./dbx');
var explore = require('./explore');


console.log('INFO: HBCIn Admin tool')
console.log('INFO: Setup States/UTs and their Districts/Regions')
console.log('INFO: Create a sample hospital dataset')
console.log('INFO: Import hospitals, hospitals admins, ...')


function create_testdata(db) {
    console.log("INFO:creating testdata...");
    regions.create_states(db, goStates)
    hospitals.create_hosps_testdata(db, goStates)
}


function create_regions(db) {
    console.log("INFO:creating regions...");
    regions.create_states(db, goStates)
}


function import_collection(db, cmdArgs) {
    cName = cmdArgs[1]
    cFile = cmdArgs[2]
    console.log(`INFO:importing collection [${cName}] [${cFile}]...`);
    dbx.import_collection(db, cName, cFile);
}


function import_hospitals(db, cmdArgs) {
    cHospsFile = cmdArgs[1]
    cMode = 'NORMAL'
    iStart = 0
    for(i=2; i < cmdArgs.length; i++) {
        arg = cmdArgs[i].split('=')
        if (arg[0] == '--mode') cMode = arg[1];
        if (arg[0] == '--start') iStart = Number(arg[1]);
    }
    console.log(`INFO:importing hospitals [${cHospsFile}] [${iStart}] [${cMode}]...`);
    hospitals.import(db, cHospsFile, iStart, cMode);
}


function enable_testadmin(db, cmdArgs) {
    console.log(`INFO:enable testadmin...`);
    hospAdmins.enable_testadmin(db);
}


function import_hospadmins(db, cmdArgs) {
    cAdminsFile = cmdArgs[1]
    console.log(`INFO:importing admins [${cAdminsFile}]...`);
    hospAdmins.import(db, cAdminsFile);
}


function explore_jsons(cmdArgs) {
    console.log("INFO:explore ...");
    explore.explore_jsons(cmdArgs);
}


var appArgs=process.argv.slice(2); // skip node and scriptName args
try {
    var app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        });
    var db = app.firestore();
    if (appArgs[0] === 'create_testdata') {
        create_testdata();
    } else if (appArgs[0] === 'create_regions') {
        create_regions();
    } else if (appArgs[0] === 'import_collection') {
        import_collection(db, appArgs)
    } else if (appArgs[0] === 'import_hospitals') {
        import_hospitals(db, appArgs)
    } else if (appArgs[0] === 'enable_testadmin') {
        enable_testadmin(db, appArgs)
    } else if (appArgs[0] === 'import_hospadmins') {
        import_hospadmins(db, appArgs)
    } else if (appArgs[0] === 'explore_jsons') {
        explore_jsons(appArgs)
    }
} catch(error) {
    console.error("ERRR:AdminTool:", error);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
