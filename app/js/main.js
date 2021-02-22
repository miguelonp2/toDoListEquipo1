/**
 * CONFIGURACIÓN DE LA API
 */

const API_URL = "http://localhost:8080";

const consultarAPI = (endpoint, method, data = "") => {
    let options;
    if (data == "") {
        options = { method };
    } else {
        options = {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }

    return fetch(`${API_URL}${endpoint}`, options).then((response) =>
        response.json()
    );
};

let botonEnviar = document.querySelector("#enviarInformacion");
botonEnviar.addEventListener("click", () => {
    let nombre = recogerInformacion("nombre");
    let fechaLimite = new Date(recogerInformacion("fechaLimite"));
    let descripcion = recogerInformacion("descripcion");
    let prioridad = parseInt(recogerInformacion("prioridad"));

    if (validarString(nombre, 35) &&
        validarString(descripcion, 500) &&
        validarInt(prioridad, 1, 5) &&
        validarFecha(fechaLimite)) {
        const nuevaTarea = {
            nombre,
            fechaLimite,
            descripcion,
            prioridad,
        };


        consultarAPI("/tareas", "POST", nuevaTarea)
            .then((data) => {
                alertaSuccess(data.msg);
                document.querySelector("#form").reset();
                getTareas();

            })
            .catch((err) => {
                console.log(err);
                alertaError(err);
            });
    } else {
        alertaError('Debes completar todos los campos correctamente para continuar')
    }
});

async function marcarLista(id) {
    try {
        const tarea = await consultarAPI("/tareas/completada/" + id, "PUT");
        getTareas();
        alert('Tarea Marcada como Lista');
        return tarea;
    } catch (e) {
        alertaError(e);
    }
}

async function marcarArchivada(id) {
    try {
        const tarea = await consultarAPI("/tareas/archivar/" + id, "DELETE");
        getTareas();
        alert('Tarea eliminada');
        return tarea;
    } catch (e) {
        alertaError(e);
    }
}


function recogerInformacion(selector) {
    return document.querySelector("#" + selector).value;
}

function alertaError(msg) {
    const contenedor = document.querySelector("#contenedorAlertas");
    const alerta = document.createElement("div");
    alerta.classList.add("alert", "alert-danger");
    alerta.innerText = msg;
    contenedor.appendChild(alerta);
    setTimeout(() => alerta.remove(), 5000);
}

function alertaSuccess(msg) {
    const contenedor = document.querySelector("#contenedorAlertas");
    const alerta = document.createElement("div");
    alerta.classList.add("alert", "alert-success");
    alerta.innerText = msg;
    contenedor.appendChild(alerta);
    setTimeout(() => alerta.remove(), 5000);
}

function validarString(string, maxLength) {
    let type = typeof string;
    if (string.length > 0 && type === "string" && string.length < maxLength) {
        return true;
    }
    return false;
}

function validarInt(number, min, max) {
    let type = typeof number;
    if (type === "number" && number >= min && number <= max) {
        return true;
    }
    return false;
}

function validarFecha(fecha) {
    return fecha instanceof Date;
}

async function getTareas() {
    try {
        let tareas = [];
        tareas = await consultarAPI("/tareas", "GET");
        actualizarContenedorTareas();
        if (tareas.msg) return alertaError('No hay tareas, prueba creando una.');
        tareas.map(tarea => {
            crearTarea(tarea._id, tarea.nombre, tarea.fechaLimite, tarea.descripcion);
        })
    } catch (e) {
        console.error(e);
        alertaError(e);
    }
}

function actualizarContenedorTareas() {
    const contenedorTareas = document.querySelector("#tareas");
    if (contenedorTareas) contenedorTareas.remove();
    const contenedor = document.createElement("div");
    contenedor.className = "container";
    contenedor.id = "tareas";
    const main = document.querySelector("main");
    main.appendChild(contenedor);
}




getTareas();

function crearTarea(idTarea, titulo, fecha, descripcion) {
    date = new Date(fecha);
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
        date = `${day}/0${month}/${year}`;
    } else {
        date = `${day}/${month}/${year}`;
    }
    fecha = date;
    const main = document.querySelector("#tareas");
    let contenedorTarea = document.createElement("div");
    contenedorTarea.id = idTarea;
    contenedorTarea.className = "card tarea";

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    contenedorTarea.appendChild(cardBody);

    let row = document.createElement("div");
    row.className = "row";
    cardBody.appendChild(row);

    let colMd6 = document.createElement("div");
    colMd6.className = "col-md-6";
    row.appendChild(colMd6);

    let h4 = document.createElement("h4");
    h4.innerText = titulo;
    colMd6.appendChild(h4);

    let periodo = document.createElement("span");
    periodo.className = "beforethan";
    periodo.innerText = "Hacer antes de " + fecha;
    colMd6.appendChild(periodo);

    let colMd6more = document.createElement("div");
    colMd6more.className = "col-md-6 moreInfo mt-2 mt-md-0";
    row.appendChild(colMd6more);

    let contenedorBotones = document.createElement("div");
    contenedorBotones.className = "gap-2 d-grid";
    colMd6more.appendChild(contenedorBotones);

    let boton1 = document.createElement("button");
    boton1.className = "btn btn-success";
    boton1.innerText = "Completar";
    contenedorBotones.appendChild(boton1);

    let boton2 = document.createElement("button");
    boton2.className = "btn btn-danger";
    boton2.innerText = "Borrar";
    contenedorBotones.appendChild(boton2);

    let contenedorDescripcion = document.createElement("div");
    contenedorDescripcion.className = "col-md-12 mt-2";
    row.appendChild(contenedorDescripcion);

    let small = document.createElement("small");
    small.innerText = descripcion;
    contenedorDescripcion.appendChild(small);

    main.appendChild(contenedorTarea);

    /// creamos los listeners

    boton1.addEventListener("click", () => {
        marcarLista(idTarea);
    })

    boton2.addEventListener("click", () => {
        marcarArchivada(idTarea);
    })

}