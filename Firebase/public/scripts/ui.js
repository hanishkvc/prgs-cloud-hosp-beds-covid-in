/*
 * UI Related helper logics
 * HanishKVC, 2021
 * GPL
 */


function ui_onclick_handler(e) {
    console.log(this.id, e);
}


/**
 * Create a html table with the passed arguments.
 * el: The element whose innerHTML should be set with the table
 * lDataMxN: The array of arrays which contains the data.
 *     This is a list of rows.
 * lHead: The list of column field names, which is shown.
 * mTypes: A map/object which specifies how fields should be represented.
 *     The fields are specified using using their field names.
 *     If a field's type
 *         is not specified, it is treated as a normal cell.
 *         is 'input', a input cell is created.
 *         is 'button', a button cell is created.
 * clickHandler: handler which will be called when button is clicked.
 */
function ui_table(el, opts, lDataMxN, lHead, mTypes={}, clickHandler=null) {
    bOverwrite = opts['bOverwrite'];
    tableClass = opts['TableClass'];
    if (bOverwrite === undefined) bOverwrite = true;
    tTable = document.createElement("table");
    if (tableClass !== undefined)
        tTable.className = tableClass;
    tHead = document.createElement("thead");
    tRow = document.createElement("tr");
    for (tField of lHead) {
        //console.log(lPart)
        tH = document.createElement("th");
        tH.textContent = tField;
        tType = mTypes[tField]
        if (tType === 'hide') tH.style.display = "none";
        tRow.appendChild(tH);
    }
    tHead.appendChild(tRow);
    tTable.appendChild(tHead);
    tBody = document.createElement("tbody");
    r = -1
    for (lCur of lDataMxN) {
        r += 1
        tRow = document.createElement("tr");
        //console.log(lCur)
        tEntityId = lCur[0]
        c = -1
        for (lPart of lCur) {
            c += 1
            //console.log(lPart)
            tField = lHead[c]
            tType = mTypes[tField]
            //console.log("ui_table:", r, c, mTypes, tField, tType);
            tD = document.createElement("td");
            if (tType === 'input') {
                tInput = document.createElement("input");
                tInput.type = "number";
                tInput.className = "h7in";
                tInput.id = r;
                tInput.name = tField;
                tInput.defaultValue = lPart;
                tD.appendChild(tInput);
            } else if (tType === 'button') {
                tBtn = document.createElement("button");
                tBtn.type = "button";
                tBtn.className = "h7btn";
                tBtn.id = r;
                tBtn.name = tEntityId;
                tBtn.textContent = lPart;
                if (clickHandler !== null) tBtn.onclick = clickHandler
                tD.appendChild(tBtn);
            } else if (tType === 'hide') {
                tD.style.display = "none";
                tD.textContent = lPart;
            } else {
                tD.textContent = lPart;
            }
            tRow.appendChild(tD);
        }
        tBody.appendChild(tRow);
    }
    tTable.appendChild(tBody);
    if (bOverwrite) el.replaceChildren(tTable);
    else el.appendChild(tTable);
}


function ui_select(el, sId, lChoices, sDefault=null, changeHandler=null) {
    sHTML = `<select class="h7sel" id="${sId}" name="${sId}">`
    for (tChoice of lChoices) {
        if (tChoice === sDefault) {
            tSelected = "selected"
        } else {
            tSelected = ""
        }
        sHTML += `<option ${tSelected}>${tChoice}</option>`
    }
    sHTML += "</select>"
    el.innerHTML = sHTML;
    if (changeHandler !== null) {
        elSel = document.getElementById(sId);
        elSel.onchange = changeHandler
    }
}


function ui_select_changehandler(sId, changeHandler) {
    elSel = document.getElementById(sId);
    elSel.onchange = changeHandler
}


function ui_list_anchors(el, opts, lDataNx2) {
    bOverwrite = opts['bOverwrite'];
    if (bOverwrite === undefined) bOverwrite = true;
    tDiv = document.createElement("div");
    for(lCur of lDataNx2) {
        tA = document.createElement("a");
        tA.id = lCur[0];
        tA.name = lCur[0];
        tA.textContent = lCur[1];
        tDiv.appendChild(tA);
    }
    if (bOverwrite) el.replaceChildren(tDiv);
    else el.appendChild(tDiv);
}


/**
 * Create a bunch of buttons within html element el, based on the info
 * in the passed lDataNx2.
 * User can control whether these buttons get appended into el or
 * replace the existing contents (default) of el, by passing bOverwrite
 * through opts.
 */
function ui_list_buttons(el, opts, lDataNx2, clickHandler) {
    bOverwrite = opts['bOverwrite'];
    if (bOverwrite === undefined) bOverwrite = true;
    tDiv = document.createElement("div");
    for(lCur of lDataNx2) {
        tBtn = document.createElement("button");
        tBtn.id = lCur[0];
        tBtn.name = lCur[0];
        tBtn.textContent = lCur[1];
        tBtn.onclick = clickHandler;
        tDiv.appendChild(tBtn);
    }
    if (bOverwrite) el.replaceChildren(tDiv);
    else el.appendChild(tDiv);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
