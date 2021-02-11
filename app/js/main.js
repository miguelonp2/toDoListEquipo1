let botonEnviar = document.querySelector("#enviarInformacion");
botonEnviar.addEventListener("click",()=>{
    let nombre = recogerInformacion("nombre");
    let fechaLimite = recogerInformacion("fechaLimite");
    let descripcion = recogerInformacion("descripcion");
    let prioridad = recogerInformacion("prioridad");
    console.log(nombre, fechaLimite, descripcion, prioridad);
})

function recogerInformacion(selector){
    return document.querySelector("#"+selector).value;
}