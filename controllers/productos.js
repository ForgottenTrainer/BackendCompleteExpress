const { Producto } = require('../models/index')
const { response } = require("express");
const res = require("express/lib/response");



//obtenerProducto - paginado - total - populate

const obtenerProductos = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query
    const query = {estado:true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

//obtenerProducto - populate {}

const obtenerProducto = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')


    res.json(producto)
}


const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body
    
    const ProductoDB = await Producto.findOne({nombre: body.nombre});

    if(ProductoDB) { 
        return res.status(400).json({
            msg: `El producto ${ProductoDB.nombre}, ya existe`
        });
    }

    //generar la data a aguardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data)

    //Guardar en DB

    await producto.save();

    res.status(201).json(producto)

}


//ActualizarProducto

const actualizarProducto = async(req, res=response) => {
    const {id} = req.params
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

//Borrar Producto

const borrarProducto = async(req, res=response) => {
    const {id} = req.params

    //"Borrado" no fisico de la BSD
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false});

    res.json(productoBorrado)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}