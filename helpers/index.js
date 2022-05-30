const dbValidator = require('./db-validatos');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivos = require('./subir-archivos')

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivos
}