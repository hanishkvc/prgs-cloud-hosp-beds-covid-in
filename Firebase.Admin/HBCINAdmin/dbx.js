/*
 * DBX Module - Helper routine to work with the db in the system
 * HanishKVC, 2021
 * GPL
 */


/**
 * Import a java object as a firestore collection of documents
 * It can be used to create a new collection
 * or to update documents in a existing collection
 * or to add new documents to a existing collection
 */
exports._import_collection = function (db, cName, oCollection) {
    curDC=db.collection("cName");
    for(tDocKey in oCollection) {
        tDoc = oCollection[tDocKey]
        curDC.doc(tDocKey)
            .set(tDoc)
            .then(hlpr.msg_success.bind(null, tDocKey, "ImportCollection:Adding"))
            .catch(hlpr.msg_failure.bind(null, tDocKey, "ImportCollection:Adding"))
    }
}


exports.import_collection = function (db, cName, cFile=null) {
    if (cFile === null) cFile = cName;
    oCollection = require(cFile);
    _import_collection(db, cName, oCollection);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
