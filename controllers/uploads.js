const { request, response } = require("express");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Producto } = require("../models");
const { subirArchivo } = require("../helpers");

const fileUpload = async (req = request, res = response) => {
  try {
    // const nobre = await subirArchivo(req.files, ['txt', 'xlsx', 'pdf'], 'documentos' );
    const nobre = await subirArchivo(req.files);
    res.json({ nobre });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  try {
    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);

        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id ${id}` });
        }
        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id ${id}` });
        }
        break;
      default:
        return res.status(500).json({ msg: "Olvidaste validar esta opción" });
        break;
    }

    //Limpiar imagenes previas
    if (modelo.img) {
      // Se borra la imagen del servidor
      const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);

      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;

    await modelo.save({ new: true });

    res.json(modelo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error al actualizar la imagen" });
  }
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  try {
    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);

        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id ${id}` });
        }
        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id ${id}` });
        }
        break;
      default:
        return res.status(500).json({ msg: "Olvidaste validar esta opción" });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
      // Armar el PublicId
      const arrImg = modelo.img.split("/");
      const nombre = arrImg[arrImg.length - 1];
      const [nombreImg] = nombre.split(".");
      const publicId = `${coleccion}/${nombreImg}`;

      console.log("publicId: ", publicId);

      // Se puede dejar correr de forma asíncrona la eliminación de la imagen anterior (sin await)
      cloudinary.uploader.destroy(publicId);

      //   const resBorrado = await cloudinary.uploader.destroy( publicId );
      //   console.log(resBorrado);
    }

    const { tempFilePath } = req.files.archivo;

    console.log(`tempFilePath: ${tempFilePath}`);
    const respCloudinary = await cloudinary.uploader.upload(tempFilePath, {
      folder: coleccion,
    });

    console.log("Respuesta cloudinary - Upload: ", respCloudinary);

    modelo.img = respCloudinary.secure_url;

    await modelo.save({ new: true });

    res.json(modelo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error al actualizar la imagen" });
  }
};

const mostrarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  try {
    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);

        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id ${id}` });
        }
        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id ${id}` });
        }
        break;
      default:
        return res.status(500).json({ msg: "Olvidaste validar esta opción" });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
      // Se obtiene la imagen del servidor
      const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);

      if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
      }
    }

    const pathPlaceHolder = path.join(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathPlaceHolder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error al obtener la imagen" });
  }
};

const mostrarImagenCloudinary = async (req = request, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;
  
    try {
      switch (coleccion) {
        case "usuarios":
          modelo = await Usuario.findById(id);
  
          if (!modelo) {
            return res
              .status(400)
              .json({ msg: `No existe un usuario con el id ${id}` });
          }
          break;
        case "productos":
          modelo = await Producto.findById(id);
          if (!modelo) {
            return res
              .status(400)
              .json({ msg: `No existe un producto con el id ${id}` });
          }
          break;
        default:
          return res.status(500).json({ msg: "Olvidaste validar esta opción" });
      }
  
      // Obtener imagenes
      if (modelo.img) {
        // const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
  
        return res.redirect(modelo.img);
      }
  
      // Devolver Placeholder en caso de que no se tenga imagen guardada
      const pathPlaceHolder = path.join(__dirname, "../assets/no-image.jpg");
      res.sendFile(pathPlaceHolder);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error al obtener la imagen de cloudinary" });
    }
  };

module.exports = {
  fileUpload,
  actualizarImagen,
  actualizarImagenCloudinary,
  mostrarImagen,
  mostrarImagenCloudinary
};
