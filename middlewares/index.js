

const validaCompos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar-roles");
const validateFile = require('../middlewares/validar-archivo');

module.exports = {
    ...validaCompos,
    ...validarJWT,
    ...validaRoles,
    ...validateFile
}

