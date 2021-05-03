/*
 * regions.js - support logic for creating regions needed by the system.
 * HanishKVC, 2021
 * GPL
 */


var hlpr = require('./hlpr');


exports.create_states = function (db, oStates) {
    dcStates=db.collection("States");
    for(tStateKey in oStates) {
        tName = null
        tState = oStates[tStateKey]
        dcStates.doc(tStateKey)
            .set(tState)
            .then(hlpr.msg_success.bind(null, tStateKey, "CreateStates:Adding"))
            .catch(hlpr.msg_failure.bind(null, tStateKey, "CreateStates:Adding"))
        for(tKey in tState) {
            if (tKey === 'Name') {
                tName = tState[tKey]
            } else {
                console.log(tStateKey, tName, tKey, tState[tKey])
            }
        }
    }
}


