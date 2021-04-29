
function get_states(db) {
    dcStates = db.collection('/States')
    dcStates
        .get()
        .then((qDocs) => {
            qDocs.forEach((doc) => {
                tState = doc.data()
                console.log("INFO:GetStates:", doc.id, tState);
                elStates.innerHTML += `<a>${tState['Name']}</a> `
            });
        })
        .catch((error) => {
            console.log("ERRR:GetStates:", error);
        });
}

/* vim: set ts=4 sts=4 sw=4 expandtab :*/
