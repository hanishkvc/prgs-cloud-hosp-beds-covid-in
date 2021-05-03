/*
 * Hospitals module - Work with hospitals data required by the system.
 * HanishKVC, 2021
 * GPL
 */


exports.create_hosps = async function(db, oStates) {
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
                    'Name': 'HospName',
                    'PinCode': 123456,
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
                    .then(msg_success.bind(null, tHospKey, "CreateHosps:Adding"))
                    .catch(msg_failure.bind(null, tHospKey, "CreateHosps:Adding"));
                dcHospsExtra.doc(tHospKey)
                    .set(tHospExtra)
                    .then(msg_success.bind(null, tHospKey, "CreateHospsExtra:Adding"))
                    .catch(msg_failure.bind(null, tHospKey, "CreateHospsExtra:Adding"));
            }
        }
    }
}


