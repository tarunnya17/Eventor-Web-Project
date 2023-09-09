const admin= require('firebase-admin');
const fs = require('fs');

const adminPrivate = JSON.parse(fs.readFileSync(__dirname + '/credentials/eventor-admin.json', 'utf8'));

const orgPrivate = JSON.parse(fs.readFileSync(__dirname + '/credentials/eventor-organizers.json', 'utf8'));

// const userPrivate = require('');

try {
    var _adminApp = admin.initializeApp({
        credential: admin.credential.cert(adminPrivate)
    }, 'adminApp')
    console.log("connectded")
    
} catch {
    console.log("eRROR")
}

try {
    var _orgApp = admin.initializeApp({
        credential: admin.credential.cert(orgPrivate)
    }, 'orgApp')
    console.log("connectded org")
    
} catch {
    console.log("eRROR")
}


exports.adminApp = _adminApp;
exports.orgApp = _orgApp;