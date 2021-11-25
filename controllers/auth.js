const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIn = async ( req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {   //true
            //Tengo q crearlo xq no existe
            const data = {
                nombre,
                correo,
                password: ':P', //q ?????
                img,
                google: true,
                rol: "USER_ROLE",
            };

            usuario = new Usuario( data );
            await usuario.save()
        } 
        
        // Si el usuario de DB, o esta con estado en false, (osea borrado)
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );



        res.json({
            usuario,
            token
        })


    } catch (error) {
        
        res.status(400).json({
            ok: false,
            msg: 'El token de Google no es valido'
        })
    }




}


module.exports = {
    login,
    googleSignIn,
}



