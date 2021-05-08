/*
 * Explore the Regions and Hospitals jsons
 * HanishKVC, 2021
 * GPL
 */


var hlpr = require('./hlpr');


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


function list_hosps(oHosps, stateId, districtId) {
    console.log("Explore: Hospitals in", stateId, districtId);
    for(tHospId in oHosps) {
        tHosp = oHosps[tHospId]
        if ((tHosp.StateId == stateId) && (tHosp.DistrictId == districtId)) {
            console.log(`Hosp:${tHospId}:`);
            console.log(tHosp);
        }
    }
}


/**
 * Return the stateId given stateId or State Name
 */
function get_stateid(oRegions, stateIdIn) {
    if (stateIdIn == undefined) return stateIdIn;
    if (stateIdIn.length <= 2) return stateIdIn;
    for(stateId in oRegions) {
        if (hlpr.bland_str(stateIdIn) === hlpr.bland_str(oRegions[stateId].Name)) return stateId;
    }
    return stateIdIn;
}


function get_districtid(oRegions, stateId, dIdIn) {
    if (dIdIn == undefined) return dIdIn;
    dIdInB = hlpr.bland_str(dIdIn);
    if (dIdInB.match(/DID\d*$/g) !== null) return dIdIn;
    for(tDistId in oRegions[stateId]) {
        tDistNameB = hlpr.bland_str(oRegions[stateId][tDistId])
        if(tDistNameB === dIdInB) return tDistId;
    }
    return dIdIn;
}


exports.explore_jsons = function(cmdArgs) {
    cRegionsFile = cmdArgs[1];
    cHospsFile = cmdArgs[2];
    oRegions = require(cRegionsFile);
    oHosps = require(cHospsFile);
    cmd = cmdArgs[3];
    stateId = get_stateid(oRegions, cmdArgs[4]);
    districtId = get_districtid(oRegions, stateId, cmdArgs[5]);
    bQuit = false;
    if (cmd == 'statesls') list_states(oRegions);
    if (cmd == 'districtsls') list_districts(oRegions, stateId);
    if (cmd == 'hospsls') list_hosps(oHosps, stateId, districtId);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
