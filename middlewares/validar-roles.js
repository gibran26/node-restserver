const { request, response } = require("express");
const usuario = require("../models/usuario");

const isAdminRole = (req = request, res = response, next) => {
  //validar que se haya validado el token
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se requiere validar el token",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es un administrador`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {

    //validar que se haya validado el token
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se requiere validar el token"
      });
    }

    const { rol, nombre } = req.usuario;

    if (!roles.includes(rol)) {
        return res.status(401).json({
            msg: `El usuario debe tener alguno de los roles ( ${roles})`
          });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
