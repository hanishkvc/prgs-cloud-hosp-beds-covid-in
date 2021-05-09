/*
 * Firebase related helper logics
 * HanishKVC, 2021
 * GPL
 */


function authui_start(authed_handler) {
    gAuthUI.start('#firebaseui-auth-container', {
        signInSuccessUrl: 'GotAuthed',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        callbacks: {
            signInSuccessWithAuthResult: authed_handler,
            signInFailure: function(error) {
                    console.error("ERRR:Auth:", error);
                }
            },
        });
}


function authui_init() {
    gAuthUI = new firebaseui.auth.AuthUI(firebase.auth());
}


function fb_init() {
    try {
        console.log("INFO:FBInit: started...");
        gApp = firebase.app();
        gDB = firebase.firestore();
        authui_init()
        firebase.analytics();
        firebase.performance();
        console.log("INFO:FBInit: doing ok...");
        return true
    } catch (e) {
        console.error(e);
        return false
    }
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
