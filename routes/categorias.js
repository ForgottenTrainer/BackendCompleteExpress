const { Router } = require('express')
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validatos');
const { esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarjwt } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las categorias - publico
router.get('/',obtenerCategorias);

//Obtener una categoria por id
router.get('/:id',[
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear categorias - privado - cualquier persona con token valido
router.post('/',[
    validarjwt,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria);


//Actualizar registro por id
router.put('/:id', [
    validarjwt,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria);

//Borrar categoria

router.delete('/:id',[
    validarjwt,
    check('id', 'No es un id de mongo valido').isMongoId(),
    esAdminRole,
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria);

//


module.exports = router;