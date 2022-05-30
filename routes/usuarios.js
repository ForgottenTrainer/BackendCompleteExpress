const { Router } = require('express')
const { check } = require('express-validator')
const { usuariosPut, 
    usuariosGet, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios')
const { esRoleValido, existeEmail, existeUsariosPorId } = require('../helpers/db-validatos')
const router = Router()

const {
    validarCampos,
    validarjwt,
    tieneRol,
    esAdminRole
} = require('../middlewares')

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsariosPorId),
    check('rol').custom( esRoleValido ),
    validarCampos,
],usuariosPut)

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','Es obligatorio debe ser mas de 6 letras').isLength({min: 6}),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
],usuariosPost)

router.delete('/:id',[
    validarjwt,
    //esAdminRole,
    tieneRol('USER_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsariosPorId),
    validarCampos
] ,usuariosDelete)

router.patch('/', usuariosPatch)


module.exports = router;