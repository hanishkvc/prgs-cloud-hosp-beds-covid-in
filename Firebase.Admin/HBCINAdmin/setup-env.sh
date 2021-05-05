#!/bin/bash

function server_auth() {
	echo "INFO: Setting up Server Auth"
	export GOOGLE_APPLICATION_CREDENTIALS="/home/hkvctest/hkvc/Hosp-Beds-Covid-IN/SECURE/fb-service-account.json"
}

function emulator() {
	eMode=$1
	if [ "$eMode" == "yes" ]; then
		echo "ALERT: Targetting emulator"
		export FIRESTORE_EMULATOR_HOST="localhost:8080"
		export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
	else
		echo "ALERT: Targetting Live"
		export FIRESTORE_EMULATOR_HOST=
		export FIREBASE_AUTH_EMULATOR_HOST=
	fi
}

server_auth
#emulator no
emulator yes

