/**
 * CONFIGURACIÓN DE LA API
 */

const API_URL = "http://localhost:8080";

const consultarAPI = (endpoint, method, data = "") => {
  let options;
  if (data == "") {
    options = { method };
  } else {
    options = { method, body: JSON.stringify(data) };
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
  let prioridad = recogerInformacion("prioridad");
  console.log(nombre, fechaLimite, descripcion, prioridad);
  validarString(nombre, 35);
  validarString(descripcion, 500);
  validarInt(prioridad, 1, 5);
  validarFecha(fechaLimite);
  const nuevaTarea = {
    nombre,
    fechaLimite,
    descripcion,
    prioridad,
  };

  consultarAPI("/tarea", "POST", nuevaTarea)
    .then((data) => {
      alertaSuccess(data.msg);
      document.querySelector("#form").reset();
    })
    .catch((err) => {
      console.log(err);
      alertaError(err);
    });
});



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
