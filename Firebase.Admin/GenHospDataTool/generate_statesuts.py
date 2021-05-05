#!/usr/bin/env python3
# Generate States/UTs/Districts/Regions json from csv files
# HanishKVC, 2021
# GPL

import pandas


def get_statecodes(fName):
    p = pandas.read_csv(fName)
    dStates = {}
    for i in range(p.shape[0]):
	    dStates[p.iloc[i,0].strip()] = p.iloc[i,1].strip()
    print(dStates)

    dStates['Odisha'] = dStates['Orissa']
    dStates['Puducherry'] = dStates['Pondicherry']
    dStates['Telangana'] = 'TS'
    return dStates


def gen_regions(fName, dStates):
    p=pandas.read_csv(fName)
    dRegions = {}
    f = open("/tmp/regions.json","w+")
    print('{', file=f)
    for s in p.State.unique():
        if s.startswith('North Twenty'):
            continue
        dRegions[s] = {}
        print('    "{}": '.format(dStates[s])+"{", file=f)
        print('{:8}"Name": "{}",'.format(" ",s), file=f)
        i = 0
        tDistricts = p[p.State == s].District.unique().astype(str)
        print(s, tDistricts)
        tDistricts.sort()
        print(tDistricts.shape[0])
        for d in tDistricts:
            i += 1
            if (i >= tDistricts.shape[0]):
                tTerm = ""
            else:
                tTerm = ","
            tDId = "DId{:02}".format(i)
            print('{:8}"{}": "{}"{}'.format(" ",tDId,d,tTerm), file=f)
            dRegions[s][d] = tDId
        print("{:8}".format(' ')+"},", file=f)
    print('}', file=f)
    f.close()
    return dRegions



dStates = get_statecodes("./statesuts.code.csv")
dRegions = gen_regions("hospital_directory.csv", dStates)
print(dRegions)


# vim: set sts=4 ts=4 sw=4 expandtab: #
