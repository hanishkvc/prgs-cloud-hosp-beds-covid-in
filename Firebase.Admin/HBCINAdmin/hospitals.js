/*
 * Hospitals module - Work with hospitals data required by the system.
 * HanishKVC, 2021
 * GPL
 */


var admin = require('firebase-admin');
var hlpr = require('./hlpr');


exports.create_hosps_testdata = async function(db, oStates) {
    dcHosps = db.collection('Hospitals');
    dcHospsExtra = db.collection('HospitalsExtra');
    iHosp = 0
    for(tStateK in oStates) {
        tState = oStates[tStateK];
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
                continue;
            }
            tHospNums = Math.round(Math.random()*5);
            if (iHosp === 0) tHospNums = 15;
            for(i = 0; i < tHospNums; i++) {
                iHosp += 1
                tHosp = {
                    'Name': `HospName_${iHosp}`,
                    'PinCode': 123456+iHosp,
                    'DistrictId': tKey,
                    'StateId': tStateK,
                    'BedsICU': Math.round(Math.random()*20),
                    'BedsNormal': Math.round(Math.random()*20),
                    'BedsVntltr': Math.round(Math.random()*20),
                    'TimeStamp': admin.firestore.FieldValue.serverTimestamp(),
                    }
                tHospExtra = {
                    'AdminId': "999-555*AAA-+-888"
                    }
                await new Promise(r => setTimeout(r, 500));
                tHospKey = `H${tStateK}${tKey}-${iHosp}`
                dcHosps.doc(tHospKey)
                    .set(tHosp)
                    .then(hlpr.msg_success.bind(null, tHospKey, "CreateHosps:Adding"))
                    .catch(hlpr.msg_failure.bind(null, tHospKey, "CreateHosps:Adding"));
                dcHospsExtra.doc(tHospKey)
                    .set(tHospExtra)
                    .then(hlpr.msg_success.bind(null, tHospKey, "CreateHospsExtra:Adding"))
                    .catch(hlpr.msg_failure.bind(null, tHospKey, "CreateHospsExtra:Adding"));
            }
        }
    }
}


exports.import = async function (db, cHospsFile, mode) {
    try {
        oHosps = require(cHospsFile);
    } catch(error) {
        console.error(`ERRR:Hospitals:ImportHosps:[${cHospsFile}] invalid???:${error.message}`);
        return
    }
    dcHosps = db.collection('Hospitals');
    for(tHospId in oHosps) {
        try {
            tHosp = oHosps[tHospId]
            if (mode == 'TEST') {
                tHosp['BedsICU'] = 1
                tHosp['BedsNormal'] = 1
                tHosp['BedsVntltr'] = 1
            }
            await dcHosps.doc(tHospId)
                .set(tHosp);
            console.log(`INFO:Hospitals:ImportHosps:${tHospId}`);
        } catch(error) {
            console.error(`ERRR:Hospitals:ImportHosps:${tHospId}:${tHosp}:While adding:${error.message}`);
        }
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
