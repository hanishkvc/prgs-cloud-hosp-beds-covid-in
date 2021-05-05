#!/usr/bin/env python3
# Generate States/UTs/Districts/Regions json from csv files
# HanishKVC, 2021
# GPL

import pandas
import json
import numpy


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


def gen_hosps(fName, dStates, dRegions):
    p=pandas.read_csv(fName)
    dHosps = {}
    hospCnt = 0
    for s in p.State.unique():
        if s.startswith('North Twenty'):
            continue
        tStateId = dStates[s]
        tDistricts = p[p.State == s].District.unique().astype(str)
        tDistricts.sort()
        for d in tDistricts:
            tDistrictId = dRegions[s][d]
            tHosps = p[p.State == s][p.District == d]
            for i in range(tHosps.shape[0]):
                h = dict(tHosps.iloc[i])
                tPincode = str(h['Pincode'])
                if (tPincode == 'nan'):
                    tPincode = 999999
                else:
                    tPincode = tPincode.strip()[:6]
                    tPincode = int(tPincode.replace(" ", ""))
                h['Pincode'] = tPincode
                hospCnt += 1
                tHospId = "H{}{}_{}".format(tStateId, tDistrictId, hospCnt)
                dHosp = {
                    'Name': h['Hospital_Name'],
                    'StateId': tStateId,
                    'DistrictId': tDistrictId,
                    'PinCode': h['Pincode'],
                    'BedsICU': -1,
                    'BedsNormal': -1,
                    'BedsVntltr': -1,
                    }
                dHosps[tHospId] = dHosp
                print(dHosp)
    jHosps = json.dumps(dHosps, indent=4)
    f = open("/tmp/hosps.json","wt+")
    f.write(jHosps)
    f.close()
    return dHosps


dStates = get_statecodes("./statesuts.code.csv")
dRegions = gen_regions("hospital_directory.csv", dStates)
dHosps = gen_hosps("./hospital_directory.csv", dStates, dRegions)

# vim: set sts=4 ts=4 sw=4 expandtab: #
