

let lStates = {
    'KA': {
        'Name': 'Karnataka',
        'DId0': 'Tumakuru',
        'DId1': 'Bengaluru',
        },
    'KL': {
        'Name': 'Kerala',
        'DId0': 'Ernakulam',
        'DId1': 'Thiruvananthapuram',
        },
    'TN': {
        'Name': 'Tamilnadu',
        'DId0': 'Chennai',
        'DId1': 'Vellore',
        }
    }

console.log('Hello world')
console.log(lStates['KA'])

for(tStateKey in lStates) {
    tName = null
    tState = lStates[tStateKey]
    for(tKey in tState) {
        if (tKey === 'Name') {
            tName = tState[tKey]
        } else {
            console.log(tStateKey, tName, tKey, tState[tKey])
        }
    }
}


/* vim: set ts=4 sts=4 expandtab :*/
