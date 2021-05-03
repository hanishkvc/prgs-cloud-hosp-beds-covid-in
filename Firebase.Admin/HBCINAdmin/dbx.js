/*
 * DBX Module - Helper routine to work with the db in the system
 * HanishKVC, 2021
 * GPL
 */


var hlpr = require('./hlpr');


/**
 * Import a java object as a firestore collection of documents
 * It can be used to create a new collection of documents.
 * or to update some or all documents in a existing collection
 *     Even if updating only few fields in the document
 *     data for all fields needs to be provided.
 *     Else missing fields will be removed from the updated doc.
 * or to add new documents to a existing collection.
 */
function _import_collection(db, cName, oCollection) {
    curDC=db.collection(cName);
    for(tDocKey in oCollection) {
        tDoc = oCollection[tDocKey]
        curDC.doc(tDocKey)
            .set(tDoc)
            .then(hlpr.msg_success.bind(null, tDocKey, `ImportCollection:${cName}:Adding`))
            .catch(hlpr.msg_failure.bind(null, tDocKey, `ImportCollection:${cName}:Adding`))
    }
}
exports._import_collection = _import_collection


exports.import_collection = function (db, cName, cFile=null) {
    if (cFile === null) cFile = cName;
    oCollection = require(cFile);
    _import_collection(db, cName, oCollection);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
