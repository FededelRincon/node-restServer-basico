const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validator');

const router = Router();

/**
 * {{url}}/api/productos
 */


// Obtener todos los productos - publico
router.get('/', [ 

], obtenerProductos);



// Obtener un productos por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);



// Crear un nuevo productos - privado para cualquiera con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar un producto por id - privado para cualquiera con token valido
router.put('/:id', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),//se puede actualizar nombre o precio
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);


// Borrar un producto(dejar inaccesible) - solo para admins
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);


module.exports = router;

