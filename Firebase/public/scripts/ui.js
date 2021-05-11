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
    if (tableClass === undefined)
        tHTML = " <table> ";
    else
        tHTML = ` <table class="${tableClass}"> `;
    tHTML += "<thead> <tr> ";
    for (tField of lHead) {
        //console.log(lPart)
        tType = mTypes[tField]
        if (tType === 'hide') {
            tHTML += ` <th style="display:none;">${tField}</th> `;
        } else {
            tHTML += ` <th>${tField}</th> `;
        }
    }
    tHTML += " </tr> </thead> ";
    tHTML += "<tbody> ";
    r = -1
    for (lCur of lDataMxN) {
        r += 1
        tHTML += "<tr> ";
        //console.log(lCur)
        tEntityId = lCur[0]
        c = -1
        for (lPart of lCur) {
            c += 1
            //console.log(lPart)
            tField = lHead[c]
            tType = mTypes[tField]
            //console.log("ui_table:", r, c, mTypes, tField, tType);
            if (tType === 'input') {
                tHTML += ` <td> <input type="number" class="h7in" id="${r}" name="${tField}" value="${lPart}"> </td> `;
            } else if (tType === 'button') {
                tHTML += ` <td> <button type="button" class="h7btn" id="${r}" name="${tEntityId}"> ${lPart} </button> </td> `;
            } else if (tType === 'hide') {
                tHTML += ` <td style="display:none;">${lPart}</td> `;
            } else {
                tHTML += ` <td>${lPart}</td> `;
            }
        }
        tHTML += " </tr>";
    }
    tHTML += " </tbody>";
    tHTML += " </table>";
    if (bOverwrite) {
        el.innerHTML = tHTML;
    } else {
        el.innerHTML += tHTML;
    }
    if (clickHandler === null) return;
    elBtns = document.getElementsByClassName('h7btn')
    for(i = 0; i < elBtns.length; i++) {
        elBtns[i].onclick = clickHandler
        //console.log(elBtns[i])
    }
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


function ui_list_anchors(el, lDataNx2) {
    el.innerHTML = ""
    for(lCur of lDataNx2) {
        el.innerHTML += `<a>${lCur[1]}</a> `
    }
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
    if (bOverwrite)
        el.replaceChildren(tDiv);
    else
        el.appendChild(tDiv);
}


/* vim: set ts=4 sts=4 sw=4 expandtab :*/
