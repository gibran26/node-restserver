const { response, request } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async ( req, res = response) => {

    const { correo, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({correo});
    
        //validar si existe el correo
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
    
        //validar si el usuario está activo
        if ( !usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
    
        //validar el password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
    
        //generar tokem
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contacte al administrador'
        });
    }
};

module.exports = {
    login
}