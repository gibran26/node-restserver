const { Router, response } = require("express");
const { check } = require("express-validator");

const { 
        validarJWT,
        validarCampos,
        isAdminRole
    } = require("../middlewares");

const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria
} = require("../controllers/categorias");

const { existsIdCategory } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorías - publico
router.get("/", obtenerCategorias);


// Obtener una categoría por id - publico
router.get("/:id", [
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdCategory),
    validarCampos
], obtenerCategoria);

// Crear categoría - privado (con token válido)
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoría - privado (con token válido)
router.put("/:id", [
    validarJWT,
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdCategory),
    // check('nombre').custom(validateCategoryName),
    validarCampos
], actualizarCategoria);

// Eliminar categoría - Admin (con token válido)
router.delete("/:id", [
    validarJWT,
    isAdminRole,
    check('id', 'El id no es válido').isMongoId().bail().custom(existsIdCategory),
    validarCampos
], borrarCategoria);


module.exports = router;