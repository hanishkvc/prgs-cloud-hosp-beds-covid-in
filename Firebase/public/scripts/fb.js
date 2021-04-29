
function fb_init() {
    try {
        gApp = firebase.app();
        gDB = firebase.firestore();
        console.log("INFO:FBInit: started...");
        return true
    } catch (e) {
        console.error(e);
        return false
    }
}

/* vim: set ts=4 sts=4 sw=4 expandtab :*/
