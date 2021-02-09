/**
 *  Require
 */
const express = require('express')
const firebase = require("firebase-admin");

// configuración de firebase
const serviceAccount = require("./keyFirebase.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://the-bridge-e1e42-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = firebase.database();
const tareasRef = db.ref("/tareas");

// configuración de Express
const app = express();
const port = 8080;







/**
 * Comandos GitHub:
 *  - Creamos la rama con git branch NOMBRERAMA
 *  - Nos cambiamos con git checkout NOMBRERAMA
 *  - Para unir las ramas git merge NOMBRERAMA
 *  - Es importante saber que debes ir primero a la rama que quieres actualizar con checkout porque se traerá la rama que escribas
 */

/**
 * EndPoints
 */
app.get('/', (req, res) => {
    res.send('API PABLOHACE v1')
});

/// UN COMENTARIO QUE NO EXISTE EN LA RAMA MAIN


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});