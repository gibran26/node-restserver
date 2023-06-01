const { Router, response } = require("express");
const { check } = require("express-validator");

const { validarCampos, validateFileUpload } = require("../middlewares");
const {
    fileUpload,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary,
  } = require("../controllers/uploads");
const { validarColecciones } = require("../helpers");

const router = Router();

router.post('/', validateFileUpload, fileUpload);

router.put('/:coleccion/:id', [
    validateFileUpload,
    check('coleccion').custom( c => validarColecciones( c, [ 'usuarios', 'productos'] )),
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('coleccion').custom( c => validarColecciones( c, [ 'usuarios', 'productos'] )),
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], mostrarImagenCloudinary);
// ], mostrarImagen);


module.exports = router;