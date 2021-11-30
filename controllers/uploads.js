const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );    //autenticacion con cloudinary

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req, res = response) => {

    try {
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg })
    }
}


// const actualizarImagen = async ( req, res = response ) => {

//     const { coleccion, id } = req.params;   //estos nombres estan definidos en el routes/upload

//     let modelo;

//     //si no hay nada...
//     switch ( coleccion ) {
//         case 'usuarios':
//             modelo = await Usuario.findById(id);        
//             if( !modelo ){
//                 return res.status(400).json({
//                     msg: `No existe un usuario con el id ${ id }`
//                 });
//             }

//         break;
        
//         case 'productos':
//             modelo = await Producto.findById(id);        
//             if( !modelo ){
//                 return res.status(400).json({
//                     msg: `No existe un producto con el id ${ id }`
//                 });
//             }

//         break;
    
//         default:
//             return res.status(500).json({ msg: 'Falto validar esta opcion. ^^' });
//     }


//     // Limpiar imagenes previas
//     try {
//         if( modelo.img ) {
//             const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )
//             if ( fs.existsSync( pathImagen ) ) {
//                 fs.unlinkSync( pathImagen );
//             }
//         }
        

//     } catch (msg) {
//         res.status(400).json({ msg })
//     }


//     const nombre = await subirArchivo( req.files, undefined, coleccion );
//     modelo.img = nombre;

//     await modelo.save();    //grabo en la coleccion q sea



//     res.json( modelo );
// }

const actualizarImagenCloudinary = async ( req, res = response ) => {

    const { coleccion, id } = req.params;   //estos nombres estan definidos en el routes/upload

    let modelo;

    //si no hay nada...
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);        
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;
        
        case 'productos':
            modelo = await Producto.findById(id);        
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Falto validar esta opcion. ^^' });
    }

    // Limpiar imagenes previas
    if( modelo.img ) {
        const nombreArr = modelo.img.split('/');//corto toda la direccion por las barras
        const nombre = nombreArr[ nombreArr.length -1];

        const [ public_id ] = nombre.split('.')//ahora q tengo el nombre, le corto la extension
        cloudinary.uploader.destroy( public_id );   //no necesito el away xq no necesito la respuesta
    }

    // Guardar imagenes
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
    modelo.img = secure_url;

    await modelo.save();    //grabo en la coleccion q sea



    res.json( modelo );
}



const mostrarImagen = async ( req, res = response ) => {

    const { coleccion, id } = req.params;   //estos nombres estan definidos en el routes/upload

    let modelo;

    //si no hay nada...
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;
        
        case 'productos':
            modelo = await Producto.findById(id);        
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Falto validar esta opcion. ^^' });
    }


    // Limpiar imagenes previas
    try {
        if( modelo.img ) {
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )
            if ( fs.existsSync( pathImagen ) ) {
                return res.sendFile( pathImagen );
            }
        }
        

    } catch (msg) {
        res.status(400).json({ msg })
    }

    
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' )
        res.sendFile( pathImagen );

}



module.exports = {
    cargarArchivo,
    // actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
}