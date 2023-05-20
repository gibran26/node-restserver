const { Router } = require("express");
const { check } = require("express-validator");

const {isValidRole, existsEmail, validateIdUser} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require("../controllers/usuarios");


const router = Router();

router.get("/", usuariosGet);

router.post("/",[
    check('nombre', 'El noombre es requerido').not().isEmpty(),
    check('password', 'El password debe tener 6 caracteres mínimo').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(existsEmail),
    //check('rol', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(isValidRole),
    validarCampos
], usuariosPost);

router.put("/:id", [
    check('id', 'El id no es válido').isMongoId().bail().custom(validateIdUser),
    check('rol').custom(isValidRole),
    validarCampos
], usuariosPut);

router.delete("/:id", [
    check('id', 'El id no es válido').isMongoId().bail().custom(validateIdUser),
    validarCampos
], usuariosDelete);

module.exports = router;
