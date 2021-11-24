const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        // Verificar si el correo existe
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - correo'
            });
        }

        //Si el usuario esta activo en la DB
        if ( usuario.estado === false ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - estado: false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password ); //da un bool
        if ( !validPassword) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - password'
            });
        }


        //Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'   //no deberia suceder nunca
        })
    }
}


module.exports = {
    login,
}



