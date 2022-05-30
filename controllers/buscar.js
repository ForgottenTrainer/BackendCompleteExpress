const { response } = require("express");
const {ObjectId} = require('mongoose').Types
const {Usuarios, Categoria, Producto} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res=response) => {
    
    const esMongoID = ObjectId.isValid(termino) //true
    
    if(esMongoID){
        const usuario = await Usuarios.findById(termino);
        return res.json({
            results: (usuario) ? [usuario]: []
        })
    }

    const regex = new RegExp( termino, 'i' ); //expresion regular

    const usuarios = await Usuarios.find({
        $or: [{nombre: regex},{correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async(termino = '', res=response) => {
    const esMongoID = ObjectId.isValid(termino) //true
    
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria]: []
        })
    }

    const regex = new RegExp( termino, 'i' ); //expresion regular

    const categorias = await Categoria.find({
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino = '', res=response) => {
    
    const esMongoID = ObjectId.isValid(termino) //true
    
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto]: []
        })
    }

    const regex = new RegExp( termino, 'i' ); //expresion regular

    const productos = await Producto.find({nombre: regex, estado:true})
                            .populate('categoria','nombre');

    res.json({
        results: productos
    })

}


const buscar = (req, res=response) => {
    const { coleccion, termino } = req.params 

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.json(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categoria':
            buscarCategorias(termino, res);

        break;

        case 'productos':
            buscarProductos(termino, res);

        break;

        default:
            res.status(500).json({
                msg:'GG se me olvido hacer una busqueda o algo asi'
            })
            break;
    }

}

module.exports = buscar