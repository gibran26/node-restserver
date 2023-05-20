const Role = require("../models/role");
const Usuario = require("../models/usuario");

const isValidRole = async ( rol = '') => {
    const existeRol = await Role.findOne({rol});

    if (!existeRol){
        throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
};

const existsEmail = async ( correo = '') => {
    const existeCorreo = await Usuario.findOne({ correo });
    if(existeCorreo){
        throw new Error(`El correo ${correo} ya se encuentra registrado`);
    }
};

const validateIdUser = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe en la base de datos`);
    }
};

module.exports = {
    isValidRole,
    existsEmail,
    validateIdUser
};