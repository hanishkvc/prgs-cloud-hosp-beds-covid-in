/*
 * Firebase related helper logics
 * HanishKVC, 2021
 * GPL
 */


function aui_start(authed_handler) {
    gAUI.start('#firebaseui-auth-container', {
        signInSuccessUrl: 'GotAuthed',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        callbacks: {
            signInSuccessWithAuthResult: authed_handler
            },
        });
}


function aui_init() {
    gAUI = new firebaseui.auth.AuthUI(firebase.auth());
}


function fb_init() {
    try {
        gApp = firebase.app();
        gDB = firebase.firestore();
        aui_init()
        console.log("INFO:FBInit: started...");
        return true
    } catch (e) {
        console.error(e);
        return false
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
