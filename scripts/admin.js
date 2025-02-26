const admin = require('../config/firebase')
require('dotenv').config()

const uid = process.argv[2]

if (!uid) {
    console.error('Se necesita la UID del usuario')
    process.exit(1)
}

admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
        console.log(`Custom claim 'admin' asignado al usuario ${uid}`)
        process.exit(0)
    })
    .catch((error) => {
        console.error('Error al asignar custom claim', error)
        process.exit(1)
    })