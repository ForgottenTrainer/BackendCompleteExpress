const { Categoria } = require('../models');


const existeCategoria = async(categoria = '') => {
    
    const existeCategoria = await Categorias.findOne({categoria});

    if(!existeCategoria){
        throw new Error(`El rol ${categoria} no esta registrad en la BD`)
    }
}

module.exports = {
    existeCategoria
}