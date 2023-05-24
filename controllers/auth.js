const { response, request } = require("express");
const bcrypt = require('bcryptjs')

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ){
            //se crea el usuario
            const data = {
                nombre,
                correo,
                password: '123',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //validar si el usuario se encuentra inactivo
        if ( !usuario.estado)
        {
            return res.status(401).json({
                msg: 'El usuario se encuentra bloqueado'
            });
        }
        
        //generar tokem
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (err) {
        console.log('Eror de google: ', err);

        res.status(500).json({
            msg: 'Error en la autenticación de google'
        });
    }


}

module.exports = {
    login,
    googleSignIn
}