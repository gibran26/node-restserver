const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.db");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //Paths de las rutas
    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
    };

    //Conexión con la BD
    this.connectDB();

    //middlewares
    this.middlewares();

    //rutas de la aplicación
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //Se habilita el uso de cors
    this.app.use(cors());

    //Parseo y lectura del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));

    // File upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true
      })
    );

  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto ", this.port);
    });
  }
}

module.exports = Server;
