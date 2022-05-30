const { response } = require('express')
const jwt = require('jsonwebtoken')
const usuario = require('../models/usuario')
const Usuario = require('../models/usuario')

const validarjwt = async (req,res = response, next) => {
    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg:'No hay tokens'
        })
    }

    try {

        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)
        
        if(!usuario){
            return res.status(401).json({
                msg:'Token no existe en BSD'
            })
        }

        //Verificar si el uid tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token no valido'
            })
        }
        
        req.usuario = usuario
        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }

    console.log(token)

}

module.exports = {
    validarjwt
}