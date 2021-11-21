const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    // res.send('Hello World!');
    // res.json({
    //     ok: true,
    //     msg: 'get API',
    // });
    // res.status(403).json({
    //     msg: 'get API',
    // });

    // const query = req.query;
    const { q, nombre = 'valor por defecto', apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res = response) => {
    
    const { nombre, edad } = req.body;
    
    
    res.json({
        msg: 'post API - controlador', //usuario creado
        nombre, 
        edad
    });
}

const usuariosPut = (req, res = response) => {
    
    const { id } = req.params;
    
    res.json({
        msg: 'put API - controlador', //usuario actualizado
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador', // ni idea
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador', //usuario borrado
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};