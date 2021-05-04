/*
 * HospAdmins Module - Helper routine to work with the Hospital Admins in the system
 * HanishKVC, 2021
 * GPL
 */


var crypto = require('crypto');
var admin = require('firebase-admin');
var hlpr = require('./hlpr');


async function getUserId(userEmail) {
    userAuth = await admin.auth().getUserByEmail(userEmail);
    //console.log(userAuth);
    if (userAuth.emailVerified) {
        console.error(`INFO:HospAdmins:User:${userEmail}: verified`);
        return userAuth.uid;
    }
    console.error(`WARN:HospAdmins:User:${userEmail}: email Not yet verified, skipping`);
    return 'INVALID'+crypto.randomBytes(16).toString('hex');
}


async function transform(db, oData, mTransform) {
    if (mTransform === null) return oData;
    for(tDataKey in oData) {
        if (mTransform[tDataKey] === 'USEREMAIL2ID') {
            oData[tDataKey] = await getUserId(oData[tDataKey]);
        }
    }
}


exports.import = async function (db, cAdminsFile) {
    oAdmins = require(cAdminsFile);
    dcHospsExtra = db.collection('HospitalsExtra');
    for(tHosp in oAdmins) {
        try {
            adminUid = await getUserId(oAdmins[tHosp])
            await dcHospsExtra.doc(tHosp)
                .set({ 'AdminId': adminUid });
        } catch(error) {
            console.error(`ERRR:HospAdmins:Hosp:${tHosp}:User:${oAdmins[tHosp]}:${error.message}`);
        }
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
