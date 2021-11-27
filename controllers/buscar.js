const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    // 'roles',
    'usuarios',
];

//1era switch de busqueda
const buscarUsuarios = async( termino = '', res = response ) => {

    //busqueda por id de mongo
    const esMongoID = ObjectId.isValid( termino );  //Bool

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );

        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    //busqueda por nombre o por correo
    const regEx = new RegExp( termino, 'i' )    //el i q sea insensible a las mayusculas y minusculas

    const usuarios = await Usuario.find({
        $or: [  //operador or en mongo, que pase una o la otra
            {nombre: regEx},
            {correo: regEx},
        ],
        $and: [{ estado: true}]
    });

    res.json({
        results: ( usuarios ) ? [ usuarios ] : []
    })
}


//2do switch de busqueda
const buscarCategorias = async( termino = '', res = response ) => {

    //busqueda por id de mongo
    const esMongoID = ObjectId.isValid( termino );  //Bool

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );

        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    //busqueda por nombre (completo o incompleto) o por correo
    const regEx = new RegExp( termino, 'i' )    //el i q sea insensible a las mayusculas y minusculas

    const categorias = await Categoria.find({ nombre: regEx, estado: true });

    res.json({
        results: ( categorias ) ? [ categorias ] : []
    })
}


//3er switch de busqueda
const buscarProductos = async( termino = '', res = response ) => {

    //busqueda por id de mongo
    const esMongoID = ObjectId.isValid( termino );  //Bool

    if ( esMongoID ) {
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');

        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    //busqueda por nombre (completo o incompleto) o por correo
    const regEx = new RegExp( termino, 'i' )    //el i q sea insensible a las mayusculas y minusculas

    const productos = await Producto.find({ nombre: regEx, estado: true })
                            .populate('categoria', 'nombre');


    res.json({
        results: ( productos ) ? [ productos ] : []
    })
}


const buscar = ( req, res = response) => {

    const { coleccion, termino } = req.params;  //salen de la URL

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
            
        case 'productos':
            buscarProductos( termino, res );
        break;

        case 'categorias':
            buscarCategorias( termino, res );
        break;

        default:
            res.status(500).json({
                msg: 'Al backend developer, se le olvido chequear esta busqueda'
            })
    }
}

module.exports = {
    buscar
}