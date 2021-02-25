/**
 * CONFIGURACIÓN DE LA API
 */

const API_URL = "http://localhost:8080";

// const consultarAPI = (endpoint, method, data = "") => {
//     let options;
//     if (data == "") {
//         options = { method };
//     } else {
//         options = {
//             method,
//             body: JSON.stringify(data),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         };
//     }

//     return fetch(`${API_URL}${endpoint}`, options).then((response) => {
//         response.json()
//     });
// }

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


        //consultarAPI("/tareas", "POST", nuevaTarea)
        fetch(`${API_URL}/tareas`, {
                method: "POST",
                body: JSON.stringify(nuevaTarea),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
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
        const response = await fetch(`${API_URL}/tareas/completada/${id}`, { method: "PUT" })
        const tarea = await response.json();
        getTareas();
        alert('Tarea Marcada como Lista');
        return tarea;
    } catch (e) {
        alertaError(e);
    }
}

async function marcarArchivada(id) {
    try {
        const response = await fetch(`${API_URL}/tareas/archivar/${id}`, { method: "DELETE" })
        const tarea = await response.json();
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
    const contenedor = document.createElement("div");
    contenedor.className = "container mt-5"
    const main = document.querySelector("main");
    main.prepend(contenedor)
    const alerta = document.createElement("div");
    alerta.classList.add("alert", "alert-danger");
    alerta.innerText = msg;
    contenedor.appendChild(alerta);
    setTimeout(() => contenedor.remove(), 5000);
}

function alertaSuccess(msg) {
    const contenedor = document.createElement("div");
    contenedor.className = "container mt-5"
    const main = document.querySelector("main");
    main.prepend(contenedor)
    const alerta = document.createElement("div");
    alerta.classList.add("alert", "alert-success");
    alerta.innerText = msg;
    contenedor.appendChild(alerta);
    setTimeout(() => contenedor.remove(), 5000);
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
        const response = await fetch(`${API_URL}/tareas`)
        tareas = await response.json();
        console.log(tareas);
        actualizarContenedorTareas();
        if (tareas.msg) return alertaError('No hay tareas, prueba creando una.');
        tareas.map(tarea => {
            crearTarea(tarea._id, tarea.nombre, tarea.fechaLimite, tarea.descripcion, tarea.completada);
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


function crearTarea(idTarea, titulo, fecha, descripcion, completada) {
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
    if (completada) contenedorTarea.className = "card tarea bg-secondary";
    else contenedorTarea.className = "card tarea";

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
    if (!completada) contenedorBotones.appendChild(boton1);

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
    limpiarDom();

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
    getTareas();

}

function optionCreator(text, value, parent) {
    let option = document.createElement("option");
    option.innerText = text;
    option.value = value;
    parent.appendChild(option);
}


function limpiarDom() {
    let container = document.querySelectorAll("main .container");
    console.log(container);
    container.forEach(e=>e.remove());

    let newContainer = document.createElement("div")
    newContainer.className = "container my-5"

    let main = document.querySelector("main");
    main.appendChild(newContainer)

}

function crearFormularioRegistro() {
    limpiarDom();
    let container = document.querySelector("main .container");

    const row = document.createElement("div");
    row.className = 'row';

    let col = document.createElement("div");
    col.className = 'col-md-4';
    row.appendChild(col);

    let colRegistro = document.createElement("div");
    colRegistro.className = 'col-md-4';
    row.appendChild(colRegistro)

    let col3 = document.createElement("div");
    col3.className = 'col-md-4';
    row.appendChild(col3);

    let form = document.createElement("form");
    form.id = "register";
    colRegistro.appendChild(form);

    let tituloH5 = document.createElement("h5");
    tituloH5.innerText = 'Crear nueva cuenta';
    form.appendChild(tituloH5)

    // Crear INPUT USUARIO
    let groupUsuario = document.createElement("div");
    groupUsuario.className = "form-group mt-2";
    let inputUsuario = document.createElement("input");
    inputUsuario.type = "text";
    inputUsuario.className = "form-control"
    inputUsuario.required = true;
    inputUsuario.name = "usuario";
    inputUsuario.id = "registerUsuario";
    inputUsuario.placeholder = "Usuario";
    groupUsuario.appendChild(inputUsuario);
    form.appendChild(groupUsuario);

    // crear INPUT PASSWORD
    let groupPassword = document.createElement("div");
    groupPassword.className = "form-group mt-2";
    let inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.className = "form-control"
    inputPassword.required = true;
    inputPassword.name = "password";
    inputPassword.id = "registerPassword";
    inputPassword.placeholder = "Password";
    groupPassword.appendChild(inputPassword);
    form.appendChild(groupPassword);

    // crea boton
    let groupBoton = document.createElement("div");
    groupBoton.className = "form-group mt-2 d-grid";
    let button = document.createElement("button");
    button.type = "submit";
    button.className = "btn btn-primary";
    button.innerText = "Crear Cuenta";
    groupBoton.appendChild(button);
    form.appendChild(groupBoton);


    /// crear enlace
    let divEnlace = document.createElement("div");
    divEnlace.className = "mt-2 text-center";
    let enlace = document.createElement("a");
    enlace.className = "link";
    enlace.id = "registerLink";
    enlace.innerText = "¿Ya tienes cuenta? Entrar Ahora"
    divEnlace.appendChild(enlace);
    form.appendChild(divEnlace);




    form.addEventListener("submit", (e) => {
        e.preventDefault();
        registroUsuario();
    })

    enlace.addEventListener("click", () => {
        crearFormularioLogin();
    })

    container.appendChild(row);

}

function registroUsuario() {
    let usuario = recogerInformacion("registerUsuario");
    let password = recogerInformacion("registerPassword");
    if (validarString(usuario, 40) && validarString(password, 40)) {
        const data = {
                usuario,
                password
            }
            // consultarAPI("/user", "POST", data)
        fetch(`${API_URL}/user`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (response.status == 400) throw 'Usuario ya existe';
                return response.json();
            })
            .then(data => {
                crearFormularioLogin();
                alertaSuccess(data.msg);
            })
            .catch((e) => {
                alertaError(e);
            })
    } else {
        alertaError(e);
    }

}

function crearFormularioLogin() {
    limpiarDom();

    let container = document.querySelector("main .container");
    let contenedor1 = document.createElement("div");
    contenedor1.className = "row";
    container.appendChild(contenedor1);

    let col1 = document.createElement("div");
    col1.className = "col-md-4";
    contenedor1.appendChild(col1);

    let col2 = document.createElement("div");
    col2.className = "col-md-4";
    contenedor1.appendChild(col2);

    let col3 = document.createElement("div");
    col3.className = "col-md-4";
    contenedor1.appendChild(col3);

    let formulario = document.createElement('form');
    formulario.id = "login";
    col2.appendChild(formulario);

    let tituloFormulario = document.createElement('h5');
    tituloFormulario.innerText = "Entrar en tu cuenta";
    formulario.appendChild(tituloFormulario);

    let campo1 = document.createElement('div');
    campo1.className = "form-group mt-2";
    formulario.appendChild(campo1);

    let input1 = document.createElement('input');
    input1.type = "text";
    input1.className = "form-control";
    input1.required = true;
    input1.name = "usuario";
    input1.id = "loginUsuario";
    input1.placeholder = "Nombre de usuario";
    campo1.appendChild(input1);

    let campo2 = document.createElement('div');
    campo2.className = "form-group mt-2";
    formulario.appendChild(campo2);

    let input2 = document.createElement('input');
    input2.type = "password";
    input2.className = "form-control";
    input2.required = true;
    input2.name = "password";
    input2.id = "loginPassword";
    input2.placeholder = "Contraseña";
    campo2.appendChild(input2);

    let campo3 = document.createElement('div');
    campo3.className = "form-group d-grid mt-2";
    formulario.appendChild(campo3);

    let input3 = document.createElement('button');
    input3.type = "submit";
    input3.className = "btn btn-primary";
    campo3.appendChild(input3);
    input3.innerText="Entrar";

    let google = document.createElement('button');
    google.type = "button";
    google.className = "btn btn-success mt-2";
    campo3.appendChild(google);
    google.addEventListener('click', getOauthUrl);
    google.innerText="Google-Login";

    let campo4 = document.createElement('div');
    campo4.className = "mt-2 text-center";
    formulario.appendChild(campo4);

    let input4 = document.createElement('a');
    input4.id = "registerLink";
    input4.className = "link";
    input4.innerText = "¿No tienes cuenta? Registrate ¡Es gratis!";
    campo4.appendChild(input4);

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        loginUsuario();
    })

    input4.addEventListener("click", () => {
        crearFormularioRegistro();
    })


}


function loginUsuario() {

    let usuario = recogerInformacion("loginUsuario");
    let password = recogerInformacion("loginPassword");
    if (validarString(usuario, 40) && validarString(password, 40)) {
        const data = {
            usuario,
            password
        }
        fetch(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (response.status == '404') throw 'Usuario o contraseña incorrecta';
                return response.json()
            })
            .then((data) => {
                limpiarDom();
                crearEnlaceSalir();
                formularioCrearTarea();
            }).catch(e => {
                alertaError(e);
            })

    } else {
        alertaError(e);
    }

}

function iniciarApp() {

    fetch(`${API_URL}/verifyLoggin`)
        .then(response => {
            if (response.status == '403') throw 'No está autenticado';
            return response.json()
        })
        .then((data) => {
            crearEnlaceSalir();
            formularioCrearTarea();
        }).catch(e => {
            checkGoogleCode();
            crearFormularioLogin()
            console.log(e);
        })

}

function logout() {
    fetch(`${API_URL}/logout`)
        .then(response => response.json())
        .then((data) => {
            limpiarDom();
            crearFormularioLogin();
        }).catch(e => {
            console.log(e);
        })
}

function crearEnlaceSalir() {
    let salir = document.createElement("a");
    salir.innerText = "Salir"
    let contenedor = document.querySelector("#logout");
    contenedor.appendChild(salir);
    salir.addEventListener("click", () => {
        logout();
        salir.remove();
    })
}

function getOauthUrl(){
    fetch(`${API_URL}/oauthUrl`).then(res=>res.json()).then(data=>{
        //console.log(data);
        location.href=data.msg;
    })
}
function checkGoogleCode(){
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('code')){
        let code = urlParams.get('code');
        fetch(`${API_URL}/token?code=${code}`).then(res=>{
            if(res.status>=400) throw "No se ha podido iniciar sesión";
            return res.json();
        }).then(token=>{
            iniciarApp();
        }).catch(e=>{
            alertaError(e);
        })
    }
}

iniciarApp();
