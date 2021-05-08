/*
 * Helper module - set of useful generic routines
 * HanishKVC, 2021
 * GPL
 */


exports.msg_success = function(sStateKey, sMsg) {
    console.log("DONE:",sMsg, sStateKey);
}


exports.msg_failure = function(sStateKey, sMsg, error) {
    console.error("ERRR:", sMsg, sStateKey, error.message);
}


exports.busy_sleep = function(x,y) {
    for(t1=0; t1 < x; t1++) {
        for(t2=0; t2 < y; t2++) {
        }
    }
}


exports.bland_str = function(strIn) {
	strOut = strIn.replace(/ /g, ""); // Remove empty space inbtw
	return strOut.toUpperCase()
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
