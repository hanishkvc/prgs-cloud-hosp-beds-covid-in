

let lStates = {
    'KA': [
        'Tumakuru',
        'Bengaluru',
        ],
    'KL': [
        'Ernakulam',
        'Thiruvananthapuram',
        ],
    'TN': [
        'Chennai',
        'Vellore',
        ]
    }

console.log('Hello world')
console.log(lStates['KA'])

for(tState in lStates) {
    console.log(tState, lStates[tState])
}


/* vim: set ts=4 sts=4 expandtab :*/
