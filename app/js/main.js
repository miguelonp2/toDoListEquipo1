/**
 * CONFIGURACIÓN DE LA API
 */

const API_URL = 'http://localhost:8080';


const consultarAPI = (endpoint, method, data = '') => {
    let options;
    if (data == '') {
        options = { method };
    } else {
        options = { method, body: JSON.stringify(data) };
    }

    return fetch(`${API_URL}${endpoint}`, options)
        .then(response => response.json())
}

let botonEnviar = document.querySelector("#enviarInformacion");
botonEnviar.addEventListener("click", () => {
    let nombre = recogerInformacion("nombre");
    let fechaLimite = recogerInformacion("fechaLimite");
    let descripcion = recogerInformacion("descripcion");
    let prioridad = recogerInformacion("prioridad");
    console.log(nombre, fechaLimite, descripcion, prioridad);

    const nuevaTarea = {
        nombre,
        fechaLimite,
        descripcion,
        prioridad
    }

    consultarAPI('/tarea', 'POST', nuevaTarea).then(data => {
        alertaSuccess(data.msg);
        document.querySelector("#form").reset();
    }).catch(err => {
        console.log(err);
        alertaError(err);
    })

})

function recogerInformacion(selector) {
    return document.querySelector("#" + selector).value;
}

function alertaError(msg) {
    const contenedor = document.querySelector("#contenedorAlertas");
    const alerta = document.createElement("div")
    alerta.classList.add('alert', 'alert-danger')
    alerta.innerText = msg
    contenedor.appendChild(alerta);
    setTimeout(() => alerta.remove(), 5000)
}

function alertaSuccess(msg) {
    const contenedor = document.querySelector("#contenedorAlertas");
    const alerta = document.createElement("div")
    alerta.classList.add('alert', 'alert-success')
    alerta.innerText = msg
    contenedor.appendChild(alerta);
    setTimeout(() => alerta.remove(), 5000)
}