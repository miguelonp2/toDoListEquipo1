/**
 *  Require
 */
const express = require('express')
const firebase = require("firebase-admin");
const { isDate, isNumber, isString, isBoolean } = require("./validator");


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
app.use(express.json());

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
});



/**
 * EJEMPLOS DE VALIDADORES CON EL MODULO VALIDATOR BY PABLOTEAM
 * isString para validar si es un string
 * isNumber para validar si es un número
 * isDate para validar si es una fecha
 * isBoolean para validar si es un booleano
 */

// if (isString("validador de strings")) console.log('Es un String')
// else console.log('No es un string')

// if (isNumber(289)) console.log('Es un número')
// else console.log('No es un numero')

// if (isDate(new Date())) console.log('Es una Fecha')
// else console.log('No es una fecha')

// if (isBoolean(true)) console.log("Es booleano")
// else console.log("no es booleano")

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
    res.send('API PABLOHACE v1');
});

app.update('/tareas/archivar/:id', (req, res) => {

});

/// UN COMENTARIO QUE NO EXISTE EN LA RAMA MAIN


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});