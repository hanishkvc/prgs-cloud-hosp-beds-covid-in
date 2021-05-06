/*
 * HospAdmins Module - Helper routine to work with the Hospital Admins in the system
 * HanishKVC, 2021
 * GPL
 */


var crypto = require('crypto');
var admin = require('firebase-admin');
var hlpr = require('./hlpr');


/**
 * Get the Users' auth uid, given their email id.
 * It returns valid uid only for verified email ids
 * hospId dummy argument, used only as part of logged messages
 */
async function getUserId(userEmail, hospId=null) {
    userAuth = await admin.auth().getUserByEmail(userEmail);
    //console.log(userAuth);
    if (userAuth.emailVerified) {
        console.error(`INFO:HospAdmins:Hosp:${hospId}:User:${userEmail}:Ok:WillUpdate`);
        return userAuth.uid;
    }
    console.error(`WARN:HospAdmins:Hosp:${hospId}:User:${userEmail}:NotVerified:WillBlockHospDataUpdates`);
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


exports.enable_testadmin = function(db, testAdmin="test@india.world") {
    admin.auth().getUserByEmail(testAdmin)
        .then((adminAuth) => {
            admin.auth().updateUser(adminAuth.uid, { emailVerified: true })
                .then((mUser) => {
                    console.log("INFO:HospAdmins:EnableTestAdmin: Enabled", mUser.email);
                })
                .catch((error) => {
                    console.error("ERRR:HospAdmins:EnableTestAdmin: Failed", error);
                });
        })
        .catch((error) => {
            console.error("DBUG:HospAdmins:EnableTestAdmin:", error);
        });
}


exports.import = async function (db, cAdminsFile) {
    try {
        oAdmins = require(cAdminsFile);
    } catch(error) {
        console.error(`ERRR:HospAdmins:Import:[${cAdminsFile}] invalid???:${error.message}`);
        return
    }
    dcHospsExtra = db.collection('HospitalsExtra');
    for(tHosp in oAdmins) {
        try {
            adminUid = await getUserId(oAdmins[tHosp], tHosp)
            await dcHospsExtra.doc(tHosp)
                .set({ 'AdminId': adminUid });
        } catch(error) {
            console.error(`ERRR:HospAdmins:Hosp:${tHosp}:User:${oAdmins[tHosp]}:Invalid:WontModifyOnServer:${error.message}`);
        }
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
