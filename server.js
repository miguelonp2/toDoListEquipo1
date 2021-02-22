/**
 *  Require
 */
const express = require("express");
const firebase = require("firebase-admin");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const JWT = require("jwt-simple");

const { isDate, isNumber, isString, isBoolean } = require("./validator");
const { checkPath, auth } = require("./auth");
const { hashString, saltPepperPassword, verifyPassword } = require("./passwordHandler");


// configuración de firebase
const serviceAccount = require("./keyFirebase.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://the-bridge-e1e42-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = firebase.database();
const tareasRef = db.ref("/tareas");
const SECRET = "pablohacesecret";



// configuración de Express
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.static('app'));
app.use(auth);
app.use(cors());
app.use(cookieParser());

/**
 * EndPoints
 */
app.get("/", (req, res) => {
    res.send("API PABLOHACE v1");
});
/**
 * CREAR USUARIO
 */
app.post("/user", async(req, res) => {
    const { usuario, password } = req.body;
    if (isString(usuario) && isString(password)) {
        usuarioRef.once()
            //¿No habría que preguntar si el nombre existe? SI :)
        usuarioRef.push({
            usuario,
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
});
/**
 * Validar usuario
 */
app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

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