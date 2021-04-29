#!/usr/bin/env python3


import pandas


p = pandas.read_csv("./statesuts.code.csv")
dStates = {}
for i in range(37):
	dStates[p.iloc[i,0].strip()] = p.iloc[i,1].strip()
print(dStates)

dStates['Odisha'] = dStates['Orissa']
dStates['Puducherry'] = dStates['Pondicherry']
dStates['Telangana'] = 'TS'

p=pandas.read_csv("hospital_directory.csv")
f = open("/tmp/t.1","w+")
for s in p.State.unique():
	if s.startswith('North Twenty'):
		continue
	print("    '{}': ".format(dStates[s])+"{", file=f)
	print("{:8}'Name': '{}',".format(" ",s), file=f)
	i = 0
	for d in p[p.State == s].District.unique():
		i += 1
		print("{:8}'DId{:02}': '{}',".format(" ",i,d), file=f)
	print("{:8}".format(' ')+"},", file=f)
f.close()
