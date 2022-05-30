const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generar-jwt");
const { Googleverify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario')

const login = async(req, res = response) =>{

    const {correo, password} = req.body

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario y/o password no es correcto - correo'
            })
        }

        //Si el usuario anda activo papi
        if(usuario === false){
            return res.status(400).json({
                msg: 'Usuario y/o password no es correcto - estado false'
            })
        }
        //Verificar la password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario y/o password no es correcto - password'
            })
        }
        
        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            msg: 'Hable con el admin hay un error'
        })
    }


}
const googleSignIn = async(req, res=response) => {
    const {id_token} = req.body;

    try {
        const {correo, nombre, img} = await Googleverify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        //Si el usuario en  DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el admon, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        json.status(400).json({
            ok:false,
            msg:'El token no es valido'
        })
    }

}
module.exports = {
    login,
    googleSignIn
}