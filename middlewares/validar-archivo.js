const { request, response } = require("express");


const validateFileUpload = (req = request, res = response, next ) => {

    // Se valida que se mande un archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: "No hay archivos para subor - validateFileUpload",
    });
  }

  next();
}


module.exports = {
    validateFileUpload
}