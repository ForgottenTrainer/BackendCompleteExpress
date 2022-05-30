const { request } = require('express');
const { response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')

const usuariosGet = async(req = request, res) => {

    const {limite = 5, desde = 0} = req.query
    const query = {estado:true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req, res ) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre,correo,password,rol});

    //Hash contrasegna

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );
    
    //guardar en bd

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google,correo, ...resto } = req.body;

    //Todo validar contra base de datos
    if (password){
        //Encriptar la contrasegna
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg:"Put API - controlador",
        id
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:"Patch API - controller"
    })
}

const usuariosDelete = async(req, res) => {
    const {id} = req.params

    //"Borrado" no fisico de la BSD
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario)

}

module.exports = {
    usuariosPut,
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosDelete

}