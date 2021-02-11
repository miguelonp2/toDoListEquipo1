let botonEnviar = document.querySelector("#enviarInformacion");
botonEnviar.addEventListener("click",()=>{
    let nombre = recogerInformacion("nombre");
    let fechaLimite = new Date(recogerInformacion("fechaLimite"));
    let descripcion = recogerInformacion("descripcion");
    let prioridad = recogerInformacion("prioridad");
    console.log(nombre, fechaLimite, descripcion, prioridad);
    validarString(nombre, 35);
    validarString(descripcion, 500);
    validarInt(prioridad, 1, 5);
    validarFecha(fechaLimite);


})

function recogerInformacion(selector){
    return document.querySelector("#"+selector).value;
}

function validarString(string, maxLength){
    let type = typeof string;
    if(string.length > 0 && type === 'string' && string.length<maxLength){
        return true;
    }
    return false;
}
function validarInt(number, min, max){
    let type = typeof number;
    if(type === 'number' && number >=min && number<=max){
        return true;
    }
    return false;
}

function validarFecha(fecha){
    return fecha instanceof Date;
}
