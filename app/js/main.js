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

function clickBotonCrear() {
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
}

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


function formularioCrearTarea() {
    const main = document.querySelector("main");


    let container = document.createElement("div");
    container.className = "container my-5";
    main.appendChild(container);

    let card = document.createElement("div");
    card.className = "card my-5";

    let cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    let h5CardHeader = document.createElement("h5");
    h5CardHeader.innerText = "Crear nueva tarea";

    cardHeader.appendChild(h5CardHeader);
    card.appendChild(cardHeader);
    container.appendChild(card);

    let cardBody = document.createElement("div")
    cardBody.className = "card-body";
    card.appendChild(cardBody)

    let form = document.createElement("form");
    form.id = 'form'
    cardBody.appendChild(form);

    let contenedorAlertas = document.createElement("div");
    contenedorAlertas.id = "contenedorAlertas";
    form.appendChild(contenedorAlertas);

    let row = document.createElement("div");
    row.className = "row";
    form.appendChild(row);


    // CAMPO NOMBRE
    let colNombre = document.createElement("div");
    colNombre.className = "col-md-6";
    row.appendChild(colNombre)

    let grupoNombre = document.createElement("div");
    grupoNombre.className = "form-group";
    colNombre.appendChild(grupoNombre);

    let labelNombre = document.createElement("label");
    labelNombre.innerText = "Nombre";
    grupoNombre.appendChild(labelNombre);

    let inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.className = "form-control";
    inputNombre.name = "nombre";
    inputNombre.id = "nombre";
    inputNombre.placeholder = "Nombre de la tarea";
    grupoNombre.appendChild(inputNombre);

    // CAMPO FECHA
    let colFechaLimite = document.createElement("div");
    colFechaLimite.className = "col-md-6";
    row.appendChild(colFechaLimite)

    let grupoFechaLimite = document.createElement("div");
    grupoFechaLimite.className = "form-group";
    colFechaLimite.appendChild(grupoFechaLimite);

    let labelFechaLimite = document.createElement("label");
    labelFechaLimite.innerText = "Fecha Limite";
    grupoFechaLimite.appendChild(labelFechaLimite);

    let inputFechaLimite = document.createElement("input");
    inputFechaLimite.type = "date";
    inputFechaLimite.className = "form-control";
    inputFechaLimite.name = "fechaLimite";
    inputFechaLimite.id = "fechaLimite";
    grupoFechaLimite.appendChild(inputFechaLimite);

    // CAMPO DESCRIPCIÓN
    let colDescripcion = document.createElement("div");
    colDescripcion.className = "col-md-12 my-2";
    row.appendChild(colDescripcion)

    let grupoDescripcion = document.createElement("div");
    grupoDescripcion.className = "form-group";
    colDescripcion.appendChild(grupoDescripcion);

    let labelDescripcion = document.createElement("label");
    labelDescripcion.innerText = "Descripción";
    grupoDescripcion.appendChild(labelDescripcion);

    let inputDescripcion = document.createElement("textarea");
    inputDescripcion.className = "form-control";
    inputDescripcion.name = "descripcion";
    inputDescripcion.id = "descripcion";
    inputDescripcion.placeholder = "Descripción de tu tarea";
    grupoDescripcion.appendChild(inputDescripcion);

    // CAMPO PRIORIDAD
    let colPrioridad = document.createElement("div");
    colPrioridad.className = "col-md-6 my-1";
    row.appendChild(colPrioridad)

    let grupoPrioridad = document.createElement("div");
    grupoPrioridad.className = "form-group";
    colPrioridad.appendChild(grupoPrioridad);

    let labelPrioridad = document.createElement("label");
    labelPrioridad.innerText = "Prioridad";
    grupoPrioridad.appendChild(labelPrioridad);

    let inputPrioridad = document.createElement("select");
    inputPrioridad.className = "form-control";
    inputPrioridad.name = "prioridad";
    inputPrioridad.id = "prioridad";
    optionCreator("Urgente", 5, inputPrioridad);
    optionCreator("Preocupante", 4, inputPrioridad);
    optionCreator("Normal", 3, inputPrioridad);
    optionCreator("Sin estrés", 2, inputPrioridad);
    optionCreator("Relax", 1, inputPrioridad);
    grupoPrioridad.appendChild(inputPrioridad);

    // BOTON ENVIAR :O
    let colBotonEnviar = document.createElement("div");
    colBotonEnviar.className = "col-md-6 my-1";
    row.appendChild(colBotonEnviar)

    let grupoBotonEnviar = document.createElement("div");
    grupoBotonEnviar.className = "form-group d-grid";
    colBotonEnviar.appendChild(grupoBotonEnviar);

    let labelBotonEnviar = document.createElement("label");
    labelBotonEnviar.innerText = ".";
    labelBotonEnviar.style.opacity = 0;
    grupoBotonEnviar.appendChild(labelBotonEnviar);

    let inputBotonEnviar = document.createElement("button");
    inputBotonEnviar.type = "button";
    inputBotonEnviar.className = "btn btn btn-outline-primary"
    inputBotonEnviar.id = "enviarInformacion";
    inputBotonEnviar.innerText = "Crear";
    grupoBotonEnviar.appendChild(inputBotonEnviar);
    inputBotonEnviar.addEventListener("click", () => {
        clickBotonCrear();
    });

}

formularioCrearTarea();

function optionCreator(text, value, parent) {
    let option = document.createElement("option");
    option.innerText = text;
    option.value = value;
    parent.appendChild(option);
}


document.querySelector("#login").addEventListener("submit", (e) => {
    e.preventDefault();
    let usuarioLogin = recogerInformacion('usuarioLogin');
    let passwordLogin = recogerInformacion('passwordLogin');


})