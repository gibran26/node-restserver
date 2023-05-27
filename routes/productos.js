const { Router, response } = require("express");
const { check } = require("express-validator");

const { 
        validarJWT,
        validarCampos,
        isAdminRole
    } = require("../middlewares");

const { 
    crearProducto, 
    obtenerProducto, 
    obtenerProductos, 
    actualizarProducto, 
    borrarProducto
} = require("../controllers/productos");

const { validateIdUser, existsIdCategory, existsIdProducto } = require("../helpers/db-validators");

const router = Router();

// Obtener todas los productos activos - publico
router.get("/", obtenerProductos);


// Obtener una producto por id - publico
router.get("/:id", [
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdProducto),
    validarCampos
], obtenerProducto);

// Crear producto - privado (con token válido)
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('categoria', 'El id de categoría no es válido').isMongoId().bail().custom(existsIdCategory),
    validarCampos
], crearProducto);

// Actualizar producto - privado (con token válido)
router.put("/:id", [
    validarJWT,
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdProducto),
    validarCampos
], actualizarProducto);

// Eliminar producto - Admin (con token válido)
router.delete("/:id", [
    validarJWT,
    isAdminRole,
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdProducto),
    validarCampos
], borrarProducto);


module.exports = router;