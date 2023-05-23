const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Se obtiene la información del usuario
    const usuario = await Usuario.findById(uid);

    //validar que exista el usuario
    if (!usuario) {
        return res.status(401).json({
            msg: 'Token no válido - usuario inexistente en BD'
        });
    }

    //validar el estado del usuario que realiza la petición
    if (!usuario.estado) {
        return res.status(401).json({
            msg: 'Token no válido - usuario inactivo'
        });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
        console.log("Error al validar token: ", err);
        res.status(401).json({
        msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
