const Role = require('../models/role')
const {Usuario, Categoria, Producto} = require('../models')

const esRoleValido = async(rol = '') => {
    
    const existeRol = await Role.findOne({rol});

    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrad en la BD`)
    }
}


const existeEmail = async (correo = '') => {

    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error('Email already registered')
    }
}

const existeUsariosPorId = async (id) => {

    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error('El id no existe')
    }
}

const existeCategoriaPorId = async(id) => {
    
    //Verificar 

    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria){
        throw new Error('El id no existe')
    }
}

const existeProductosPorId = async(id) => {
    
    //Verificar 

    const existeProductos = await Producto.findById(id);

    if(!existeProductos){
        throw new Error('El id no existe')
    }
}

/*Validar colecciones permitidas*/

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion}, no es jalable, ${colecciones}`)
    }
    return true
}


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsariosPorId,
    existeCategoriaPorId,
    existeProductosPorId,
    coleccionesPermitidas
}