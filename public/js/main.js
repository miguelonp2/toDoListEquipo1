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

    consultarAPI('/tarea', 'POST', nuevaTarea)

})

function recogerInformacion(selector) {
    return document.querySelector("#" + selector).value;
}