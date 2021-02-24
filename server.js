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
const usuarioRef = db.ref("/usuarios");



// configuración de Express
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.static('app'));
app.use(cors());
app.use(cookieParser());
app.use(auth);

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
        usuarioRef.orderByChild('usuario').equalTo(usuario).once("value").then(snapshot => {
            console.log("snapshot user: " + snapshot.val());
            if (snapshot.val()) return true;
            return false;
        }).then((respuesta) => {
            let existeUsuario = respuesta;
            if (!existeUsuario) {
                let userInfo = saltPepperPassword(password);
                let passwordEncriptada = {
                    password: userInfo.password,
                    salt: userInfo.salt
                }
                usuarioRef.push({
                    usuario,
                    password: passwordEncriptada,
                }, (error) => {
                    if (error) res.status(400).send({ "msg": "Ha habido un error al crear el : " + error });
                    else res.status(201).send({ "msg": "Usuario creado" });
                });
            } else {
                res.status(400).send({ "msg": "el usuario introducido ya existe, pruebe con otro" });
            }
        }).catch(e => {
            res.status(400).send({ "msg": e });
        });
    } else {
        res.status(400).send({ "msg": "datos mal introducidos" });
    }
});
/**
 * Validar usuario
 */
app.post("/login", async(req, res) => {
    const { usuario, password } = req.body;
    if (isString(usuario) && isString(password)) {
        let user = (await usuarioRef.orderByChild('usuario').equalTo(usuario).once("value")).val();
        // order_pepitodecrema
        if (!user) return res.status(404).send({ msg: "Error algun dato es incorrecto" });

        let keyUser = Object.keys(user)[0];
        user = user[keyUser];

        if (verifyPassword(password, user.password)) {
            res.cookie("jwt", JWT.encode({
                "iat": new Date(),
                "sub": usuario
            }, SECRET), { httpOnly: true });
            res.send({ "msg": "You have logged in!" });
        } else {
            res.send({ "msg": "Error algun dato es incorrecto" });
        }

    } else {
        res.send({ "msg": "A username and password must be provided" });
    }
});

app.get('/verifyLoggin', (req, res) => {
    try {
        const { jwt } = req.cookies;
        const payload = JWT.decode(jwt, SECRET);
        if (payload) {
            res.status(200).send({ msg: "ok" });
        } else {
            res.status(403).send({ msg: "nop" });
        }
    } catch (e) {
        res.status(403).send({ msg: "nop" });
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.send({ msg: 'Adios :)' })
})



/**
 * CREAR TAREA
 */
app.post("/tareas", (req, res) => {
    let { nombre, fechaLimite, descripcion, prioridad } = req.body;
    const { sub: creador } = req.user;
    if (isString(descripcion) && isString(nombre) && isString(fechaLimite) && isNumber(prioridad)) {
        tareasRef.push({
            archivada: false,
            completada: false,
            creador,
            nombre,
            descripcion,
            fechaLimite,
            prioridad
        }, (error) => {
            if (error) res.status(400).send({ "msg": "Ha habido un error al crear la tarea: " + error });
            else res.status(201).send({ "msg": "Tarea creada" });
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
    const { sub: usuario } = req.user;

    const tareas = (await tareasRef.orderByChild('creador').equalTo(usuario).once("value")).val();
    if (!tareas) return res.status(404).send({ msg: "Error: no hay tareas para mostrar" });
    let tareasOrdenadas = Object.keys(tareas).map((value) => {
            return {...tareas[value], _id: value }
        })
        .sort((a, b) => b.prioridad - a.prioridad)

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