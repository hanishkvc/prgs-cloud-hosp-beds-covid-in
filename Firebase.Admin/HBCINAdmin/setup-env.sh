
function server_auth() {
	echo "INFO: Setting up Server Auth"
	export GOOGLE_APPLICATION_CREDENTIALS="/home/hkvctest/hkvc/Hosp-Beds-Covid-IN/SECURE/fb-service-account.json"
}

function emulator() {
	echo "ALERT: Targetting emulator"
	export FIRESTORE_EMULATOR_HOST="localhost:8080"
	export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
}

server_auth
emulator

