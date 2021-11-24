const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');   

const usuariosGet = async (req = request, res = response) => {
    // res.send('Hello World!');
    // res.json({
    //     ok: true,
    //     msg: 'get API',
    // });
    // res.status(403).json({
    //     msg: 'get API',
    // });

    // const query = req.query;
    // const { q, nombre = 'valor por defecto', apikey, page = 1, limit} = req.query;
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const usuarios = await Usuario.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limite ) )

    // const total = await Usuario.countDocuments( query )

    //coleccion de promesas
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password , salt );

    //guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password , salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador', // ni idea
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    //BORRARLO FISICAMENTE - no recomendado
    // const usuario = await Usuario.findByIdAndDelete( id );

    //DEJARLO INACCESIBLE PERO SIN BORRARLO - recomendado
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new:true } )


    res.json({
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};