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


function _authui_init_onerror(error) {
    console.error("ERRR:authui:load failed:", error);
}


function _authui_init_onload(do_auth) {
    gAuthUI = new firebaseui.auth.AuthUI(firebase.auth());
    console.log("INFO:authui:inited");
    do_auth();
}


function authui_init(do_auth) {
    if (gAuthUI !== null) {
        do_auth();
        return;
    }
    var head = document.getElementsByTagName("head")[0]
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.onerror = _authui_init_onerror;
    link.href = "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css";
    head.appendChild(link);
    var script = document.createElement("script");
    script.onerror = _authui_init_onerror;
    script.onload = _authui_init_onload.bind(null, do_auth);
    script.src = "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js";
    head.appendChild(script);
}


function fb_init() {
    try {
        console.log("INFO:FBInit: started...");
        gApp = firebase.app();
        gDB = firebase.firestore();
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
