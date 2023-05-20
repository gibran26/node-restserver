const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config.db");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';

    //Conexión con la BD
    this.connectDB();

    //middlewares
    this.middlewares();

    //rutas de la aplicación
    this.routes();
  }

  async connectDB(){
    await dbConnection();
  }

  middlewares() {

    //Se habilita el uso de cors
    this.app.use(cors());

    //Parseo y lectura del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto ", this.port);
    });
  }
}

module.exports = Server;
