/*
 * Firestore related helper logics
 * HanishKVC, 2021
 * GPL
 */


function msg_success(sKey, sMsg) {
    tMsg = `DONE:${sMsg}:${sKey}`
    console.log(tMsg);
    alert(tMsg);
}


function msg_failure(sKey, sMsg, error) {
    tMsg = `ERRR:${sMsg}:${sKey}:${error.details}`
    console.error(tMsg);
    alert(tMsg);
}


async function _db_get_states(db) {
    let lStates = []
    dcStates = db.collection('/States')
    try {
        var qDocs = await dcStates.get()
        qDocs.forEach((doc) => {
            tState = doc.data();
            lStates.push([doc.id, tState['Name']])
            console.debug("INFO:_dbGetStates:", doc.id, tState);
            });
    } catch(error){
        console.error("ERRR:_dbGetStates:", error);
    }
    return lStates
}


async function _l_get_states(db) {
    let lStates = []
    sortedKeys = Object.keys(gmStates).sort();
    sortedKeys.forEach((key) => {
        tCur = [key, gmStates[key]['Name']]
        lStates.push(tCur)
        console.debug("INFO:_lGetStates:", tCur);
        })
    return lStates
}


db_get_states = _l_get_states


async function _db_get_state(db, stateId) {
    let lDistricts = []
    ddState = db.collection('/States').doc(stateId);
    try {
        var tState = await ddState.get();
        if (tState.exists) {
            tDistKeys = Object.keys(tState.data()).sort();
            tDistKeys.forEach((tDistKey) => {
                    if (tDistKey === 'Name') {
                        return
                    }
                    console.debug("INFO:_dbGetState:", stateId, tDistKey);
                    lDistricts.push([tDistKey, tState.data()[tDistKey]])
                })
        } else {
            console.error("ERRR:_dbGetState:", stateId, ":Not found");
        }
    } catch(error){
        console.error("ERRR:_dbGetState:", stateId, error);
    }
    return lDistricts
}


async function _l_get_state(db, stateId) {
    let lDistricts = []
    tState = gmStates[stateId];
    sortedKeys = Object.keys(tState).sort();
    sortedKeys.forEach((key) => {
        if (key === 'Name') return;
        tCur = [key, tState[key]]
        lDistricts.push(tCur)
        console.debug("INFO:_lGetState:", tCur);
        })
    return lDistricts
}


db_get_state = _l_get_state


async function db_get_hospitals(db, stateId, districtId) {
    let lHosps = []
    bedType = 'BedsNormal'
    minFree = 5
    dcHosps = db.collection('/Hospitals')
    try {
        var qDocs = await dcHosps.where('StateId', '==', stateId).where('DistrictId', '==', districtId)
                                    .where(bedType, '>=', minFree).orderBy(bedType, direction=firebase.firestore.Query.DESCENDING).limit(10).get();
        console.debug("INFO:GetHosps:",stateId, districtId, qDocs);
        qDocs.forEach((doc) => {
            tHosp = doc.data();
            tTS = new Date(tHosp['TimeStamp'].seconds*1000);
            const options = { year: '2-digit', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
            sTS = Intl.DateTimeFormat('en-IN', options).format(tTS)
            lHosps.push([doc.id, tHosp['Name'], tHosp['PinCode'], tHosp['BedsICU'], tHosp['BedsNormal'], sTS])
            console.debug("INFO:GetHosps:", doc.id, tHosp);
            });
    } catch(error){
        console.error("ERRR:GetHosps:", error);
    }
    return lHosps
}


/*
 * THe logic limits a user to administer 10 hospitals for now.
 */
async function db_get_adminhospitalids(db, userId) {
    let lHospIds = []
    dcHospsExtra = db.collection('/HospitalsExtra')
    try {
        var qDocs = await dcHospsExtra.where('AdminId', '==', userId).limit(10).get();
        console.debug("INFO:GetAdminHospIds:",userId, qDocs);
        qDocs.forEach((doc) => {
            lHospIds.push(doc.id);
            console.debug("INFO:GetAdminHospIds:", doc.id, doc.data());
            });
    } catch(error){
        console.error("ERRR:GetAdminHospIds:", error);
    }
    return lHospIds
}


async function db_get_adminhospitals(db, userId) {
    let lHosps = []
    dcHosps = db.collection('/Hospitals')
    try {
        var lHospIds = await db_get_adminhospitalids(db, userId);
        if (lHospIds.length <= 0) return lHosps;
        var qDocs = await dcHosps.where(firebase.firestore.FieldPath.documentId(), 'in', lHospIds).limit(10).get();
        console.debug("INFO:GetAdminHosps:",userId, qDocs);
        qDocs.forEach((doc) => {
            tHosp = doc.data();
            tData = [doc.id, tHosp['Name'], tHosp['PinCode'], tHosp['BedsICU'], tHosp['BedsNormal']]
            lHosps.push(tData);
            console.debug("INFO:GetAdminHosps:", tData);
            });
    } catch(error){
        console.error("ERRR:GetAdminHosps:", error);
    }
    return lHosps
}


function db_update_hospital(db, hospId, bedsICU, bedsNormal) {
    dcHosps = db.collection('/Hospitals')
    dcHosps.doc(hospId)
        .update({ 'BedsICU': bedsICU, 'BedsNormal': bedsNormal, 'TimeStamp': firebase.firestore.FieldValue.serverTimestamp() })
        .then(msg_success.bind(null, hospId, "UpdateHosp:"))
        .catch(msg_failure.bind(null, hospId, "UpdateHosp:"))
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
