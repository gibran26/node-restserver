const {response, request} = require("express");

const usuariosGet = (req = request, res = response) => {
    const {q, nombre, apiKey} = req.query;

  res.json({
    mensaje: "Get API - Controlador",
    q,
    nombre,
    apiKey
  });
};

const usuariosPost = (req, res) => {
  const { nombre, apellido, edad } = req.body;

  res.json({
    mensaje: "POST API - Controlador",
    nombre,
    apellido,
    edad,
  });
};

const usuariosPut = (req, res) => {
  const { id, nombre } = req.params;

  res.json({
    mensaje: "PUT API - Controlador",
    id,
    nombre,
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    mensaje: "DELETE API - Controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
