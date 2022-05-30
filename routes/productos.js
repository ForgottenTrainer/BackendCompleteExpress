const { Router } = require('express')
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductosPorId, existeCategoriaPorId } = require('../helpers/db-validatos');

const { esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarjwt } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerProductos);

//Obtener una categoria por id
router.get('/:id',[
    check('id').custom(existeProductosPorId),
    validarCampos
],obtenerProducto)

//Crear categorias - privado - cualquier persona con token valido
router.post('/',[
    validarjwt,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] , crearProducto);


//Actualizar registro por id
router.put('/:id', [
    validarjwt,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductosPorId),
    validarCampos
],actualizarProducto);

//Borrar categoria

router.delete('/:id',[
    validarjwt,
    check('id', 'No es un id de mongo valido').isMongoId(),
    esAdminRole,
    check('id').custom(existeProductosPorId),
    validarCampos
],borrarProducto);

//


module.exports = router;