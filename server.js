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

tareasRef.set({
    tareaPrueba: {
        nombre: "Lavar Ropa",
        descripcion: "Tengo que poner la ropa en la la lavadora",
        creador: "usuario_id_de_firebase",
        fechaLimite: new Date(),
        completada: false,
        //fechaCompletada: new Date(),
        prioridad: 2,
        archivada: false
    },
    tareaPrueba2: {
        nombre: "Lavar Coche",
        descripcion: "Tengo que ir a REPSOL a lavar el coche",
        creador: "usuario_id_de_firebase",
        fechaLimite: new Date(),
        completada: false,
        //fechaCompletada: null,
        prioridad: 3,
        archivada: false
    }
})




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

app.get('tarea/completada', (req, res) => {
    const idTarea = req.query.idTarea;
    const tareaCompletada = db.ref("/tareas/"+idTarea);
    tareaCompletada.completada = true;
    res.send('Tarea Completada');
});

/// UN COMENTARIO QUE NO EXISTE EN LA RAMA MAIN


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});