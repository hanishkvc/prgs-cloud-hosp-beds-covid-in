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


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
