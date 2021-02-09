/**
 *  Require
 */
const express = require('express')
const app = express();
const port = 8080;


/**
 * Comandos GitHub:
 *  - Creamos la rama con git branch NOMBRERAMA
 *  - Nos cambiamos con git checkout NOMBRERAMA
 *  - Para unir las ramas git merge NOMBRERAMA
 *  - Es importante saber que debes ir primero a la rama que quieres actualizar con checkout porque se traerá la rama que escribas
 */

/**
 * EndPoints
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});