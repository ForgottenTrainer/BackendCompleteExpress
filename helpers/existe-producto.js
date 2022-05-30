const { response } = require('express');
const { Producto} = require('../models');
const {Categoria} = require('../models')

const existeProducto = async(producto = '') => {
    
    const existeProducto = await Producto.findOne({producto});

    if(!existeProducto){
        throw new Error(`El rol ${producto} no esta registrad en la BD`)
    }
}

const tieneCategoria = async(req, res=response) => {
    const tieneCategoria = await Producto.findById({Categoria})

    if(!tieneCategoria){
        throw new Error(`El rol ${producto} tiene una categoria seleccionada`)
    }
}

module.exports = {
    existeProducto
}