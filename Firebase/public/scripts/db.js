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


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
