const { v4: uuidv4 } = require("uuid");

const path = require("path");

const subirArchivo = ( files, extensionesValidas = [ 'jpg', 'gif', 'png' ], carpeta = '' ) => {

  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // validar extension
    if (!extensionesValidas.includes(extension)) {
        return reject(`La extensión ${extension} no está permitida - ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);
    // console.log('uploadPath: ', uploadPath);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemp);
    });
  });

};

module.exports = {
  subirArchivo,
};
