/*
 * Patients module - Work with Patients data required by the system.
 * HanishKVC, 2021
 * GPL
 */


var admin = require('firebase-admin');
var hlpr = require('./hlpr');


exports.create_patients2allot_testdata = async function(db, oStates) {
    var dcPats = db.collection('/Patients');
    var iPat = 0
    for(let tStateK in oStates) {
        tState = oStates[tStateK];
        for(let tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
                continue;
            }
            regionId = `${tStateK}${tKey}`;
            await dcPats.doc(regionId).set({ "StateId": tStateK, "DistrictId": tKey });
            dcToAllot = db.collection(`/Patients/${regionId}/ToAllot`);
            tPatsNum = Math.round(Math.random()*5);
            for(i = 0; i < tPatsNum; i++) {
                iPat += 1
                tHospKey = `H${tStateK}${tKey}-${Math.round(Math.random()*10)}`
                tPat = {
                    'Name': `Pat_${iPat}`,
                    'IdType': 'Phone',
                    'IdValue': 1234567890+iPat,
                    'Severity': 0,
                    'Near': tHospKey,
                    'TimeStamp': admin.firestore.FieldValue.serverTimestamp(),
                    }
                await new Promise(r => setTimeout(r, 500));
                dcToAllot.doc()
                    .set(tPat)
                    .then(hlpr.msg_success.bind(null, iPat, "CreatePat2AllotTD:Adding"))
                    .catch(hlpr.msg_failure.bind(null, iPat, "CreatePat2AllotTD:Adding"));
            }
        }
    }
}


exports.import = async function (db, cHospsFile, start, mode) {
    try {
        oHosps = require(cHospsFile);
    } catch(error) {
        console.error(`ERRR:Hospitals:ImportHosps:[${cHospsFile}] invalid???:${error.message}`);
        return
    }
    dcHosps = db.collection('Hospitals');
    iCur = -1;
    for(tHospId in oHosps) {
        iCur += 1
        if (iCur < start) continue;
        try {
            tHosp = oHosps[tHospId]
            if (mode == 'TEST') {
                tHosp['BedsICU'] = 1+Math.round(Math.random()*10)
                tHosp['BedsNormal'] = 1+Math.round(Math.random()*10)
                tHosp['BedsVntltr'] = 1+Math.round(Math.random()*10)
            }
            tHosp['TimeStamp'] = admin.firestore.FieldValue.serverTimestamp()
            await dcHosps.doc(tHospId)
                .set(tHosp);
            console.log(`INFO:Hospitals:ImportHosps:${tHospId}`);
            await new Promise(r => setTimeout(r, 100));
        } catch(error) {
            console.error(`ERRR:Hospitals:ImportHosps:${tHospId}:${tHosp}:While adding:${error.message}`);
        }
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
