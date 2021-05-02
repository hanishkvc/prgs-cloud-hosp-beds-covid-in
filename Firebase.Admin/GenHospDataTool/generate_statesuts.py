#!/usr/bin/env python3
# Generate States/UTs/Districts/Regions json from csv files
# HanishKVC, 2021
# GPL

import pandas


p = pandas.read_csv("./statesuts.code.csv")
dStates = {}
for i in range(p.shape[0]):
	dStates[p.iloc[i,0].strip()] = p.iloc[i,1].strip()
print(dStates)

dStates['Odisha'] = dStates['Orissa']
dStates['Puducherry'] = dStates['Pondicherry']
dStates['Telangana'] = 'TS'

p=pandas.read_csv("hospital_directory.csv")
f = open("/tmp/t.1","w+")
print('{', file=f)
for s in p.State.unique():
	if s.startswith('North Twenty'):
		continue
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
		print('{:8}"DId{:02}": "{}"{}'.format(" ",i,d,tTerm), file=f)
	print("{:8}".format(' ')+"},", file=f)
print('}', file=f)
f.close()
