/*
 * Firestore related helper logics
 * HanishKVC, 2021
 * GPL
 */


async function db_get_states(db) {
    let lStates = []
    dcStates = db.collection('/States')
    try {
        var qDocs = await dcStates.get()
        qDocs.forEach((doc) => {
            tState = doc.data();
            lStates.push([doc.id, tState['Name']])
            console.log("INFO:GetStates:", doc.id, tState);
            });
    } catch(error){
        console.log("ERRR:GetStates:", error);
    }
    return lStates
}


async function db_get_state(db, stateId) {
    let lDistricts = []
    ddState = db.collection('/States').doc(stateId);
    try {
        var tState = await ddState.get();
        if (tState.exists) {
            for(tDistKey in tState.data()) {
                if (tDistKey === 'Name') {
                    continue
                }
                console.log("INFO:GetState:", stateId, tDistKey);
                lDistricts.push([tDistKey, tState.data()[tDistKey]])
            }
        } else {
            console.log("ERRR:GetState:", stateId, ":Not found");
        }
    } catch(error){
        console.log("ERRR:GetState:", stateId, error);
    }
    return lDistricts
}


async function db_get_hospitals(db, stateId, districtId) {
    let lHosps = []
    bedType = 'BedsNormal'
    minFree = 5
    dcHosps = db.collection('/Hospitals')
    try {
        var qDocs = await dcHosps.where('StateId', '==', stateId).where('DistrictId', '==', districtId)
                                    .where(bedType, '>=', minFree).order_by(bedType, direction=db.Query.DESCENDING).limit(10);
        qDocs.forEach((doc) => {
            tHosp = doc.data();
            lHosps.push([doc.id, tHosp['Name'], tHosp['Pincode'], tHosp['ICUsBeds'], tHosp['NormalBeds']])
            console.log("INFO:GetHosps:", doc.id, tHosp);
            });
    } catch(error){
        console.log("ERRR:GetHosps:", error);
    }
    return lHosps
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
