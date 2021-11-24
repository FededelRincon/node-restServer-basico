const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');   


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');    //este nombre es el q yo cree x personalizado

    if (!token) {   //si no existe el jwt, sacalo
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        //este jwt.verify da 3 cosas, el uid, el exp (expira) y el iat(creacion)
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);
            //sacar el uid del token, y meterlo en la req. Osea lo saco del header y lo meto en la req(propiedad nueva)

        //leer al usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }


        // Verificar si el uid tiene estado en true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }


        req.usuario = usuario
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })        
    }
}

module.exports = {
    validarJWT,
}