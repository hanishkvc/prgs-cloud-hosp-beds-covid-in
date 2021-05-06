/*
 * Explore the Regions and Hospitals jsons
 * HanishKVC, 2021
 * GPL
 */


function list_states(oRegions) {
    for(tStateCode in oRegions) {
        console.log(`States:${tStateCode}:${oRegions[tStateCode]['Name']}`)
    }
}


function list_districts(oRegions, stateId) {
    for(tDistCode in oRegions[stateId]) {
        console.log(`States:${tDistCode}:${oRegions[stateId][tDistCode]}`)
    }
}


exports.explore_jsons = function(cmdArgs) {
    cRegionsFile = cmdArgs[1];
    cHospsFile = cmdArgs[2];
    cmd = cmdArgs[3];
    stateId = cmdArgs[4];
    districtId = cmdArgs[5];
    oRegions = require(cRegionsFile);
    oHosps = require(cHospsFile);
    bQuit = false;
    if (cmd == 'statesls') list_states(oRegions);
    if (cmd == 'districtsls') list_districts(oRegions, stateId);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
