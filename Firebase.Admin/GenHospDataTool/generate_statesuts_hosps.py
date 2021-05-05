#!/usr/bin/env python3
# Generate States/UTs/Districts/Regions json from csv files
# HanishKVC, 2021
# GPL

import sys
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
    dJRegions = {}
    for s in p.State.unique():
        if s.startswith('North Twenty'):
            continue
        tStateId = dStates[s]
        dRegions[s] = {}
        dJRegions[tStateId] = {}
        dJRegions[tStateId]['Name'] = s
        i = 0
        tDistricts = p[p.State == s].District.unique().astype(str)
        tDistricts.sort()
        for d in tDistricts:
            i += 1
            tDId = "DId{:02}".format(i)
            dRegions[s][d] = tDId
            dJRegions[tStateId][tDId] = d
    jRegions = json.dumps(dJRegions, indent=4)
    f = open("/tmp/regions.json","w+")
    f.write(jRegions)
    f.close()
    return dRegions


bModeTestData = False
def gen_hosps(fName, dStates, dRegions, bSkipNoCatHosps):
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
                if bSkipNoCatHosps and (h['Hospital_Category'] == '0'):
                    continue
                tPincode = str(h['Pincode'])
                if (tPincode == 'nan'):
                    tPincode = 999999
                else:
                    tPincode = tPincode.strip()[:6]
                    tPincode = int(tPincode.replace(" ", ""))
                h['Pincode'] = tPincode
                hospCnt += 1
                tHospId = "H{}{}_{}".format(tStateId, tDistrictId, hospCnt)
                if bModeTestData: # -1 is better to indicate Not yet entered by data owner, but for testing putting 1 for now
                    bedsInitValue = 1
                else:
                    bedsInitValue = -1
                dHosp = {
                    'Name': h['Hospital_Name'],
                    'StateId': tStateId,
                    'DistrictId': tDistrictId,
                    'PinCode': h['Pincode'],
                    'BedsICU': bedsInitValue,
                    'BedsNormal': bedsInitValue,
                    'BedsVntltr': bedsInitValue,
                    }
                dHosps[tHospId] = dHosp
                print(dHosp)
    jHosps = json.dumps(dHosps, indent=4)
    f = open("/tmp/hosps.json","wt+")
    f.write(jHosps)
    f.close()
    return dHosps


bSkipNoCatHosps = False
if (len(sys.argv) > 1) and (sys.argv[1] == 'SKIP_NOCAT_HOSPITALS'):
    bSkipNoCatHosps = True


dStates = get_statecodes("./statesuts.code.csv")
dRegions = gen_regions("hospital_directory.csv", dStates)
dHosps = gen_hosps("./hospital_directory.csv", dStates, dRegions, bSkipNoCatHosps)

# vim: set sts=4 ts=4 sw=4 expandtab: #
