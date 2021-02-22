/**
 *  Require
 */
const express = require("express");
const firebase = require("firebase-admin");
const { isDate, isNumber, isString, isBoolean } = require("./validator");

// configuración de firebase
const serviceAccount = require("./keyFirebase.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://the-bridge-e1e42-default-rtdb.europe-west1.firebasedatabase.app",
});
const db = firebase.database();
const tareasRef = db.ref("/tareas");

// configuración de Express
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.static('app'))


// tareasRef.set({
//     tareaPrueba: {
//         nombre: "Lavar Ropa",
//         descripcion: "Tengo que poner la ropa en la la lavadora",
//         //creador: "usuario_id_de_firebase",
//         fechaLimite: new Date(),
//         completada: false,
//         //fechaCompletada: new Date(),
//         prioridad: 2,
//         archivada: false,
//     },
//     tareaPrueba2: {
//         nombre: "Lavar Coche",
//         descripcion: "Tengo que ir a REPSOL a lavar el coche",
//         //creador: "usuario_id_de_firebase",
//         fechaLimite: new Date(),
//         completada: false,
//         //fechaCompletada: null,
//         prioridad: 3,
//         archivada: false,
//     },
// });

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
app.get("/", (req, res) => {
    res.send("API PABLOHACE v1");
});
/**
 * CREAR USUARIO
 */
app.post("/usuarios", (req, res) => {
    const {nombre, email, password} = req.body;
    if (isString(nombre) && isString(email) && isString(password)) {
        //¿No habría que preguntar si el nombre existe?
        usuarioRef.push({
            nombre,
            email,
            password
        }, (error) => {
            if (error)
                res.status(400).send({ "msg": "Ha habido un error al crear el : " + error });
            else
                res.status(201).send({ "msg": "Usuario creado" });
        });
    } else {
        res.status(400).send({ "msg": "datos mal introducidos" });
    }
    usuarioRef.once("value", (snapshot)=>{
        console.log(snapshot.val());
    });
});
/**
 * Validar usuario
 */
app.post("/usuarios/modificar", (req, res) => {
    const {nombre, password} = req.body;
    usuarioRef.on("child_added", (snapshot) =>{
        if (snapshot.val().nombre == nombre){
            return (snapshot.val().password == password);
        }
        else{
            return false;
        }
    });
});
/**
 * CREAR TAREA
 */
app.post("/tareas", (req, res) => {
    let { nombre, creador, fechaLimite, descripcion, prioridad } = req.body;
    creador = 'un usuario';
    if (isString(descripcion) && isString(nombre) && isString(creador) && isString(fechaLimite) && isNumber(prioridad)) {
        tareasRef.push({
            archivada: false,
            completada: false,
            creador,
            nombre,
            descripcion,
            fechaLimite,
            prioridad
        }, (error) => {
            if (error)
                res.status(400).send({ "msg": "Ha habido un error al crear la tarea: " + error });
            else
                res.status(201).send({ "msg": "Tarea creada" });
        });
    } else {
        res.status(400).send({ "msg": "datos mal introducidos" });
    }
});

app.put("/tareas/completada/:id", (req, res) => {
    const id = req.params.id
    const referencia = db.ref("/tareas/" + id);

    referencia.update({
        "completada": true,
        "date": new Date().getTime()
    }, (error) => {
        if (error) res.status(400).send({ "msg": "Ha ocurrido un error: " + error });
        else res.status(201).send({ "msg": "Tarea " + id + " marcada como completada" });
    });
});

app.get('/tareas', async(req, res) => {
    const tareas = (await tareasRef.orderByChild('completada').equalTo(false).once("value")).val();
    if (!tareas) return res.status(404).send({ msg: "Error: no hay tareas para mostrar" });
    let tareasOrdenadas = Object.keys(tareas).map((value) => {
        return {...tareas[value], _id: value }
    }).sort((a, b) => b.prioridad - a.prioridad);

    res.status(200).send(tareasOrdenadas);
})

app.delete('/tareas/archivar/:id', async(req, res) => {
    const tarea = (await tareasRef.child(req.params.id).once("value")).val();
    if (!tarea) return res.status(404).send({ msg: "Error: no existe la tarea que quieres modificar" });
    tareasRef.child(req.params.id).remove((err) => {
        if (err) return res.status(400).send({ msg: "Error en firebase, es hora de usar mongodb" });
        else return res.status(201).send({ msg: "La tarea ha sido borrada con exito" });
    });
})

/// UN COMENTARIO QUE NO EXISTE EN LA RAMA MAIN

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});