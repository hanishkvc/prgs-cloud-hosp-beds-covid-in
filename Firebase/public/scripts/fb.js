
function fb_init() {
    try {
        let app = firebase.app();
        let db = firebase.firestore();
        console.log("INFO:FBInit: started...");
        elLoad.textContent = 'Save Nature Save Earth';
        get_states(db);
    } catch (e) {
        console.error(e);
        elLoad.textContent = 'Error loading main logic, check the console.';
    }
}

/* vim: set ts=4 sts=4 sw=4 expandtab :*/
