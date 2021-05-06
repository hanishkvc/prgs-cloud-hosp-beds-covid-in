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


exports.explore_jsons = function(cmdArgs) {
    cRegionsFile = cmdArgs[1];
    cHospsFile = cmdArgs[2];
    cmd = cmdArgs[3];
    oRegions = require(cRegionsFile);
    oHosps = require(cHospsFile);
    bQuit = false;
    if (cmd == 'statesls') {
        list_states(oRegions);
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
