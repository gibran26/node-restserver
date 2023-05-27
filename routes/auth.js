const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
const { validarCampos } = require("../middlewares");

const router = Router();

router.post("/login", [
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'El password es requerido').not().isEmpty(),
    validarCampos
], login);

router.post("/google", [
    check('id_token', 'El id_token es requerido').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;