/*
 * HospAdmins Module - Helper routine to work with the Hospital Admins in the system
 * HanishKVC, 2021
 * GPL
 */


var admin = require('firebase-admin');
var hlpr = require('./hlpr');


async function getUserId(userEmail) {
    userAuth = await admin.auth().getUserByEmail(userEmail);
    console.log(userAuth);
    return userAuth.uid;
}


async function transform(db, oData, mTransform) {
    if (mTransform === null) return oData;
    for(tDataKey in oData) {
        if (mTransform[tDataKey] === 'USEREMAIL2ID') {
            oData[tDataKey] = await getUserId(oData[tDataKey]);
        }
    }
}


exports.import = function (db, cAdminsFile) {
    oAdmins = require(cAdminsFile);
    for(tHosp in oAdmins) {
        getUserId(oAdmins[tHosp])
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
